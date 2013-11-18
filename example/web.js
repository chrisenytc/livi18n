/*
 * livi18n
 * https://github.com/chrisenytc/livi18n
 *
 * Copyright (c) 2013 Christopher EnyTC
 * Licensed under the MIT license.
 */

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var i18n = require('livi18n');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('livia19082012'));
app.use(express.session());
//Initialize Settings
app.use(i18n.init(app, {
  defaultLanguage: 'en',
  languages: ['en', 'sv'],
  path: __dirname + '/lang',
  cookie: false,
  socket: false,
  serveClient: true
}));
//app.use(i18n.setLanguage('en'));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));

//var io = require('socket.io').listen(server);

//Require Socket Manager
//i18n.socketManager(io);
