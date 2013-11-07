/*
 * livi18n
 * https://github.com/chrisenytc/livi18n
 *
 * Copyright (c) 2013 Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

// Return Property value
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

//Parse and translate data
exports.translate = function (data, key, options, defaultValue) {
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

// Parse and pluralize
exports.pluralize = function (data, key, options, nValue, defaultValue) {
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
