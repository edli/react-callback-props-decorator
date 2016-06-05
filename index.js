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

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = callback;

/*
 * add callback invoke after original handler
 */
function callback() {
    if (arguments.length === 0) {
        // sanitizing
        return function(target, name, descriptor) {
            return wrapHandler.apply(undefined, arguments);
        }
    } if (arguments.length === 1) {
        if (typeof arguments[0] === 'string') {
            // developer specified a callback name
            var callbackName = arguments[0];
            return function(target, name, descriptor) {
                return wrapHandler(target, name, descriptor, callbackName);
            };
        } else if (typeof arguments[0] === 'function') {
            // developer specified a value-converting function
            var converter = arguments[0];
            return function(target, name, descriptor) {
                return wrapHandler(target, name, descriptor, null, converter);
            };
        }
    } else if (arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[1] === 'function') {
        // developer specified a callback name and a value-converting function
        var callbackName = arguments[0];
        var converter = arguments[1];
        return function(target, name, descriptor) {
            return wrapHandler(target, name, descriptor, callbackName, converter);
        };
    } else {
        // non-parametrized usage
        return wrapHandler.apply(undefined, arguments);
    }
}

function wrapHandler(target, name, descriptor, callbackName, converter) {
    var handler = descriptor.value;
    if (typeof handler !== 'function') {
        return descriptor;
    }

    callbackName = callbackName || getCallbackName(name);

    function invokeWrapped() {
        handler.apply(this, arguments);

        if (this.props[callbackName]) {
            var args;
            if (converter) {
                args = converter.apply(undefined, arguments);
                args.length = Object.keys(args).length;
            } else {
                args = arguments;
            }

            this.props[callbackName].apply(undefined, args);
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
