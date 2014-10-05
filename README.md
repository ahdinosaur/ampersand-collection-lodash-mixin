# ampersand-collection-lodash-mixin

A mixin for extending ampersand-collection with lodash methods. 
This is a fork of [ampersand-collection-underscore-mixin](https://github.com/AmpersandJS/ampersand-collection-underscore-mixin).

Out of the box, ampersand-collections proxy the [ES5 iteration methods already](http://ampersandjs.com/docs/#ampersand-collection-proxied-es5-array-methods-9) so you don't _have_ to use this mixin, but if you want all the lodash methods, or better browser support, you can use this.

## install

```
npm install ampersand-collection-lodash-mixin
```

## example

```javascript
var Collection = require('ampersand-collection');
var lodashMixin = require('ampersand-collection-lodash-mixin');


module.exports = Collection.extend(lodashMixin, {
    sampleMethod: function () {
        // now we've got lodash methods 
        // we can call that are applied to models
        // in the collection.
        this.filter( ... );
        this.some( ... );
        this.each( ... )
    }
});
```

## credits

All credit for this approach in backbone goes to Jeremy Ashkenas and the rest of the Backbone authors.

Lodash is written by John-David Dalton.

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.

## license

MIT

