var _ = require('lodash');

// Lodash methods that we want to implement on the Collection.
var methods = require('./methods');
var handlers = require('./handlers');

var mixins = {};

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
        handler = handlers.simple;
    }
    if (!_[method] || !handler) return;
    mixins[method] = handler(method);
}

_.forEach(methods, mixMethod);

module.exports = mixins;
