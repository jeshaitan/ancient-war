var gameUtils = require('./gameUtils.js');

var exports = module.exports = {};

exports.main = function(req, res, sess, db) {
  sess.history.push({type: 'shopAns', author: sess.name, description: req.body.input},
                    {type: 'lobby', author: 'Server', description: 'The shop is closed...'});
  res.render('index', {history: sess.history, user: sess.user});
}
