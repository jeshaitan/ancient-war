var gameUtils = require('./gameUtils.js'),
    journey = require('./journeyHandler.js'),
    shop = require('./shopHandler.js');

var exports = module.exports = {};

exports.main = function(req, res, sess, db) {
  //journey handler
  if(req.body.input == 'journey' || req.body.input == 'Journey' || req.body.input == 'j' || req.body.input == 'J') {
    sess.history.push({type: 'reqJourney', author: sess.name, description: req.body.input});
    journey.main(req, res, sess, db);
  }
  //shop handler
  else if(req.body.input == 'shop' || req.body.input == 'Shop' || req.body.input == 's' || req.body.input == 'S') {
    sess.history.push({type: 'reqShop', author: sess.name, description: req.body.input});
    shop.main(req, res, sess, db);
  }
  //request unknown
  else {
    sess.history.push({type: 'reqUnknown', author: sess.name, description: req.body.input});
    sess.history.push({type: 'lobby', author: 'Server', description: 'I don\'t understand that request.'});
  }
  res.render('index', {history: sess.history, user: sess.user});
}
