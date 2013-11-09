# Livi18n [![Build Status](https://travis-ci.org/chrisenytc/livi18n.png?branch=master)](https://travis-ci.org/chrisenytc/livi18n) [![Dependency Status](https://gemnasium.com/chrisenytc/livi18n.png)](https://gemnasium.com/chrisenytc/livi18n) [![NPM version](https://badge.fury.io/js/livi18n.png)](http://badge.fury.io/js/livi18n) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/chrisenytc/livi18n/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
> Internationalisation (i18n) for backend and frontend node.js

## Instalation

Install from command line

`npm install livi18n`

Install from package.json

```json
"dependencies": {
  "livi18n": "~0.1.0"
}
```
Run this command to install

`npm install`


## Getting Started

```javascript
var livi18n = require('livi18n');

//Initialize Settings
app.use(livi18n.init(app, {
  defaultLanguage: 'en',
  languages: ['en'],
  path: __dirname + '/lang',
  socket: true,
  serveClient: true
}));
//The Livi18n can only be used before the `app.route`
app.use(app.router);
```


## Documentation


#### .init(app, options, cb)

**Parameter**: `app`
**Type**: `express app`
**Example**: `var app = express();`

**Parameter**: `options`
**Type**: `JSON Object`

**Example**:
```javascript
{
  defaultLanguage: 'en',
  languages: ['en'],
  storageKey: 'lang',
  cookie: true,
  cookieSettings: {},
  socket: true,
  serveClient: true,
  path: __dirname + '/lang',
}
```

**Parameter**: `cb`
**Type**: `Function`
**Example**: `function(){};`

How to use init method

```javascript
// So the middleware init call should look like:
app.use(livi18n.init(app, {
  defaultLanguage: 'en',
  languages: ['en'],
  storageKey: 'lang',
  cookie: true,
  cookieSettings: {},
  socket: true,
  serveClient: true,
  path: __dirname + '/lang'
}));
```
It is necessary to define the `default language` and the `path`
where livi18n finds the i18n resource files.

**Available options**:

`defaultLanguage:` Define default system language (String)

`languages:` Define available languages for use in your app (Array)

`storageKey:` Define cookie and querystring name (String)

`cookie:` Enable Cookie support for currentLanguage (Boolean)

`cookieSettings:` Define Cookie settings (JSON Object)

`socket:` Enable socket support for use in Livi18n

`serveClient:` Provide clientSide API to use Livi18n on frontend (Boolean)

`path:` Define path of the language files (String)

---

#### .t(data)

**Parameter**: `data`
**Type**: `JSON Object`
**Example**: `{key: '', options: {}, defaultValue: ''};`

Provide translate method for use in requests and views

How to use this method
```javascript
livi18n.t({key: 'languageFilename.path.to.value', options: {}, defaultValue: 'Test'});
```
`key:` The first value of the `key` separated by `.` is the name of the language file where the message,
the second value is the path to the chosen message. **Example**: `{key: 'messages.welcome'}` // 'Welcome to Livi18n'

`options:` The `options` attribute receives an object with the names of the elements to be changed in the value of the message.

**MessageExample**: `Hi, :name.`
**Example**: `{name: 'Princess Bella'}` // 'Hi, Princess Bella.'

`defaultValue:` If the chosen message is not found, the value passed in `defaultValue`
will be used as the default value of the message. **Example**: `Test Value` // 'Test Value'

---

#### .p(data)

**Parameter**: `data`
**Type**: `JSON Object`
**Example**: `{key: '', options: {}, value: 14, defaultValue: ''};`


Provide pluralize method for use in requests and views

How to use this method
```javascript
livi18n.p({key: 'languageFilename.path.to.value', options: {}, value: 10, defaultValue: 'Test'});
```

`key:` The first value of the `key` separated by `.` is the name of the language file where the message,
the second value is the path to the chosen message. **Example**: `{key: 'messages.pluralized'}` // 'Bella have 4 The Vampire Diaries Books!'

`options:` The `options` attribute receives an object with the names of the elements to be changed in the value of the message.

**MessageExample**: `Hi, :name.`
**Example**: `{name: 'Princess Bella'}` // 'Hi, Princess Bella.'

`value:` The `value` attribute is a value used in the method to pluralize a chosen message,
if the value passed is greater than 1, the first value of the message will be returned, if greater than 1,
the second value of the message will be returned and pluralize a chosen message.

**MessageExample**: `:name have :&: The Vampire Diaries Book||:name have :&: The Vampire Diaries Books`

**Example**: `livi18n.p({key: 'messages.pluralized', options: {name: 'Bella'}, value: 4}); // 'Bella have 4 The Vampire Diaries Books!'`

**Info: The `:&:` is a constant that takes the value that was passed in the method.**

**Info: The `||` is the separator that separates the message for be pluralized.**

`defaultValue:` If the chosen message is not found, the value passed in `defaultValue`
will be used as the default value of the message. **Example**: `'Test Value'` // 'Test Value'

---

#### .setLanguage(language)

**Parameter**: `language`
**Type**: `String`
**Example**: `en`

The 'setLanguage' method is responsible for define current language for all requests and response between client and server.

How to use this method

```javascript
livi18n.setLanguage('en');
// or
app.use(livi18n.setLanguage('en'));
// or
req.setLanguage('en');
```

---

#### .socketManager(server)

**Parameter**: `server`
**Type**: `express server`
**Example**: `var server = app.listen(app.get('port'));`

The 'socketManager' method is responsible for managing all requests and response between client and server.

How to use this method

```javascript
livi18n.socketManager(server);
```

---

#### .socketEnabled()

Return true if socket support is enabled, if not return false

```javascript
livi18n.socketEnabled();
```

```jade
if(socketEnabled())
    script(src='/socket.io/socket.io.js')
```

---

#### .version()

Return Livi18n version.

```javascript
livi18n.version();
```

## Examples

Usage examples

#### Socket Support

Add Livi18n libraries dynamically in example/views/layout.jade
```jade
script(src='/javascripts/jquery.min.js')
script(src='/livi18n/livi18n.js')
if(socketEnabled())
    script(src='/socket.io/socket.io.js')
script(src='/javascripts/livi18n_init.js')
script(src='/javascripts/livi18n_test.js')
```
AddSocketManager in example/app.js

```javascript
// Create Server

var server = app.listen(app.get('port'));

// Show Status

console.log('Express server listening on port ' + app.get('port'));

// Require Socket Manager

// This method receive a `server` instance and manage socket requests and responses.

livi18n.socketManager(server);
```

#### Jade Example

```jade
#test-translate(data-livi18n='messages.welcome' data-options='{"name": "Princess", "nick": "Bella"}' data-default='Tested')
#test-pluralize(data-livi18n='messages.test2' data-options='{"name": "Princess", "nick": "Bella"}' data-value='10' data-default-value='Tested')
```

#### Controller Example

```javascript
exports.index = function(req, res){
  res.render('index', { title: req.t({key: 'messages.welcome'}) });
};
```

#### jQuery Example

```javascript
$('elem').livi18nT({enableOptions: true});
//
$('elem').livi18nP({enableOptions: true});
```

[See documentation of jQuery integration](https://github.com/chrisenytc/livi18n.js#jquery-integration)

#### AngularJS Example

```javascript
var demoCtrl = function($scope, $livi18n) {
    $scope.livi18ndemo = $livi18n.t(options);
        // or
    $scope.livi18ndemo = $livi18n.p(options);
};
```

[See documentation of AngularJS integration](https://github.com/chrisenytc/livi18n.js#angular-integration)

#### Example App
See example application in [example](https://github.com/chrisenytc/livi18n/tree/master/example)

See demo in [livi18n.herokuapp.com](http://livi18n.herokuapp.com/)

## JS Version

See documentation [Livi18n.js](https://github.com/chrisenytc/livi18n.js)

## Contributing

Please submit all issues and pull requests to the [chrisenytc/livi18n](http://github.com/chrisenytc/livi18n) repository!

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/chrisenytc/livi18n/issues).

## License
Copyright (c) 2013 Christopher EnyTC

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

## Release History

 * 2013-11-9    v0.1.1   Fixed error in lib/client/ngSocket.js and update example
 * 2013-11-6    v0.1.0   Initial release.

---
