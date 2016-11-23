var assert = require('assert');

describe('Function: ES6', function () {
    it('allows for functions with default values', function () {
        function callMe(required, optional = 'default') {
            return required + ' ' + optional;
        }

        assert.equal(callMe('required'), 'required default');
        assert.equal(callMe('required', undefined), 'required default');
        assert.equal(callMe('required', null), 'required null');
    });

    it('default parameters influence arguments object', function () {
        /* eslint-disable no-unused-vars */
        function callMe(required, optional = 'default') {
            assert.equal(arguments.length, 1);
            required = 'new value';
            assert.equal(arguments[0], 'required'); // detached
        }

        /* eslint-enable no-unused-vars */

        callMe('required');
    });

    it('allows for default parameter expressions', function () {
        function getValue(x) {
            return x + 1;
        }

        function add(first, second = getValue(first)) {
            return first + second;
        }

        assert.equal(add(2), 5);
    });

    it('allows to reference only previous parameters', function () {
        function add(first = second, second) {
            return first + second;
        }

        assert.throws(() => {
            add(undefined, 1);
        }, /ReferenceError: second is not defined/);
    });

    it('allows to use rest params', function () {
        // rest params should be listed last
        function sum(first, ...others) {
            let result = first;

            for (let i = 0; i < others.length; i++) {
                result += others[i];
            }

            return result;
        }

        assert.equal(sum.length, 1);
        assert.equal(sum(1, 2, 3), 6);
    });

    it('allows to use spread operator', function () {
        // more readable than apply
        assert.equal(Math.max(...[1, 2, 3, 4]), 4);
        assert.equal(Math.max(...[1, 2, 3, 4], 20), 20);
    });

    it('all functions have name property', function () {
        function a() {}
        var b = function() {};

        assert.equal(a.name, 'a');
        assert.equal(b.name, 'b'); // node should support it soon
    });

    it('allows to verify new target', function () {
        let target;
        function Person() {
            target = new.target;
        }

        var p = new Person();
        assert.equal(target, Person);
        Person.call(p);
        assert.equal(target, undefined);
    });

    it('introduces arrow function syntax', function () {
        var i = value => value;

        assert.equal(i(10), 10);
    });

    it('arrow functions should put multiple parameters in parentheses', function () {
        var sum = (x, y) => x + y;

        assert.equal(sum(1, 2), 3);
    });

    it('arrow functions with no parameters are allowed', function () {
        var getName = () => 'Mateusz';

        assert.equal(getName(), 'Mateusz');
    });

    it('arrow function body can be wrapped with braces', function () {
        var sum = (x, y) => {
            return x + y;
        };

        assert.equal(sum(1, 2), 3);
    });

    it('arrow function can be used to create do nothing function', function () {
        var doNothing = () => {};

        assert.equal(doNothing(), undefined);
    });

    it('arrow functions can return object literal', function () {
        var returnObj = id => ({id: id}); // wrap literal in parentheses so that it's not interpreted as body

        assert.deepEqual(returnObj(2), {id: 2});
    });

    it('arrow functions can be used as IIFE', function () {
        let person = ((name) => {
            return {
                getName: function() {
                    return name;
                }
            };
        })('Mateusz');

        assert.equal(person.getName(), 'Mateusz');
    });

    it('arrow functions remove noise in array processing', function () {
        let sorted = [1,3,2].sort((a, b) => a - b);

        assert.deepEqual(sorted, [1, 2, 3]);
    });

    it('arrow functions use this from parent function', function () {
        function callMe() {
            let x = () => {
                return this;
            };
            return x();
        }

        assert.deepEqual(callMe.call({}), {});
    });

    it('arrow functions use arguments from parent function', function () {
        function callMe() {
            let x = () => {
                return arguments[0];
            };
            return x();
        }

        assert.deepEqual(callMe(1), 1);
    });

    it('arrow functions are functions', function () {
        var sum = (x, y) => x + y;

        assert.equal(typeof sum, 'function');
        assert.equal(sum.call(null, 1, 2), 3); // this binding is ignored
        assert.equal(sum.apply(null, [1, 2]), 3);
    });

    // https://twitter.com/CaranElmoth/status/738734530148880384
    it('objects are passed by reference, primitives are passed by value', function () {
        var o = {
            volume: 10
        };
        var volume = 10;

        function fillCap1(o) {
            o.volume = 0;
            return o;
        }

        function fillCap2(v) {
            v = 0;
            return v;
        }

        fillCap1(o);
        fillCap2(volume);

        assert.equal(o.volume, 0);
        assert.equal(volume, 10);
    });

});