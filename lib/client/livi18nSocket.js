/*
 * livi18n.js
 * https://github.com/chrisenytc/livi18n.js
 *
 * Copyright (c) 2013 Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

window.livi18n = function ($, $window, $document, undefined) {
    //Define Properties
    var config = {};
    var version = '0.1.0';
    var socket;
    /*
     * Private Methods
     */
    //
    // Verify the given parameters.
    //
    // So the middleware init call should look like:
    //
    //         livi18n.init('http://yourdomain', ['required', 'languagefiles'], function(translate, pluralize){
    //		        var name = translate({key: 'messages.welcome'});
    //		        console.log(name);
    //         });
    //
    // It is necessary to define the "domain" and the "require language files"
    // where livi18n finds the i18n resource files.
    var initialize = function (domain, filenames, cb) {
        //Check Dependencies
        if (undefined === jQuery) {
            console.error('jQuery is required but is not defined');
            return;
        }
        //Init Request
        socket = io.connect(domain+'/livi18n/api');
        window.socket = socket;
        //Set Properties
        config.domain = domain;
        config.filenames = filenames;
        config.data = {};
        //Define Callback
        cb = cb || function () {};
        //Init jQuery integration
        jQi();
        //Eaech filenames
        if (filenames.length === 1) {
            getData(filenames[0]);
        } else {
            $.each(filenames, function (key, val) {
                getData(val);
            });
        }
        //Trigger loaded event
        socket.on('livi18n/post', function (data) {
            if (checkData()) {
                $('body').trigger('livi18n.loaded');
            }
        });
        //On data loaded
        $('body').on('livi18n.loaded', function () {
            //Trigger callback
            cb(t, p);
        });
    };
    //
    //Provide a jQuery Integration
    //
    // How to use this method
    //
    //		$('elem').livi18nT(options);
    //                    or
    //		$('elem').livi18nT(options);
    //
    // <enableOptions> If 'enableOptions' is enabled, 
    // the data of the chosen element will be used as an option for the method.
    //
    // Example: $('elem').livi18nT({enabledOptions: true});
    //
    // Element Usage: To use the option 'enableOptions', you will need to define in your html elements,
    // data attributes to be used by the method. 
    //
    // Available attributes:
    //
    // <data-livi18n> The first value of the 'data-livi18n' separated by '.' is the name of the language file where the message,
    // the second value is the path to the chosen message. Example: data-livi18n="messages.welcome"
    //
    // <data-options> The 'options' attribute receives an object with the names of the elements to be changed in the value of the message.
    //
    // Example: data-options='{"name": "Princess Livia"}'
    //
    // <data-value> The 'value' attribute is a value used in the method to pluralize a chosen message, 
    // if the value passed is greater than 1, the first value of the message will be returned, if greater than 1, 
    // the second value of the message will be returned and pluralize a chosen message.
    //
    // Example: data-value="4"
    //
    // <data-default-value> If the chosen message is not found, the value passed in 'defaultValue'
    // will be used as the default value of the message. Example: data-default-value="Test"
    //
    var jQi = function () {
        //Translate Integration
        $.fn.livi18nT = function (options) {
            // Define default options
            options = options || {};
            //Check if the item has children
            if ($(this).children().length > 0) {
                //Receive item children
                var cItem = $(this).children();
                //Loop all children
                cItem.each(function () {
                    //Define child options
                    var cOptions = options || {};
                    //Get child data
                    var item = $(this);
                    //Get child key
                    var key = item.data('livi18n');
                    //If 'enableOptions' is enabled, 
                    //get data atrributes from this element
                    if (options.enableOptions) {
                        //Reeive data attrubutes
                        var parseOptions = item.data();
                        //Loop data
                        for (var i in parseOptions) {
                            //Save options
                            cOptions[i] = parseOptions[i];
                        }
                    }
                    //Remove data attribute
                    item.removeData();
                    //Set Key
                    cOptions.key = key;
                    //Insert translated value
                    item.text(t(cOptions));
                });
            } else {
                //Get item data
                var item = $(this);
                //Get item key
                var key = item.data('livi18n');
                //Remove data attribute
                item.removeData();
                //Set item key
                options.key = key;
                //Insert translated value
                item.text(t(options));
            }
        };
        //Pluralize Integration
        $.fn.livi18nP = function (options) {
            // Define default options
            options = options || {};
            //Check if the item has children
            if ($(this).children().length > 0) {
                //Receive item children
                var cItem = $(this).children();
                //Loop all children
                cItem.each(function () {
                    //Define child options
                    var cOptions = options || {};
                    //Get child data
                    var item = $(this);
                    //Get child key
                    var key = item.data('livi18n');
                    //If 'enableOptions' is enabled, 
                    //get data atrributes from this element
                    if (options.enableOptions) {
                        //Reeive data attrubutes
                        var parseOptions = item.data();
                        //Loop data
                        for (var i in parseOptions) {
                            //Save options
                            cOptions[i] = parseOptions[i];
                        }
                    }
                    //Remove data attribute
                    item.removeData();
                    //Set Key
                    cOptions.key = key;
                    //Insert pluralized value
                    item.text(p(cOptions));
                });
            } else {
                //Get item data
                var item = $(this);
                //Get item key
                var key = item.data('livi18n');
                //Remove data attribute
                item.removeData();
                //Set item key
                options.key = key;
                //Insert translated value
                item.text(p(options));
            }
        };
    };
    //
    // If you need to use the functions of translation and pluralization of livi18n outside the scope of the init() function, 
    // you will need to use the method require().
    //
    // So the require call should look like:
    //
    //         livi18n.require(function(translate, pluralize){
    //				//jQuery integration
    //				$('#test').livi18nT({enableOptions: true});
    //				//Native API
    //				console.log(translate({key: 'messages.welcome'}));
    //		});
    //
    var require = function (fn) {
        //On loaded event execute this function
        $('body').on('livi18n.loaded', function () {
            fn(t, p);
        });
    };
    //Get Data Property
    var getProperty = function (key, obj) {
        //Split key
        var p = key.split('.');
        //Loop and save object state
        for (var i = 0, len = p.length; i < len - 1; i++) {
            obj = obj[p[i]];
        }
        //Return object value
        return obj[p[len - 1]];
    };
    //Translate text
    var translate = function (data, key, options, defaultValue) {
        // Define default properties
        var value;
        defaultValue = defaultValue || '';
        //Try get Data Value
        try {
            value = getProperty(key, data);
        } catch (e) {
            value = undefined;
        }
        //Check if is empty
        if (value === undefined) {
            return defaultValue;
        }
        //Replace Options
        for (var o in options) {
            var pattern = ':' + o;
            var re = new RegExp(pattern, "g");
            value = value.replace(re, options[o]);
        }
        //Return Translated value
        return value;
    };
    //Pluralize
    var pluralize = function (data, key, options, nValue, defaultValue) {
        // Define default properties
        var value;
        defaultValue = defaultValue || '';
        //Try get Data Value
        try {
            value = getProperty(key, data);
        } catch (e) {
            value = undefined;
        }
        //Check if is empty
        if (value === undefined) {
            return defaultValue;
        }
        //Split Value
        var spValue = value.split('||');
        //Returns the value based on the value set.
        if (nValue > 1) {
            value = spValue[1];
        } else {
            value = spValue[0];
        }
        //Replace Options
        for (var o in options) {
            var pattern = ':' + o;
            var re = new RegExp(pattern, "g");
            value = value.replace(re, options[o]);
        }
        //Replace and provide number of value
        value = value.replace(/:&:/g, nValue);
        //Return Pluralized value
        return value;
    };
    //Check if dataStorage is loaded
    var checkData = function () {
        //Init Var
        var length = 0;
        //Loop filenames
        $.each(config.data, function () {
            length++;
        });
        //If value of length is equal to filenames length,
        // return true, if not, return false
        if (length === config.filenames.length) {
            return true;
        } else {
            return false;
        }
    };
    //Get Filename in Key
    var getFileName = function (key) {
        var string = key.split('.');
        return string[0];
    };
    //Get Keyname in Key
    var getKey = function (key) {
        var string = key.split('.');
        string.shift(0);
        var value = string.join('.');
        return value;
    };
    //Provide Getter
    var getData = function (filename) {
        //Check if data is exists in dataStorage
        if (config.data.hasOwnProperty(filename)) {
            return config.data[filename];
        } else {
            socket.emit('livi18n/get', filename);

            socket.on('livi18n/post', function (data) {
                config.data[filename] = data;
            });
        }
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
    var t = function (data) {
        var options = data.options || {};
        var defaultValue = data.defaultValue || '';
        var key = getKey(data.key);
        var filename = getFileName(data.key);
        return translate(getData(filename), key, options, defaultValue);
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
    var p = function (data) {
        var options = data.options || {};
        var defaultValue = data.defaultValue || '';
        var key = getKey(data.key);
        var value = data.value;
        var filename = getFileName(data.key);
        return pluralize(getData(filename), key, options, value, defaultValue);
    };
    /*
     * Public Methods
     */
    return {
        version: version,
        loaded: checkData,
        init: initialize,
        require: require,
        t: t,
        p: p
    };
}(jQuery, window, document, undefined);