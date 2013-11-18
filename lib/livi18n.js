/*
 * livi18n
 * https://github.com/chrisenytc/livi18n
 *
 * Copyright (c) 2013 Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

/*
 * Module Dependencies
 */

var path = require('path');
var events = require('events');
var emitter = new events.EventEmitter();
var parser = require('livi18n-parser');
var fs = require('fs');
var _name = 'livi18n';
var config = {};

/*
 * Events
 */

emitter.addListener('livi18n/loaded', function () {});

/*
 * Private Methods
 */

//Read FileName and return JSON data
var readLanguage = function (language, filename, async) {
  //Enable async
  async = async || false;
  //Try get language file
  try {
    //Define language path
    var languagePath = path.join(config.path, language, filename);
    var exists = fs.existsSync(languagePath);
    if (exists) {
      if (async) {
        //Return Json Data
        fs.readFile(languagePath, 'utf-8', function (err, data) {
          if (err) {throw err;}
          config.data = JSON.parse(data);
          emitter.emit('livi18n/loaded');
        });
      } else {
        //Return Json Data
        return JSON.parse(fs.readFileSync(languagePath, 'utf-8'));
      }
    } else {
      console.error(_name + ': Could not find the language file in ' + languagePath);
    }
  } catch (e) {
    console.error(_name + ': Could not find the language file in ' + languagePath);
  }
};

//Provide ClientSide API
var serveClient = function (app) {
  //Provide angularLivi18nService
  app.get('/livi18n/ngLivi18n.js', function (req, res) {
    var filepath = path.join(__dirname, 'client', 'ngLivi18n.js');
    res.sendfile(filepath);
  });
  //Check if socket is enabled
  if (config.socket) {
    //Provide SocketManager
    app.get('/livi18n/livi18n.js', function (req, res) {
      var filepath = path.join(__dirname, 'client', 'livi18nSocket.js');
      res.sendfile(filepath);
    });
    //Provide angularSocketService
    app.get('/livi18n/ngSocket.js', function (req, res) {
      var filepath = path.join(__dirname, 'client', 'ngSocket.js');
      res.sendfile(filepath);
    });
  } else {
    //Provide js library
    app.get('/livi18n/livi18n.js', function (req, res) {
      var filepath = path.join(__dirname, 'client', 'livi18n.js');
      res.sendfile(filepath);
    });
    //Provide i18n API
    app.get('/livi18n/:filename', function (req, res) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.json(readLanguage(config.currentLanguage, req.params.filename + '.json'));
    });
  }
};

//Return filename in key
var getFileName = function (key) {
  var string = key.split('.');
  return string[0] + '.json';
};

//Return the keyname
var getKey = function (key) {
  var string = key.split('.');
  string.shift(0);
  var value = string.join('.');
  return value;
};

//Check if this language exists
var languageExists = function (language) {
  for (var i in config.languages) {
    if (config.languages[i] === language) {return true;}
  }
  //
  return false;
};

/*
 * Public Methods
 */

//
// Verify the given parameters.
//
// So the middleware init call should look like:
//
//         app.use(livi18n.init(app, {
//              defaultLanguage: 'en',
//              path: __dirname + '/lang'
//         }));
//
// It is necessary to define the "default language" and the "path"
// where livi18n finds the i18n resource files.
exports.init = function (app, options, cb) {
  //Initialize App
  return function (req, res, next) {
    //Define Default Options
    config.defaultLanguage = options.defaultLanguage || 'en';
    config.languages = options.languages || ['en'];
    config.storageKey = options.storageKey || 'lang';
    config.cookie = options.cookie || false;
    config.cookieSettings = options.cookieSettings || {};
    config.socket = options.socket || false;
    config.serveClient = options.serveClient || false;
    config.path = options.path;
    //Required Options
    if (!config.path) {
      throw new Error(_name + ' Please define a path where ' + _name + ' can find your languages.');
    }
    //Check if Cookie option is enabled
    if (config.cookie) {
      //Set Cookie
      res.cookie(config.storageKey, config.defaultLanguage, options.cookieSettings);
    }
    //Check if ServeClient option is enabled
    if (config.serveClient) {
      //Provide ClientSide API
      serveClient(app);
    }
    // Register the helpers that will be used in requests and views.
    req.t = exports.t;
    req.p = exports.p;
    req.setLanguage = exports.setLanguage;
    //Register views helpers
    app.locals.t = exports.t;
    app.locals.p = exports.p;
    app.locals.socketEnabled = exports.socketEnabled;
    //
    // If the 'language' attribute is provided, it will be used, if not,
    // it will be checked if the cookie option is enabled and the cookie will
    // be used, if not, will be used to query string defined in 'config.storageKey'.
    var cookie;
    var query = (req.query[config.storageKey] === undefined) ? config.defaultLanguage : req.query[config.storageKey];
    //Check if is a signed cookie
    if(config.cookieSettings.signed) {
      cookie = (req.signedCookies[config.storageKey] === undefined) ? config.defaultLanguage : req.signedCookies[config.storageKey];
    }
    else {
      cookie = (req.cookies[config.storageKey] === undefined) ? config.defaultLanguage : req.cookies[config.storageKey];
    }
    //If cookie options is enabled, 'config.currentLanguage' receive cookie value,
    //if not, receive 'querystring' value
    //
    //Validate Cookie
    var qre = /([a-z]{2}|[a-z]{2}-[a-zA-Z]{2})$/;

    if (qre.test(cookie)) {
      cookie = cookie;
    } else {
      cookie = config.defaultLanguage;
    }
    //Validate QueryString
    if (qre.test(query)) {
      query = query;
    } else {
      query = config.defaultLanguage;
    }

    //RegExp
    var re = /\?lang=[a-z]+/;
    //Check if request is valid
    if (config.cookie) {
      //Set cookie named value of config.'storageKey' and receive current language
      res.clearCookie(config.storageKey);
      if(config.cookieSettings.maxAge === undefined) {
        config.cookieSettings.maxAge = 1000;
      }
      res.cookie(config.storageKey, cookie, config.cookieSettings);
      config.currentLanguage = cookie;
    } else {
      if (re.test(req.originalUrl)) {
        res.clearCookie(config.storageKey);
        config.currentLanguage = query;
      }
    }

    //Set Faillback language
    if (config.currentLanguage === undefined) {
      config.currentLanguage = config.defaultLanguage;
    }

    //Check if language is defined
    if (!languageExists(config.currentLanguage)) {
      config.currentLanguage = config.defaultLanguage;
    }

    //Callback
    cb = cb || function () {};
    //Run Callback
    cb();
    //Next request
    next();
  };
};

//Return true if socket is enabled
exports.socketEnabled = function () {
  if (config.socket) {
    return true;
  } else {
    return false;
  }
};

//Get Version
exports.version = function () {
  var gPackage = require(path.join(__dirname, '..', 'package.json'));
  return gPackage.version;
};

// Define Current Language
//
// How to use this method
//
//    livi18n.setLanguage('en');
//
//
exports.setLanguage = function (language) {
  //Define system language
  config.currentLanguage = language;
  return function (req, res, next) {
    console.warn(language + ' is defaut language!');
    res.clearCookie(config.storageKey);
    //Next Request
    next();
  };
};

//
// Provide translate method for use in requests and views
//
// How to use this method
//
//      livi18n.t({key: 'languageFilename.path.to.value', options: {}, defaultValue: 'Test'});
//
// <Key> The first value of the 'key' separated by '.' is the name of the language file where the message,
// the second value is the path to the chosen message. Example: {key: 'messages.welcome'} // 'Welcome to Livi18n'
//
// <options> The 'options' attribute receives an object with the names of the elements to be changed in the value of the message.
//
// MessageExample: 'Hi, :name.'
// Example: {name: 'Princess Livia'} // 'Hi, Princess Livia.'
//
// <defaultValue> If the chosen message is not found, the value passed in 'defaultValue'
// will be used as the default value of the message. Example: 'Test Value' // 'Test Value'
//
exports.t = function (data) {
  //Define default properties
  var options = data.options || {};
  var defaultValue = data.defaultValue || '';
  var key = getKey(data.key);
  //Get language data
  var sData = readLanguage(config.currentLanguage, getFileName(data.key));
  //Return translated value
  return parser.translate(sData, key, options, defaultValue);
};

//
// Provide pluralize method for use in requests and views
//
// How to use this method
//
//      livi18n.p({key: 'languageFilename.path.to.value', options: {}, value: 10, defaultValue: 'Test'});
//
// <Key> The first value of the 'key' separated by '.' is the name of the language file where the message,
// the second value is the path to the chosen message. Example: {key: 'messages.pluralized'} // 'Livia have 4 The Vampire Diaries Books!'
//
// <options> The 'options' attribute receives an object with the names of the elements to be changed in the value of the message.
//
// MessageExample: 'Hi, :name.'
// Example: {name: 'Princess Livia'} // 'Hi, Princess Livia.'
//
// <value> The 'value' attribute is a value used in the method to pluralize a chosen message,
// if the value passed is greater than 1, the first value of the message will be returned, if greater than 1,
// the second value of the message will be returned and pluralize a chosen message.
//
// MessageExample: ':name have :&: The Vampire Diaries Book||:name have :&: The Vampire Diaries Books'
// Example: livi18n.p({key: 'messages.pluralized', options: {name: 'Livia'}, value: 4}); // 'Livia have 4 The Vampire Diaries Books!'
//
// Info: The ':&:' is a constant that takes the value that was passed in the method.
// info: The '||' is the separator that separates the message for be pluralized.
//
//
// <defaultValue> If the chosen message is not found, the value passed in 'defaultValue'
// will be used as the default value of the message. Example: 'Test Value' // 'Test Value'
//
exports.p = function (data) {
  //Define default properties
  var options = data.options || {};
  var defaultValue = data.defaultValue || '';
  var value = data.value;
  var key = getKey(data.key);
  //Get language data
  var sData = readLanguage(config.currentLanguage, getFileName(data.key));
  //Return pluralized value
  return parser.pluralize(sData, key, options, value, defaultValue);
};

//Initialize Socket.io Manager
//
// How to use this method
//
//    var io = require('socket.io').listen(server);
//
//    livi18n.socketManager(io);
//
//
exports.socketManager = function (io) {

  //Sockets
  io.of('/livi18n/api').on('connection', function (socket) {

    //Requests
    socket.on('livi18n/get', function (data) {
      //responses
      readLanguage(config.currentLanguage, data + '.json', true);
      //On File Read
      emitter.on('livi18n/loaded', function () {
        socket.emit('livi18n/post', config.data);
      });
    });

  });
};
