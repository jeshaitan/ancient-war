var express = require('express');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index', {actions: actions});
});

app.listen(3000, function () {
  console.log('Ancient War listening on port 3000');
});

var actions = [{author: "Server", description: "Welcome to Ancient War."}
              ,{author: "Server", description: "What is your name?"}]
