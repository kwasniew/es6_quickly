var assert = require('assert');

describe('Objects: ES6', () => {
    it('introduces property initializer shorthand', function () {
        function createBook(title, year) {
            return {title, year};
        }

        assert.deepEqual(createBook('Blink', 2010), {title: 'Blink', year: 2010});
    });

    it('introduces concise method syntax', function () {
        var person = {
            name: 'Matt',
            sayMyName() {
                return this.name;
            }
        };

        assert.equal(person.sayMyName(), 'Matt');
    });

    it('supports computed property names in object literals', function () {
        var suffix = ' name';
        var person = {
            ['first' + suffix]: 'Matt'
        };

        assert.equal(person['first name'], 'Matt');
    });

    it('Object.is() makes up for the === quirks', function () {
        assert.ok(!Object.is(5, '5')); // same as ===
        assert.ok(Object.is(NaN, NaN)); // fixes ===
        assert.ok(!Object.is(+0, -0)); // fixes ===
    });

    it('Object.assign() formalizes a common extension function', function () {
        var receiver = {};
        Object.assign(receiver, {name: 'Mateusz', age: 30}, {age: 32}); // last one wins

        assert.deepEqual(receiver, {name: 'Mateusz', age: 32});
    });

    it('Object.assign() copies accessor properties as simple properties', function () {
        var receiver = {};
        var supplier = {
            get name() {
                return 'Matt';
            }
        };

        Object.assign(receiver, supplier);
        var descriptor = Object.getOwnPropertyDescriptor(receiver, 'name');

        assert.equal(receiver.name, 'Matt');
        assert.equal(descriptor.value, 'Matt');
        assert.equal(descriptor.get, undefined);
    });

    it('duplicate object literal properties are allowed', function () {
        'use strict';

        /* eslint-disable no-dupe-keys */
        var person = {
            name: 'Kate',
            name: 'Mateusz' // not allowed in ES5 strict mode
        };
        /* eslint-enable no-dupe-keys */

        assert.equal(person.name, 'Mateusz'); // last one wins
    });

    it('formalizes own property enumeration order', function () {
        var o = {
            a: 1,
            0: 1,
            c: 1,
            2: 1,
            b: 1,
            1: 1
        };
        o.d = 1;

        // for-in order is not specified
        assert.equal(Object.getOwnPropertyNames(o).join(''), '012acbd'); // numeric keys ascending, otherwise declaration order
        assert.equal(Object.keys(o).join(''), '012acbd'); // numeric keys ascending, otherwise declaration order
    });

    it('allows to change prototype after object creation', function () {
        var jekyll = {
            saySomething() {
                return 'jekyll';
            }
        };
        var hyde = {
            saySomething() {
                return 'hyde';
            }
        };
        var me = Object.create(jekyll);
        Object.setPrototypeOf(me, hyde); // changes internal property [[Prototype]]

        assert.equal(me.saySomething(), 'hyde');
        assert.equal(Object.getPrototypeOf(me), hyde);
    });

    it('allows for easy super prototype references', function () {
        let jekyll = {
            saySomething() {
                return 'jekyll';
            }
        };

        let me = {
            saySomething() {
                // ES5: Object.getPrototypeOf(this).saySomething.call(this);
                return 'My name is ' + super.saySomething();
            }
        };

        Object.setPrototypeOf(me, jekyll);

        assert.equal(me.saySomething(), 'My name is jekyll');
    });
});