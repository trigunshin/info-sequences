var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , bookmark = require('./routes/bookmark')
  , group = require('./routes/group')
  , http = require('http')
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

app.get('/api/bookmark', bookmark.get);
app.post('/api/bookmark', bookmark.post);
app.put('/api/bookmark', bookmark.put);

app.get('/api/user', user.get);
app.post('/api/user', user.post);
app.put('/api/user', user.put);

app.get('/api/group', group.get);
app.post('/api/group', group.post);
app.put('/api/group', group.put);

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
