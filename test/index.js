var _ = require('lodash');
var test = require('tape');
var AmpersandState = require('ampersand-state');
var AmpersandCollection = require('ampersand-collection');

var AmpersandLodashMixins = require('../');
var LodashMixinMethods = require('../lib/methods');

var Model = AmpersandState.extend({
    props: {
        id: 'number',
        foo: 'string',
        bar: 'string'
    }
});

var Collection = AmpersandCollection.extend(AmpersandLodashMixins, {
    model: Model
});

var collection;

test('extended collection contains all necessary methods', function (t) {
    _.each(LodashMixinMethods, function (method) {
        method = _.isArray(method) ? method[0] : method;
        t.ok(Collection.prototype[method], 'extended collection contains ' + method + ' method');
    });
    t.end();
});

test('`where` and `findWhere` methods should filter a collection based on a given attributes', function (t) {
    var collection = new Collection([
        { id: 1, foo: 'baz', bar: 'baz' },
        { id: 2, foo: 'baz', bar: 'baz' },
        { id: 3, foo: 'baz', bar: 'qux' },
        { id: 4, foo: 'qux', bar: 'qux' },
        { id: 5, foo: 'qux', bar: 'qux' },
        { id: 6, foo: 'qux', bar: 'baz' }
    ]);

    var whereSingleAttr = collection.where({
        foo: 'baz'
    });
    t.equal(whereSingleAttr.length, 3, 'find all matching models for a given attribute');

    var whereMultipleAttr = collection.where({
        foo: 'qux',
        bar: 'qux'
    });
    t.equal(whereMultipleAttr.length, 2, 'find all matching models for a given attributes');

    var findWhereSingleAttr = collection.findWhere({
        foo: 'baz'
    });
    t.ok(findWhereSingleAttr, 'return first matching model for a given attribute');
    t.equal(findWhereSingleAttr.get('id'), 1, 'verify that returned model is indeed first possible match');

    var findWhereMultipleAttr = collection.findWhere({
        foo: 'qux',
        bar: 'qux'
    });
    t.ok(findWhereMultipleAttr, 'return first matching model for a given attributes');
    t.equal(findWhereMultipleAttr.get('id'), 4, 'verify that returned model is indeed first possible match');

    t.end();
});

test('`pluck` method should get attribute value from each model', function (t) {
    var collection = new Collection([
        { id: 1, foo: 'baz', bar: 'qux' },
        { id: 2, foo: 'qux', bar: 'baz' }
    ]);

    var foo = collection.pluck('foo');
    t.deepEqual(foo, ['baz', 'qux']), 'verify that returned attribute values are correct';

    var bar = collection.pluck('bar');
    t.deepEqual(bar, ['qux', 'baz'], 'verify that returned attribute values are correct');

    t.end();
});
