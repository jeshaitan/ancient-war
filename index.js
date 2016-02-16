var express = require('express')
  , bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.listen(3000, function() {
  console.log('Ancient War listening on port 3000');
});

app.get('/', function(req, res) {
  res.render('index', {history: history});
});

app.post('/do', function(req, res) {
  if(history[history.length - 1].type == 'promptName') {
    history.push({type: 'name', author: req.body.input, description: req.body.input});
  }
  res.render('index', {history: history});
});

var history = [{type: 'flavor', author: 'Server', description: 'Welcome to Ancient War.'}
            , {type: 'promptName', author: 'Server', description: 'What is your name?'}]
