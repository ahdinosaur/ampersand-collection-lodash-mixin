var _ = require('lodash');
var slice = Array.prototype.slice;
var mixins = {};

// Lodash methods that we want to implement on the Collection.
var methods = module.exports._methods = [
    // arrays
    'compact',
    'difference',
    ['drop', 'rest'],
    ['findIndex', property],
    ['find', property],
    ['findLastIndex', property],
    ['first', propertyOrNumber],
    ['flatten', propertyWithFlag],
    ['head', 'first'],
    'indexOf',
    ['initial', propertyOrNumber],
    'intersection',
    ['last', propertyOrNumber],
    'lastIndexOf',
    ['object', 'zipObject'],
    'pull',
    'range',
    ['remove', property],
    ['rest', propertyOrNumber],
    'sortedIndex',
    ['tail', 'rest'],
    ['take', 'first'],
    'union',
    ['uniq', propertyWithFlag],
    ['unique', 'uniq'],
    ['unzip', 'zip'],
    'without',
    'xor',
    'zip',
    'zipObject',

    // collections
    ['all', 'every'],
    ['any', 'some'],
    'at',
    ['collect', 'map'],
    'contains',
    ['countBy', property],
    ['detect', 'find'],
    ['each', 'forEach'],
    ['eachRight', 'forEachRight'],
    ['every', property],
    ['filter', property],
    ['find', property],
    ['findLast', property],
    ['findWhere', property],
    ['foldl', 'reduce'],
    ['foldr', 'reduceRight'],
    'forEach',
    'forEachRight',
    ['groupBy', property],
    ['include', 'contains'],
    ['indexBy', property],
    ['inject', 'reduce'],
    'invoke',
    ['map', property],
    ['max', property],
    ['min', property],
    ['pluck', pluck],
    'reduce',
    'reduceRight',
    ['reject', property],
    'sample',
    ['select', 'filter'],
    'shuffle',
    'size',
    ['some', property],
    ['sortBy', property],
    'toArray',
    ['where', 'filter'],

    // objects
    'isEmpty',
    'chain',
];

//
// Utility functions
//
function pluckOne(value) {
    return function (model) {
        return model.get ? model.get(value) : model[value];
    };
}

function whereTest(attrs) {
    return function (model) {
        var value;
        for (var key in attrs) {
            value = pluckOne(key)(model);
            if (attrs[key] !== value) return false;
        }
        return true;
    };
}

function propertyIterator(value) {
    if (_.isObject(value)) {
        return whereTest(value);
    } else if (_.isString(value)) {
        return pluckOne(value);
    } else {
        return value;
    }
}

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
        var iterator = propertyIterator(value);
        return _[method](this.models, iterator, context);
    };
}

function propertyOrNumber(method) {
    return function (value, context) {
        if (_.isNumber(value)) {
            return _[method](this.models, value, context);
        } else {
            var iterator = propertyIterator(value);
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

// Mix in each Lodash method as a proxy to `Collection#models`.
function mixMethod(method) {
    var handler;
    if (_.isArray(method)) {
        if (_.isString(method[1])) {
            var alias = method[1];
            handler = function (method) {
                return function () {
                    return mixins[alias].apply(this, arguments);
                };
            };
        } else {
            handler = method[1];
        }
        method = method[0];
    } else {
        handler = simple;
    }
    if (!_[method] || !handler) return;
    mixins[method] = handler(method);
}

_.forEach(methods, mixMethod);

module.exports = mixins;
