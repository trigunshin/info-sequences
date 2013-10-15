var express = require('express'),
  routes = require('./routes'),
  idx = require('./routes/index'),
  tree = require('./routes/tree'),
  user = require('./routes/user'),
  bookmark = require('./routes/bookmark'),
  group = require('./routes/group'),
  http = require('http'),
  dbmux = require("./db/dbmux"),
  path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('fdahf7aeagiqaw2'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

user.set_dbmux(dbmux);
tree.set_dbmux(dbmux);
group.set_dbmux(dbmux);
bookmark.set_dbmux(dbmux);
idx.set_dbmux(dbmux);

app.get('/api/tree/:_id', tree.get);
app.post('/api/tree', tree.post);

app.get('/api/bookmark', bookmark.list);
app.get('/api/bookmark/:_id', bookmark.get);
app.post('/api/bookmark', bookmark.post);
app.put('/api/bookmark/:_id', bookmark.put);
app.delete('/api/bookmark/:_id', bookmark.delete);

//app.get('/api/user/:_id', user.get);
app.post('/api/auth', user.login);
app.post('/api/user', user.post);
app.put('/api/user/:_id', user.put);
app.delete('/api/user/:_id', user.delete);
app.post('/api/user/logout', user.logout);

app.get('/api/group', group.list);
app.get('/api/group/:_id', group.get);
app.post('/api/group', group.post);
app.put('/api/group/:_id', group.put);
app.delete('/api/group/:_id', group.delete);

app.get('/api/whoami', user.whoami);
app.get('/', routes.index);
app.post('/signup', user.signup_post);
app.get('/hyper', routes.hyper);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
