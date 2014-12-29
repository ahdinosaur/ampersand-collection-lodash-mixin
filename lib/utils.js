var _ = require('lodash');

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
    if (_.isFunction(value)) {
        return value;
    } else if (_.isObject(value)) {
        return whereTest(value);
    } else if (_.isString(value)) {
        return pluckOne(value);
    } else {
        return value;
    }
}

module.exports = {
    pluckOne: pluckOne,
    whereTest: whereTest,
    propertyIterator: propertyIterator,
};
