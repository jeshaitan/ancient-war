var express = require('express')
  , bodyParser = require('body-parser')
  , mongodb = require('mongodb')
  , mongojs = require('mongojs')
  , session = require('express-session')
  , doRoutes = require('./src/do-routes.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'ancient-war'
               , cookie: {maxAge: 60000}
               , resave: true
               , saveUninitialized: true}));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var uri = 'mongodb://warrior:warrioruser@ds011238.mongolab.com:11238/ancient-war';
var db = mongojs(uri, ["Warriors"], {
    authMechanism: 'ScramSHA1'
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Ancient War listening on port 3000.');
});

app.get('/', function(req, res) {
  var sess = req.session;
  sess.name;
  sess.history = [{type: 'Welcome', author: 'Server', description: 'Welcome to Ancient War.'}
                , {type: 'newOrReturning', author: 'Server', description: 'Are you a new warrior?'}];
  sess.user = {
    name: '?'
  , password: '?'
  , species: '?'
  , vocation: '?'
  , hp: '?'
  , mana: '?'
  , attack: '?'
  , defense: '?'
  , speed: '?'
  , magicAttack: '?'
  , magicDefense: '?'
  , charisma: '?'
  , luck: '?'
  }
  res.render('index', {history: sess.history, user: sess.user});
});

app.post('/do', function(req, res) {
  var sess = req.session;
  if(sess.history[sess.history.length - 1].type != 'lobby')
    doRoutes.intro(req, res, sess, db);

  else if(sess.history[sess.history.length - 1].type == 'lobby') {
    doRoutes.lobby(req, res, sess, db);
  }
});
