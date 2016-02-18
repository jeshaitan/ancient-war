var express = require('express')
  , bodyParser = require('body-parser')
  , mongodb = require('mongodb')
  , mongojs = require('mongojs')
  , session = require('express-session');

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
  res.render('index', {history: sess.history});
});

app.post('/do', function(req, res) {
  var sess = req.session;
  //new or returning prompt
  if(sess.history[sess.history.length - 1].type == 'newOrReturning') {
    if(isYes(req.body.input)) {
      sess.history.push({type: 'new', author: 'Unknown', description: req.body.input}
                      , {type: 'createNewUser', author: 'Server', description: 'Greetings! What is your name?'});
    }
    else if(isNo(req.body.input)) {
      sess.history.push({type: 'old', author: 'Unknown', description: req.body.input}
                      , {type: 'login', author: 'Server', description: 'Welcome back. Who is this again?'});
    }
    else {
      sess.history.push({type: 'newOrReturning', author: 'Server', description: 'Sorry, I don\'t understand.'});
    }
    res.render('index', {history: sess.history});
  }
  //create new user -> step 1: register name and create password
  else if(sess.history[sess.history.length - 1].type == 'createNewUser') {
    sess.name = req.body.input;
    db.Warriors.findOne({'name': sess.name}, function(err, doc) {
      if(err)
        console.log(err);
      else {
        if(doc) {
          sess.history.push({type: 'name', author: sess.name, description: sess.name}
                          , {type: 'createNewUser', author: 'Server', description: 'A warrior with this name already exists. Give me a different name.'});
        }
        else {
          sess.history.push({type: 'name', author: sess.name, description: sess.name}
                          , {type: 'passwordPrompt1', author: 'Server', description: 'What will your password be?'});
        }
      }
      res.render('index', {history: sess.history});
    });

  }
  //create new user -> step 2: register password and list species
  else if(sess.history[sess.history.length - 1].type == 'passwordPrompt1') {
    sess.pass1 = req.body.input;
    sess.history.push({type: 'pass1', author: sess.name, description: Array(sess.pass1.length+1).join('*')})
    sess.history.push({type: 'passwordPrompt2', author: 'Server', description: 'One more time please?'});
    res.render('index', {history: sess.history});
  }
  //create new user -> step 3: register password and list species
  else if(sess.history[sess.history.length - 1].type == 'passwordPrompt2') {
    sess.pass2 = req.body.input;
    if(sess.pass1 != sess.pass2) {
      sess.history.push({type: 'pass2', author: sess.name, description: Array(sess.pass2.length+1).join('*')});
      sess.history.push({type: 'passwordPrompt1', author: 'Server', description: 'Those two passwords aren\'t the same. What will your password be?'});
    }
    else {
      sess.history.push({type: 'pass2', author: sess.name, description: Array(sess.pass2.length+1).join('*')});
      sess.history.push({type: 'chooseSpecies', author: 'Server', description: 'What species are you?'}
                      , {type: 'species', author: 'Server', description: 'Human: Ingenuitive, stubborn creatures that have an unstable balance of good and evil within them.'}
                      , {type: 'species', author: 'Server', description: 'Dwarf: Brawny and short, this species has a great sense of humor, and is mostly good.'}
                      , {type: 'species', author: 'Server', description: 'Elf: Slender, pale beings that are extremely wise, yet lack many social skills.'}
                      , {type: 'species', author: 'Server', description: 'Naga: These reptilian humanoids are cunning, persistent, and deadly.'});
    }
    res.render('index', {history: sess.history});
  }
  //create new user -> step 4: register species and list vocations
  else if(sess.history[sess.history.length - 1].type == 'species') {
    sess.history.push({type: 'speciesChoice', author: sess.name, description: req.body.input});
    if(req.body.input == 'Human' || req.body.input == 'human')
      sess.species = 'Human';
    else if(req.body.input == 'Dwarf' || req.body.input == 'dwarf')
      sess.species = 'Dwarf';
    else if(req.body.input == 'Elf' || req.body.input == 'elf')
      sess.species = 'Elf';
    else if(req.body.input == 'Naga' || req.body.input == 'naga')
      sess.species = 'Naga';
    else
      sess.history.push({type: 'species', author: 'Server', description: 'Sorry, I don\'t understand.'});
    if(sess.species) {
      sess.history.push({type: 'chooseVocation', author: 'Server', description: 'What vocation are you?'}
                      , {type: 'vocation', author: 'Server', description: 'Knight: Skilled with many weapons and armor types; have many combat-related abilities.'}
                      , {type: 'vocation', author: 'Server', description: 'Archer: Weilds ranged weaponry with great agility and patience.'}
                      , {type: 'vocation', author: 'Server', description: 'Gladiator: Excels in close-range weapons, and can bare extremely heavy loads.'}
                      , {type: 'vocation', author: 'Server', description: 'Wizard: Able to use many powerful comabt-spells.'});
    }
    res.render('index', {history: sess.history});
  }
  //create new user -> step 5: register vocation and insert new user
  else if(sess.history[sess.history.length - 1].type == 'vocation') {
    sess.history.push({type: 'vocationChoice', author: sess.name, description: req.body.input});
    if(req.body.input == 'Knight' || req.body.input == 'knight')
      sess.vocation = 'Knight';
    else if(req.body.input == 'Archer' || req.body.input == 'archer')
      sess.vocation = 'Archer';
    else if(req.body.input == 'Gladiator' || req.body.input == 'gladiator')
      sess.vocation = 'Gladiator';
    else if(req.body.input == 'Wizard' || req.body.input == 'wizard')
      sess.vocation = 'Wizard';
    else
      sess.history.push({type: 'vocation', author: 'Server', description: 'Sorry, I don\'t understand.'});
    if(sess.vocation) {
      sess.history.push({type: 'inserting', author: 'Server', description: 'I\'m memorizing your choices...'})
      var newUser = {
        name: sess.name,
        password: sess.pass2,
        species: sess.species,
        vocation: sess.vocation,
        hp: 5,
        attack: 5,
        defense: 5,
        speed: 5,
        charisma: 5,
        luck: 5,
        stealth: 5,
        magicAttack: 5,
        magicDefense: 5
      }
      db.Warriors.insert(newUser, function(err, record) {
        if(err)
          console.log(err);
        else {
          sess.history.push({type: 'lobby', author: 'Server', description: 'Welcome to the lobby, ' + sess.name + '.'});
        }
        res.render('index', {history: sess.history});
      });
    }
  }
  //login if returning user -> step 1: ask for password
  else if(sess.history[sess.history.length - 1].type == 'login') {
    sess.name = req.body.input;
    sess.history.push({type: 'name', author: sess.name, description: sess.name});
    db.Warriors.findOne({'name': sess.name}, function(err, doc) {
      if(err)
        console.log(err);
      else {
        if(doc) {
          sess.history.push({type: 'checkPass', author: 'Server', description: 'Ahh, yes. What is your password, ' + doc.name + ', the ' + doc.species + ' ' + doc.vocation + '?'});
        }
        else {
          sess.history.push({type: '', author: 'Server', description: 'I know not of a warrior named ' + sess.name + '.'}
                          , {type: 'newOrReturning', author: 'Server', description: 'Are you a new warrior?'});
        }
      }
      res.render('index', {history: sess.history});
    });
  }
  //login -> step 2: check password
  else if(sess.history[sess.history.length - 1].type == 'checkPass') {
    sess.history.push({type: 'pass', author: sess.name, description: Array(req.body.input.length+1).join('*')});
    db.Warriors.findOne({'name': sess.name, 'password': req.body.input}, function(err, doc) {
      if(err)
        console.log(err);
      else {
        if(doc)
          sess.history.push({type: 'lobby', author: 'Server', description: 'Welcome back to the lobby, ' + sess.name + '.'});
        else {
          sess.history.push({type: 'newOrReturning', author: 'Server', description: 'Sorry, I don\'t recognize a warrior with that name and password... Are you a new warrior?'});
        }
      }
      res.render('index', {history: sess.history});
    });
  }
  //lobby
  else if(sess.history[sess.history.length - 1].type == 'lobby') {

  }
});

function isYes(str) {
  return (str == 'y') || (str == 'yes') || (str == 'Y') || (str == 'Yes')
}

function isNo(str) {
  return (str == 'n') || (str == 'no') || (str == 'N') || (str == 'No')
}
