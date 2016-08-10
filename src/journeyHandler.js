var gameUtils = require('./gameUtils.js');

var exports = module.exports = {};

exports.main = function(req, res, sess, db) {
  var willRender = false;
  sess.history.push({type: 'journeyAns', author: sess.name, description: req.body.input});
  //no journey progress
  if(!sess.step) {
    sess.step = 1;
    sess.history.push({type: 'journey', author: 'Travel Guide', description: 'Where will you journey to?'},
                      {type: 'journey', author: 'Travel Guide', description: 'Woods (W): An forboding place that eerily beckons to novice warriors.'},
                      {type: 'journey', author: 'Server', description: 'Caves (C): Dark, silent, and filled with evil creatures.'},
                      {type: 'journey', author: 'Travel Guide', description: 'Mountians (M): Unexplainable, horrifying things lurk high up here.'});
  }
  //user has chosen biome, describe enemy
  else if(sess.step == 1) {
    if(req.body.input == 'woods' || req.body.input == 'Woods' || req.body.input == 'w' || req.body.input == 'W') {
      sess.history.push({type: 'journey', author: 'Travel Guide', description: 'You venture into the shade of the canopy high above...'});
      sess.enemy = gameUtils.enemy('woods');
      sess.history.push({type: 'journey', author: 'Travel Guide', description: 'You are attacked by level ' + sess.enemy.level + " " + sess.enemy.name + '!'},
                        {type: 'journey', author: 'Travel Guide', description: 'It has ' + sess.enemy.hp + ' health!'});
      sess.step++;
    }
    else if(req.body.input == 'caves' || req.body.input == 'Caves' || req.body.input == 'c' || req.body.input == 'C') {
      sess.history.push({type: 'journey', author: 'Travel Guide', description: 'Your eyes adjust to the darkness...'});
      sess.enemy = gameUtils.enemy('caves');
      sess.history.push({type: 'journey', author: 'Travel Guide', description: 'You are attacked by level ' + sess.enemy.level + " " + sess.enemy.name + '!'},
                        {type: 'journey', author: 'Travel Guide', description: 'It has ' + sess.enemy.hp + ' health!'});
      sess.step++;
    }
    else if(req.body.input == 'mountains' || req.body.input == 'Mountains' || req.body.input == 'm' || req.body.input == 'M') {
      sess.history.push({type: 'journey', author: 'Travel Guide', description: 'As you climb, you begin to hear terrifying roars from above...'});
      sess.enemy = gameUtils.enemy('mountains');
      sess.history.push({type: 'journey', author: 'Travel Guide', description: 'You are attacked by level ' + sess.enemy.level + " " + sess.enemy.name + '!'},
                        {type: 'journey', author: 'Travel Guide', description: 'It has ' + sess.enemy.hp + ' health!'});
      sess.step++;
    }
    else {
      sess.step = null;
      sess.history.push({type: 'lobby', author: 'Travel Guide', description: 'Sorry, I don\'t understand that.'});
    }
  }
  //battle initiated, enter battle loop
  else if(sess.step == 2) {
    if(sess.enemy.spd >= gameUtils.totalSpeed(sess.user)) {
      gameUtils.enemyAction(sess);
      gameUtils.userAction(req, res, sess);
    }
    else {
      gameUtils.userAction(req, res, sess);
      gameUtils.enemyAction(sess);
    }
    //enemy is dead, victory
    if(sess.enemy.hp == 0) {
      willRender = true;
      sess.user.experience += sess.enemy.exp;
      sess.user.gold += sess.enemy.gld;
      sess.history.push({type: 'journey', author: 'Travel Guide', description: 'You killed the ' + sess.enemy.name + '!'},
                        {type: 'journey', author: 'Travel Guide', description: 'You gained ' + sess.enemy.exp + ' experience! You have ' + sess.user.experience + ' experience!'},
                        {type: 'journey', author: 'Travel Guide', description: 'You gained ' + sess.enemy.gld + ' gold! You have ' + sess.user.gold + ' gold!'});
      //check for level up
      if(sess.user.experience >= sess.user.level * 25) {
        gameUtils.levelUp(sess);
        sess.history.push({type: 'journey', author: 'Travel Guide', description: 'You\'ve reached level ' + sess.user.level + '!'});
      }
      sess.user.hp = sess.user.maxhp;
      sess.user.mp = sess.user.maxmp;
      sess.enemy = null;
      sess.step = null;
      sess.history.push({type: 'lobby', author: 'Travel Guide', description: 'You happily return to the lobby...'});
      //save progress
      db.Warriors.update(
        {name: sess.name},
        {$set: {
            level: sess.user.level,
            experience: sess.user.experience,
            gold: sess.user.gold,
            maxhp: sess.user.maxhp,
            maxmp: sess.user.maxmp,
            attack: sess.user.attack,
            defense: sess.user.defense,
            speed: sess.user.speed,
            magicAttack: sess.user.magicAttack,
            magicDefense: sess.user.magicDefense,
            charisma: sess.user.charisma,
            luck: sess.user.luck
          }
        }, function(err, record) {
          if(err)
            console.log(err);
          else {
            res.render('index', {history: sess.history, user: sess.user});
          }
        });
    }
    //user is dead, exit loop to lobby
    if(sess.user.hp == 0) {
      sess.history.push({type: 'journey', author: 'Travel Guide', description: 'You died...'});
      sess.enemy = null;
      sess.step = null;
      sess.user.hp = sess.user.maxhp;
      sess.user.mp = sess.user.maxmp;
      sess.history.push({type: 'lobby', author: 'Travel Guide', description: 'You are carried back to the lobby...'});
    }
  }
  if(!willRender)
    res.render('index', {history: sess.history, user: sess.user});
}
