var _ = require('lodash');
var slice = Array.prototype.slice;

var utils = require('./utils');

//
// Handlers for the various types of Lodash functions
//
function simple(method) {
    return function () {
        var args = slice.call(arguments);
        args.unshift(this.models);
        return _[method].apply(_, args);
    };
}

function property(method) {
    return function (value, context) {
        var iterator = utils.propertyIterator(value);
        return _[method](this.models, iterator, context);
    };
}

function propertyOrNumber(method) {
    return function (value, context) {
        if (_.isNumber(value)) {
            return _[method](this.models, value, context);
        } else {
            var iterator = utils.propertyIterator(value);
            return _[method](this.models, iterator, context);
        }
    };
}

function propertyWithFlag(method) {
    return function (flag, value, context) {
        if (!_.isBoolean(flag) && !_.isNull(flag)) {
            context = value;
            value = (!_.isFunction(flag) && context && context[flag] === this.models) ? null : flag;
            flag = false;
        }
        return _[method](this.models, flag, value, context);
    };
}

function pluck(method) {
    return function (string) {
        return _.invoke(this.models, 'get', string);
    };
}

module.exports = {
    simple: simple,
    property: property,
    propertyOrNumber: propertyOrNumber,
    propertyWithFlag: propertyWithFlag,
    pluck: pluck,
};
