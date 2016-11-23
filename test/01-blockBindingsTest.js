var assert = require('assert');

describe('Let, const: ES6', function () {
    /* eslint-disable no-constant-condition, no-unused-vars, no-undef */
    it('block bindings/variables can be declared with a let keyword', function () {
        assert.equal(functionVar, undefined); // functionVar is hoisted

        if (true) {
            // attach let vars to the block as opposed to the function
            let blockVar = 'block var';
            var functionVar = 'function var';
        }

        assert.deepEqual(functionVar, 'function var');
        assert.throws(() => {
            blockVar;
        }, /ReferenceError: blockVar is not defined/);
    });
    /* eslint-enable no-constant-condition, no-unused-vars, no-undef */

    /* eslint-disable no-constant-condition */
    it('let declaration can redeclare var in the same scope', function () {
        // var x = 10;
        // let x = 20; // this is SyntaxError

        var x = 10;
        if (true) {
            let x = 20; // block scope x shadowing function scope x

            assert.equal(x, 20);
        }
        assert.equal(x, 10);
    });
    /* eslint-enable no-constant-condition */

    /* eslint-disable no-const-assign */
    it('has const declarations', function () {
        const x = 10;

        assert.equal(x, 10);

        assert.throws(() => {
            x = 20;
        }, /TypeError: Assignment to constant variable/);
    });
    /* eslint-enable no-const-assign */

    /* eslint-disable no-constant-condition, no-unused-vars, no-undef */
    it('block bindings/variables can be declared with a const keyword', function () {
        if (true) {
            const blockVar = 'block var';
        }

        assert.throws(() => {
            blockVar;
        }, /ReferenceError: blockVar is not defined/);
    });
    /* eslint-enable no-constant-condition, no-unused-vars, no-undef */

    it('const declaration prevents binding modification but not value modification', function () {
        const car = {
            model: 'Mazda'
        };
        car.model = 'Porsche';

        assert.equal(car.model, 'Porsche');
    });

    it('let and const are not accessible before their declaration', function () {
        assert.equal(typeof blockVar, 'undefined');

        assert.throws(() => {
            // Temporal Dead Zone
            if(blockVar === 'block var') { throw 'should not go here'; }
            let blockVar = 'block var';
        }, /ReferenceError: blockVar is not defined/);
    });

    /* eslint-disable no-empty */
    it('block binding can be used in for loops', function () {
        for(var i = 0; i < 3; i++) {}
        for(let j = 0; j < 3; j++) {}

        assert.equal(i, 3);
        assert.equal(typeof j, 'undefined');
    });
    /* eslint-enable no-empty */

    it('block binding helps avoid confusion with function declarations in loops', function () {
        var varResults = [];
        for(var i = 0; i < 3; i ++) {
            varResults.push({fn: function() {
                return i;
            }});
        }
        // add IIFE example here

        assert.equal(varResults[0].fn(), 3);

        var letResults = [];
        for(let j = 0; j < 3; j ++) {
            letResults.push({fn: function() {
                return j;
            }});
        }

        assert.equal(letResults[0].fn(), 0);
    });

});