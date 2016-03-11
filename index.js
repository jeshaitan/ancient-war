var express = require('express'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'),
    mongojs = require('mongojs'),
    session = require('express-session'),
    fs = require('fs'),
    login = require('./src/loginHandler.js'),
    lobby = require('./src/lobbyHandler.js'),
    journey = require('./src/journeyHandler.js'),
    shop = require('./src/shopHandler.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'ancient-war',
                 cookie: {maxAge: 60000},
                 resave: true,
                 saveUninitialized: true}));

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
  sess.history = [{type: 'Welcome', author: 'Server', description: 'Welcome to Ancient War.'},
                  {type: 'newOrReturning', author: 'Server', description: 'Are you a new warrior?'}];
  sess.user = JSON.parse(fs.readFileSync('objects/misc.json')).unknown;

  res.render('index', {history: sess.history, user: sess.user});
});

app.post('/do', function(req, res) {
  var sess = req.session;
  //no current branch, lobby or login
  if(!sess.step) {
    if(sess.history[sess.history.length - 1].type == 'lobby')
      lobby.main(req, res, sess, db);
    else
      login.main(req, res, sess, db);
  }
  //current branch exists
  else {
    if(sess.history[sess.history.length - 1].type == 'journey')
      journey.main(req, res, sess, db);
    else if(sess.history[sess.history.length - 1].type == 'shop')
      shop.main(req, res, sess, db);
  }
});
