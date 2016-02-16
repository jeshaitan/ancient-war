var express = require('express')
  , bodyParser = require('body-parser')
  , mongodb = require('mongodb')
  , mongojs = require('mongojs');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

var uri = 'mongodb://warrior:warrioruser@ds011238.mongolab.com:11238/ancient-war';
var db = mongojs(uri, ["Warriors"], {
    authMechanism: 'ScramSHA1'
});

app.listen(3000, function() {
  console.log('Ancient War listening on port 3000.');
});

app.get('/', function(req, res) {
  res.render('index', {history: history});
});

app.post('/do', function(req, res) {
  //new or returning prompt
  if(history[history.length - 1].type == 'newOrReturning') {
    if(isYes(req.body.input)) {
      history.push({type: 'new', author: 'Unknown', description: req.body.input}
                 , {type: 'createNewUser', author: 'Server', description: 'Greetings, what is your name?'});
    }
    else if(isNo(req.body.input)) {
      history.push({type: 'old', author: 'Unknown', description: req.body.input}
                 , {type: 'login', author: 'Server', description: 'Welcome back. Who is this again?'});
    }
    else {
      history.push({type: 'newOrReturning', author: 'Server', description: 'Sorry, I don\'t understand.'});
    }
  }

  //create new user -> step 1: register name and list species
  else if(history[history.length - 1].type == 'createNewUser') {
    var name = req.body.input;
    history.push({type: 'nameChoice', author: name, description: name}
               , {type: 'chooseSpecies', author: 'Server', description: 'What species are you?'}
               , {type: 'species', author: 'Server', description: 'Human: Ingenuitive, stubborn creatures that have an unstable balance of good and evil within them.'}
               , {type: 'species', author: 'Server', description: 'Dwarf: Brawny and short, this species has a great sense of humor, and is mostly good.'}
               , {type: 'species', author: 'Server', description: 'Elf: Slender, pale beings that are extremely wise, yet lack many social skills.'}
               , {type: 'species', author: 'Server', description: 'Naga: These reptilian humanoids are cunning, persistent, and deadly.'});
  }
  //create new user -> step 2: register species and list vocations
  else if(history[history.length - 1].type == 'species') {
    history.push({type: 'speciesChoice', author: name, description: req.body.input});
    if(req.body.input == 'Human' || req.body.input == 'human')
      var species = 'Human';
    if(req.body.input == 'Dwarf' || req.body.input == 'dwarf')
      var species = 'Dwarf';
    if(req.body.input == 'Elf' || req.body.input == 'elf')
      var species = 'Elf';
    if(req.body.input == 'Naga' || req.body.input == 'naga')
      var species = 'Naga';
    else
      history.push({type: 'species', author: 'Server', description: 'Sorry, I don\'t understand.'});
    if(species) {
      history.push({type: 'chooseVocation', author: 'Server', description: 'What vocation are you?'}
                 , {type: 'vocation', author: 'Server', description: 'Knight: Skilled with many weapons and armor types; have many combat-related abilities.'}
                 , {type: 'vocation', author: 'Server', description: 'Archer: Weilds ranged weaponry with great agility and patience.'}
                 , {type: 'vocation', author: 'Server', description: 'Gladiator: Excels in close-range weapons, and can bare extremely heavy loads.'}
                 , {type: 'vocation', author: 'Server', description: 'Wizard: Able to use many powerful comabt-spells.'});
    }
  }
  //create new user -> step 3: register vocation and insert new user
  else if(history[history.length - 1].type == 'vocation') {
    history.push({type: 'vocationChoice', author: name, description: req.body.input});
    if(req.body.input == 'Knight' || req.body.input == 'knight')
      var vocation = 'Knight';
    if(req.body.input == 'Archer' || req.body.input == 'archer')
      var vocation = 'Archer';
    if(req.body.input == 'Gladiator' || req.body.input == 'gladiator')
      var vocation = 'Gladiator';
    if(req.body.input == 'Wizard' || req.body.input == 'wizard')
      var vocation = 'Wizard';
    else
      history.push({type: 'vocation', author: 'Server', description: 'Sorry, I don\'t understand.'});
    if(vocation) {
      history.push({type: 'inserting', author: 'Server', description: 'I\'m memorizing your choices...'})
      var newUser = {
        name: name,
        //TODO
      }
      db.Warriors.insert(newUser, function(err, record) {
        //TODO
      });
    }
  }

  //refresh history
  res.render('index', {history: history});

});

var history = [{type: 'flavor', author: 'Server', description: 'Welcome to Ancient War.'}
            , {type: 'newOrReturning', author: 'Server', description: 'Are you a new warrior?'}]

function isYes(str) {
  return (str == 'y') || (str == 'yes') || (str == 'Y') || (str == 'Yes')
}

function isNo(str) {
  return (str == 'n') || (str == 'no') || (str == 'N') || (str == 'No')
}
