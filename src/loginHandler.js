var gameUtils = require('./gameUtils.js');

var exports = module.exports = {};

exports.main = function(req, res, sess, db) {
  //new or returning prompt
  if(sess.history[sess.history.length - 1].type == 'newOrReturning') {
    if(gameUtils.isYes(req.body.input)) {
      sess.history.push({type: 'new', author: 'Unknown', description: req.body.input},
                        {type: 'createNewUser', author: 'Innkeeper', description: 'Greetings! What is your name?'});
    }
    else if(gameUtils.isNo(req.body.input)) {
      sess.history.push({type: 'old', author: 'Unknown', description: req.body.input},
                        {type: 'login', author: 'Innkeeper', description: 'Welcome back. Who is this again?'});
    }
    else {
      sess.history.push({type: 'newOrReturning', author: 'Innkeeper', description: 'Sorry, I don\'t understand.'});
    }
    res.render('index', {history: sess.history, user: sess.user});
  }
  //create new user -> step 1: register name and create password
  else if(sess.history[sess.history.length - 1].type == 'createNewUser') {
    sess.name = req.body.input;
    db.Warriors.findOne({'name': sess.name}, function(err, doc) {
      if(err)
        console.log(err);
      else {
        if(doc) {
          sess.history.push({type: 'name', author: sess.name, description: sess.name},
                            {type: 'createNewUser', author: 'Innkeeper', description: 'A warrior with this name already exists. Give me a different name.'});
        }
        else {
          sess.history.push({type: 'name', author: sess.name, description: sess.name},
                            {type: 'passwordPrompt1', author: 'Innkeeper', description: 'What will your password be?'});
        }
      }
      res.render('index', {history: sess.history, user: sess.user});
    });

  }
  //create new user -> step 2: register password and list species
  else if(sess.history[sess.history.length - 1].type == 'passwordPrompt1') {
    sess.pass1 = req.body.input;
    sess.history.push({type: 'pass1', author: sess.name, description: Array(sess.pass1.length+1).join('*')})
    sess.history.push({type: 'passwordPrompt2', author: 'Innkeeper', description: 'One more time please?'});
    res.render('index', {history: sess.history, user: sess.user});
  }
  //create new user -> step 3: register password and list species
  else if(sess.history[sess.history.length - 1].type == 'passwordPrompt2') {
    sess.pass2 = req.body.input;
    if(sess.pass1 != sess.pass2) {
      sess.history.push({type: 'pass2', author: sess.name, description: Array(sess.pass2.length+1).join('*')});
      sess.history.push({type: 'passwordPrompt1', author: 'Innkeeper', description: 'Those two passwords aren\'t the same. What will your password be?'});
    }
    else {
      sess.history.push({type: 'pass2', author: sess.name, description: Array(sess.pass2.length+1).join('*')});
      sess.history.push({type: 'chooseSpecies', author: 'Innkeeper', description: 'What species are you?'},
                        {type: 'species', author: 'Innkeeper', description: 'Human: Ingenuitive, stubborn creatures that have an unstable balance of good and evil within them.'},
                        {type: 'species', author: 'Innkeeper', description: 'Dwarf: Brawny and short, this species has a great sense of humor, and is mostly good.'},
                        {type: 'species', author: 'Innkeeper', description: 'Elf: Slender, pale beings that are extremely wise, yet lack many social skills.'},
                        {type: 'species', author: 'Innkeeper', description: 'Naga: These reptilian humanoids are cunning, persistent, and deadly.'});
    }
    res.render('index', {history: sess.history, user: sess.user});
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
      sess.history.push({type: 'species', author: 'Innkeeper', description: 'Sorry, I don\'t understand.'});
    if(sess.species) {
      sess.history.push({type: 'chooseVocation', author: 'Innkeeper', description: 'What vocation are you?'},
                        {type: 'vocation', author: 'Innkeeper', description: 'Knight: Skilled with many weapons and armor types; has many combat-related abilities.'},
                        {type: 'vocation', author: 'Innkeeper', description: 'Archer: Wields ranged weaponry with great agility and patience.'},
                        {type: 'vocation', author: 'Innkeeper', description: 'Gladiator: Excels in close-range weapons, and can bare extremely heavy loads.'},
                        {type: 'vocation', author: 'Innkeeper', description: 'Wizard: Able to use many powerful combat-spells.'});
    }
    res.render('index', {history: sess.history, user: sess.user});
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
      sess.history.push({type: 'vocation', author: 'Innkeeper', description: 'Sorry, I don\'t understand.'});
    if(sess.vocation) {
      sess.history.push({type: 'inserting', author: 'Innkeeper', description: 'I\'m memorizing your choices...'})
      var newUser = gameUtils.createUser(sess.name, sess.pass2, sess.species, sess.vocation);
      sess.user = newUser;
      db.Warriors.insert(newUser, function(err, record) {
        if(err)
          console.log(err);
        else {
          sess.history.push({type: 'lobby', author: 'Innkeeper', description: 'Welcome to the lobby, ' + sess.name + '.'});
        }
        res.render('index', {history: sess.history, user: sess.user});
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
          sess.history.push({type: 'checkPass', author: 'Innkeeper', description: 'Ahh, yes. What is your password, ' + doc.name + ', the ' + doc.species + ' ' + doc.vocation + '?'});
        }
        else {
          sess.history.push({type: '', author: 'Innkeeper', description: 'I know not of a warrior named ' + sess.name + '.'},
                            {type: 'newOrReturning', author: 'Innkeeper', description: 'Are you a new warrior?'});
        }
      }
      res.render('index', {history: sess.history, user: sess.user});
    });
  }
  //login -> step 2: check password
  else if(sess.history[sess.history.length - 1].type == 'checkPass') {
    sess.history.push({type: 'pass', author: sess.name, description: Array(req.body.input.length+1).join('*')});
    db.Warriors.findOne({'name': sess.name, 'password': req.body.input}, function(err, doc) {
      if(err)
        console.log(err);
      else {
        if(doc) {
          sess.user = doc;
          sess.history.push({type: 'lobby', author: 'Innkeeper', description: 'Welcome back to the lobby, ' + sess.name + '.'});
        }
        else {
          sess.history.push({type: 'newOrReturning', author: 'Innkeeper', description: 'Sorry, I don\'t recognize a warrior with that name and password... Are you a new warrior?'});
        }
      }
      res.render('index', {history: sess.history, user: sess.user});
    });
  }
}
