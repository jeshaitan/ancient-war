var gameUtils = require('./gameUtils.js');

var exports = module.exports = {};

exports.main = function(req, res, sess, db) {
  sess.history.push({type: 'shopAns', author: sess.name, description: req.body.input});
  var currentDepartment;
  
  if(!sess.step) {
    sess.history.push({type: 'shop', author: 'Shopkeeper', description: 'Welcome to the Shop!'},
		      {type: 'shop', author: 'Shopkeeper', description: 'Armor (A)'},
		      {type: 'shop', author: 'Shopkeeper', description: 'Weapons (W)'},
		      {type: 'shop', author: 'Shopkeeper', description: 'Items (I)'});
    sess.step = 1;
  }
  //chose which category
  else if(sess.step == 1) {
    if(req.body.input == 'Armor' || req.body.input == 'armor' || req.body.input == 'A' || req.body.input == 'a') {
      currentDepartment = 'A';
      sess.history.push({type: 'shop', author: 'Shopkeeper', description: 'Armor available:'});
    }
    if(req.body.input == 'Weapons' || req.body.input == 'weapons' || req.body.input == 'W' || req.body.input == 'w') {
      currentDepartment = 'W';
      sess.history.push({type: 'shop', author: 'Shopkeeper', description: 'Weapons available:'});
    }
    if(req.body.input == 'Items' || req.body.input == 'items' || req.body.input == 'I' || req.body.input == 'i') {
      currentDepartment = 'I'
      sess.history.push({type: 'shop', author: 'Shopkeeper', description: 'Items available:'});
    }
    sess.step++;
  }
  else if(sess.step = 2) {
    sess.step = null;
    if(currentDepartment == 'A') {
      //TODO
    }
    else if(currentDepartment == 'W') {
      //TODO
    }
    else if(currentDepartment == 'I') {
      //TODO
    }
    sess.history.push({type: 'lobby', author: sess.name, description: req.body.input + ': \"back to the lobby!\"'});
  }

  res.render('index', {history: sess.history, user: sess.user});  
}
