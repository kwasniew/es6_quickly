var assert = require('assert');

describe('Sets and Maps: ES6', function () {
    it('introduces sets', function () {
        let set = new Set();
        set.add(5); //added
        set.add(5); // duplicate
        set.add('5'); // added - sets don't coerce values so string and number are different
        set.add({}); // added
        set.add({}); // added - Object.is() used to compare

        assert.equal(set.size, 4);
    });

    it('sets remove array duplicates', function () {
        let set = new Set([1, 2, 2, 3, 3]);

        assert.deepEqual(Array.from(set), [1, 2, 3]);
    });

    it('sets allow to check for element existence', function () {
        let set = new Set([1, 2]);

        assert.ok(set.has(2));
        assert.equal(set.has(3), false);
    });

    it('sets allow to remove values', function () {
        let set = new Set([1, 2, 3]);
        set.delete(2);

        assert.equal(set.size, 2);

        set.clear();

        assert.equal(set.size, 0);
    });

    it('sets can be iterated over', function () {
        let set = new Set([2]);

        // consistent with array and map iteration callbacks
        set.forEach(function (value, key, ownerSet) {
            assert.equal(key, 2);
            assert.equal(value, 2);
            assert.ok(set === ownerSet);
        });
    });

    it('sets can be converted to arrays', function () {
        let set = new Set([1, 2, 3]);
        let array1 = [...set];
        let array2 = Array.from(set);

        assert.deepEqual(array1, [1, 2, 3]);
        assert.deepEqual(array2, [1, 2, 3]);
    });

    it('introduces weak sets', function () {
        let set = new WeakSet();
        let key = {}; // only objects can be use as keys

        set.add(key);

        key = null;
        // at this point weak set removes reference to object, but there's not way to verify it in client code
    });

    it('weak sets have some gotchas', function () {
        let set = new WeakSet();

        assert.equal(set.size, undefined);

        assert.equal(set.keys, undefined);
        assert.equal(set.values, undefined);
        assert.equal(set.forEach, undefined);
        assert.equal(set[Symbol.iterator], undefined); // not iterable

        assert.throws(() => {
            set.add(2);
        }, /TypeError: Invalid value used in weak set/);
    });

    it('introduces maps', function () {
        let map = new Map();
        map.set('name', 'Mateusz');

        assert.equal(map.get('name'), 'Mateusz');
        assert.equal(map.get('age'), undefined);
    });

    it('maps can use objects as keys', function () {
        let map = new Map();
        let key1 = {};
        let key2 = {};

        // in object literals those keys would be coerced to strings
        map.set(key1, 'val1');
        map.set(key2, 'val2');

        assert.equal(map.get(key1), 'val1');
        assert.equal(map.get(key2), 'val2');
    });

    it('maps have similar methods to sets', function () {
        let map = new Map();
        map.set('name', 'Mateusz');
        map.set('age', 32);

        assert.ok(map.has('name'));
        assert.equal(map.get('name'), 'Mateusz');
        assert.equal(map.get('job'), undefined);
        assert.equal(map.size, 2);
        map.delete('name');
        assert.equal(map.size, 1);
        map.clear();
        assert.equal(map.size, 0);
    });

    it('maps can be initialized with nested arrays', function () {
        let map = new Map([['name', 'Mateusz'], ['age', 32]]);

        assert.equal(map.get('name'), 'Mateusz');
        assert.equal(map.size, 2);
    });

    it('maps can be iterated over', function () {
        let map = new Map([['name', 'Mateusz']]);

        map.forEach(function(value, key, ownerMap) {
            assert.equal(value, 'Mateusz');
            assert.equal(key, 'name');
            assert.ok(map === ownerMap);
        });
    });

    it('introduces weak maps', function () {
        let map = new WeakMap();
        let key = {};

        map.set(key, 'value');

        key = null;
        // at this point weak map removes reference to value, but there's not way to verify it in client code
    });

    // When deciding whether to use a weak map or a regular map, the primary decision to consider is whether you want to use only object keys.
    // Anytime you're going to use only object keys, then the best choice is a weak map.
    // That will allow you to optimize memory usage and avoid memory leaks by ensuring that extra data isn't kept around after it's no longer accessible.
    // Keep in mind that weak maps give you very little visibility into their contents, so you can't use the forEach() method,
    // the size property, or the clear() method to manage the items.
    // If you need some inspection capabilities, then regular maps are a better choice. Just be sure to keep an eye on memory usage.
    // Of course, if you only want to use non-object keys, then regular maps are your only choice.
});