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
  //login prompt
  if(history[history.length - 1].type == 'login') {
    if(isYes(req.body.input)) {
      history.push({type: 'new', author: 'Unknown', description: req.body.input}
                 , {type: 'namePrompt', author: 'Server', description: 'Greetings, what is your name?'});
    }
    else if(isNo(req.body.input)) {
      history.push({type: 'old', author: 'Unknown', description: req.body.input}
                 , {type: 'namePrompt', author: 'Server', description: 'Welcome back. Who is this again?'});
    }
    else {
      history.push({type: 'other', author: 'Server', description: 'Sorry, I don\'t understand.'})
    }
  }
  //refresh history
  res.render('index', {history: history});
});

var history = [{type: 'flavor', author: 'Server', description: 'Welcome to Ancient War.'}
            , {type: 'login', author: 'Server', description: 'Are you a new warrior?'}]

function isYes(str) {
  return (str == 'y') || (str == 'yes') || (str == 'Y') || (str == 'Yes')
}

function isNo(str) {
  return (str == 'n') || (str == 'no') || (str == 'N') || (str == 'No')
}
