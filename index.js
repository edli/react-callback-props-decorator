/**
 * @copyright 2016, Aleksey Rubtsov alan.rubtsov@gmail.com
 *
 * The decorator may be used on methods
 * ```
 * class PartBound {
 *   @callback
 *   method () {}
 *
 *   @callback('callbackName')
 *   method () {}
 * }
 * ```
 */

'use strict';

var React = require('react');

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = callback;

/*
 * add callback invoke after original handler
 */
function callback() {
    if (arguments.length === 1 && typeof arguments[0] === 'string') {
        var callbackName = arguments[0];
        return function(target, name, descriptor) {
            return wrapHandler(target, name, descriptor, callbackName);
        };
    } else {
        return wrapHandler.apply(undefined, arguments);
    }
}

function wrapHandler(target, name, descriptor, callbackName) {
    var handler = descriptor.value;
    if (typeof handler !== 'function') {
        return descriptor;
    }

    callbackName = callbackName || getCallbackName(name);

    function invokeWrapped() {
        handler.call(this, arguments);

        if (this.props[callbackName]) {
            this.props[callbackName](arguments);
        }
    };

    return {
        configurable: true,
        value: invokeWrapped
    };
};

var UPPER = /[A-Z]/;
var LEADING_NON_UPPER = /^[^A-Z]+/;
function getCallbackName(originalName) {
    if (!UPPER.test(originalName)) {
        return 'on' + originalName.substring(0, 1).toUpperCase() + originalName.substring(1);
    } else {
        return 'on' + originalName.replace(LEADING_NON_UPPER, '');
    }
}

module.exports = exports['default'];
