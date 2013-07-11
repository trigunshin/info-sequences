var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , bookmark = require('./routes/bookmark')
  , group = require('./routes/group')
  , http = require('http')
  , dbmux = require("./db/dbmux")
  , path = require('path');

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
group.set_dbmux(dbmux);
bookmark.set_dbmux(dbmux);

app.get('/api/bookmark', bookmark.list);
app.get('/api/bookmark/:id', bookmark.get);
app.post('/api/bookmark', bookmark.post);
app.put('/api/bookmark/:id', bookmark.put);
app.delete('/api/bookmark/:id', bookmark.delete);

app.get('/api/user', user.list);
app.get('/api/user/:id', user.get);
app.post('/api/user', user.post);
app.put('/api/user/:id', user.put);
app.delete('/api/user/:id', user.delete);

app.get('/api/group', group.list);
app.get('/api/group/:id', group.get);
app.post('/api/group', group.post);
app.put('/api/group/:id', group.put);
app.delete('/api/group/:id', group.delete);

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
