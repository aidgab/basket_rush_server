
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes'),
    user = require('./routes/user'),
    files = require('./routes/files');

var http = require('http');
var path = require('path');

var app = express();
var mongoose = require('mongoose');

// all environments
app.set('db_con_string', process.env.DBCONNSTRING || 'mongodb://localhost/basket_rush');
app.set('gcm_key', process.env.GCM_KEY || 'AIzaSyCMlwvZkdVDIKqexsH3qeG2MwCzPbtdpX4');
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser({
    keepExtensions: true
}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(app.get('db_con_string'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/users/create', user.create);
app.post('/users/list', user.list);
app.post('/users/additem', user.addItem);
app.post('/users/removeitem', user.remove_item);
app.post('/users/set_push_id', user.set_push_id);

app.post('/files/upload', files.upload);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
