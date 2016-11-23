var assert = require('assert');

describe('Symbols: ES6', () => {
    it('symbols are a new primitive type without a literal form', () => {
        let name = Symbol();
        let person = {};

        person[name] = 'Mateusz';

        assert.equal(person[name], 'Mateusz');
        assert.equal(typeof name, 'symbol');
    });

    it('symbols can have a description used for debugging purposes', () => {
        let name = Symbol('person name');
        let person = {};

        person[name] = 'Mateusz';

        assert.equal(person[name], 'Mateusz');
        assert.equal(name.toString(), 'Symbol(person name)'); // internal [[Description]] property
    });

    it('symbols can be used as computed properties', () => {
        let name = Symbol('person name');

        let person = {
            [name]: 'Mateusz'
        };

        assert.equal(person[name], 'Mateusz');
    });

    it('provides a global symbol registry for symbol sharing', () => {
        let name = Symbol.for('name'); // create a symbol
        let person = {};

        person[name] = 'Mateusz';

        assert.equal(person[name], 'Mateusz');

        let name2 = Symbol.for('name'); // reuse existing symbol
        assert.ok(name === name2);
    });

    it('global registry symbol keys can be retrieved', () => {
        let name = Symbol.for('com.kwasniew.name'); // symbol namespacing to avoid collision with other libs
        assert.equal(Symbol.keyFor(name), 'com.kwasniew.name');

        let s = Symbol('name');
        assert.equal(Symbol.keyFor(s), undefined);
    });

    it('symbols are inflexible when coerced', () => {
        let name = Symbol.for('name');
        assert.equal(String(name), 'Symbol(name)');

        assert.throws(() => {
            Number(name);
        }, /TypeError: Cannot convert a Symbol value to a number/);

        assert.throws(() => {
            name + '';
        }, /TypeError: Cannot convert a Symbol value to a string/);
    });

    it('symbols used as object keys are not enumerable in ES5 object methods', function () {
        let name = Symbol.for('name');
        let person = {
            [name]: 'Mateusz'
        };

        assert.equal(Object.keys(person).length, 0);
        assert.equal(Object.getOwnPropertyNames(person).length, 0);
        assert.deepEqual(Object.getOwnPropertySymbols(person), [name]);
    });

    it('allows to overwrite instanceof behavior', function () {
        assert.equal(Array[Symbol.hasInstance]([]), true); // same as [] instanceof Array

        function MyObject() {
        }

        Object.defineProperty(MyObject, Symbol.hasInstance, {
            value: () => false
        });
        let o = new MyObject();
        assert.equal(o instanceof MyObject, false);
    });

    it('allows to make any object concat spreadable', function () {
        let lastSteps = {
            0: 'green',
            1: 'refactor',
            length: 2,
            [Symbol.isConcatSpreadable]: true
        };

        let tdd = ['red'].concat(lastSteps);

        assert.deepEqual(tdd, ['red', 'green', 'refactor']);
    });

    it('allows to mimic regular expressions with custom objects', function () {
        let customRegExpLike = {
            [Symbol.replace]: function (value, replacement) {
                return 'hacked ' + replacement;
            },
            [Symbol.split]: function (value) {
                return value + ' refused to be split';
            }
        };

        let replace = 'original'.replace(customRegExpLike, 'replaced');
        assert.equal(replace, 'hacked replaced');

        let split = 'original'.split(customRegExpLike);
        assert.equal(split, 'original refused to be split');
    });

    /* eslint-disable indent */
    it('allows to overwrite default coercion behavior', function () {
        let o = {
            // hint is provided by the JS engine
            [Symbol.toPrimitive]: function (hint) {
                switch (hint) {
                    case 'string':
                        return 'string_hack';
                    case 'number':
                        return 100;
                    case 'default':
                        return 'default_hack';
                }
            }
        };

        assert.equal(o + '', 'default_hack');
        assert.equal(o / 10, 10);
        assert.equal(String(o), 'string_hack');
        assert.equal(Number(o), 100);
    });
    /* eslint-enable indent */

    it('allows to overwrite Object.toString', function () {
        function Person() {}
        Person.prototype[Symbol.toStringTag] = 'Person';

        let p = new Person();

        assert.equal(Object.prototype.toString.call(p), '[object Person]');
    });
});

