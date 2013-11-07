/*
 * livi18n.socket.js
 * https://github.com/chrisenytc/livi18n.socket.js
 *
 * Copyright (c) 2013 Christopher EnyTC
 * Licensed under the MIT license.
 */

// Module for provide Livi18n support
'use strict';

angular.module('ngLivi18n', []).factory('$livi18n', ['$rootScope',
    function ($rootScope) {
        return {
            t: livi18n.t,
            p: livi18n.p,
            require: livi18n.require
        };
}]);