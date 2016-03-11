var gameUtils = require('./gameUtils.js'),
    battle = require('./battleHandler.js');
var exports = module.exports = {};

exports.main = function(req, res, sess, db) {
  sess.history.push({type: 'journeyAns', author: sess.name, description: req.body.input});
  //no journey progress
  if(!sess.step) {
    sess.step = 1;
    sess.history.push({type: 'journey', author: 'Server', description: 'Where will you journey to?'},
                      {type: 'journey', author: 'Server', description: 'Woods (W): An forboding place that eerily beckons to novice warriors.'},
                      {type: 'journey', author: 'Server', description: 'Caves (C): Dark, silent, and filled with evil creatures.'},
                      {type: 'journey', author: 'Server', description: 'Mountians (M): Unexplainable, horrifying things lurk high up here.'});
  }
  //user has chosen biome
  else if(sess.step == 1) {
    if(req.body.input == 'woods' || req.body.input == 'Woods' || req.body.input == 'w' || req.body.input == 'W') {
      sess.history.push({type: 'journey', author: 'Server', description: 'You venture into the shade of the canopy high above...'});
      sess.enemy = gameUtils.enemy('woods');
      sess.history.push({type: 'journey', author: 'Server', description: 'You are attacked by level ' + sess.enemy.level + sess.enemy.name + '!'});
      sess.step++;
    }
    else if(req.body.input == 'caves' || req.body.input == 'Caves' || req.body.input == 'c' || req.body.input == 'C') {
      sess.history.push({type: 'journey', author: 'Server', description: 'Your eyes adjust to the darkness...'});
      sess.enemy = gameUtils.enemy('caves');
      sess.history.push({type: 'journey', author: 'Server', description: 'You are attacked by level ' + sess.enemy.level + sess.enemy.name + '!'});
      sess.step++;
    }
    else if(req.body.input == 'mountains' || req.body.input == 'Mountains' || req.body.input == 'm' || req.body.input == 'M') {
      sess.history.push({type: 'journey', author: 'Server', description: 'As you climb, you begin to hear terrifying roars from above...'});
      sess.enemy = gameUtils.enemy('mountains');
      sess.history.push({type: 'journey', author: 'Server', description: 'You are attacked by level ' + sess.enemy.level + sess.enemy.name + '!'});
      sess.step++;
    }
    else {
      sess.step = null;
      sess.history.push({type: 'journey', author: 'Server', description: 'Sorry, I don\'t understand that.'});
    }
  }
  res.render('index', {history: sess.history, user: sess.user});
}
