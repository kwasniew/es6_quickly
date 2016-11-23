var assert = require('assert');

describe('Destructuring: ES6', () => {
    it('allows for object destructuring', () => {
        let person = {
            name: 'Mateusz',
            age: 32
        };

        let {name, age} = person;

        assert.equal(name, 'Mateusz');
        assert.equal(age, 32);
    });

    it('allows for destructuring assignment', () => {
        let person = {
            name: 'Mateusz',
            age: 32
        };
        let name = 'Kate';
        let age = 22;

        ({name, age} = person); // parenthesis = it's not a block statement

        assert.equal(name, 'Mateusz');
        assert.equal(age, 32);
    });

    it('allows for destructuring in function arguments', () => {
        let person = {
            name: 'Mateusz',
            age: 32
        };
        let name;
        let age;

        function process(value) {
            assert.strictEqual(value, person);
        }

        process({name, age} = person);

        assert.equal(name, 'Mateusz');
        assert.equal(age, 32);
    });

    it('destructuring has implicit default value for nonexistent values', () => {
        let person = {
            name: 'Mateusz'
        };

        let {name, age} = person;

        assert.equal(name, 'Mateusz');
        assert.equal(age, undefined);
    });

    it('destructuring can have explicit default value for nonexistent values', () => {
        let person = {
            name: 'Mateusz'
        };

        let {name, age = 10} = person;

        assert.equal(name, 'Mateusz');
        assert.equal(age, 10);
    });

    it('destructuring allows for different local variable names', () => {
        let person = {
            name: 'Mateusz',
            age: 32
        };

        let { name: localName, age: localAge, sex: localSex = 'male' } = person;

        assert.equal(localName, 'Mateusz');
        assert.equal(localAge, 32);
        assert.equal(localSex, 'male');
    });

    it('destructuring works with nested objects', () => {
        let person = {
            name: 'Mateusz',
            address: {
                city: 'Krakow'
            }
        };

        let { address: { city }} = person;

        assert.equal(city, 'Krakow');
        assert.equal(typeof address, 'undefined');
    });

    it('allows for array destructuring', () => {
        let tdd = ['red', 'green', 'refactor'];

        let [color1, color2] = tdd;
        let [,,step] = tdd;

        assert.equal(color1, 'red');
        assert.equal(color2, 'green');
        assert.equal(step, 'refactor');
    });

    it('allows for array destructuring assignment', () => {
        let tdd = ['red', 'green', 'refactor'];
        let color1, color2;

        [color1, color2] = tdd;

        assert.equal(color1, 'red');
        assert.equal(color2, 'green');
    });

    it('allows to swap variables with destructuring assignment', () => {
        let a = 1, b = 2;

        [a, b] = [b, a];

        assert.equal(a, 2);
        assert.equal(b, 1);
    });

    it('array destructuring assignment can have default values', () => {
        let t = ['red'];
        let color1, color2;
        [color1, color2 = 'green'] = t;

        assert.equal(color1, 'red');
        assert.equal(color2, 'green');
    });

    it('array destructuring supports nesting', () => {
        let tdd = ['red', ['green', 'ignore'], 'refactor'];

        let [color1, [color2]] = tdd;

        assert.equal(color1, 'red');
        assert.equal(color2, 'green');
    });

    it('array destructuring supports rest items', () => {
        let tdd = ['red', 'green', 'refactor'];

        let [color1, ...steps] = tdd;

        assert.equal(color1, 'red');
        assert.deepEqual(steps, ['green', 'refactor']);
    });

    it('rest items can be used for cloning arrays', () => {
        var tdd = ['red', 'green', 'refactor'];
        var cloned_es5 = tdd.concat(/* with nothing */);
        let [...cloned_es6] = tdd;

        assert.deepEqual(cloned_es5, tdd);
        assert.deepEqual(cloned_es6, tdd);
    });

    it('supports mixed destructuring', () => {
        let person = {
            address: {
                home: {
                    city: 'Krakow'
                }
            },
            luckyNumbers: [7, 10]
        };

        let { address: { home: {city}}, luckyNumbers: [first]} = person;

        assert.equal(city, 'Krakow');
        assert.equal(first, 7);
    });

    it('destructuring makes function signatures more explicit', () => {
        function register(name, {age, email, sex = 'M'} = {}) {
            assert.equal(age, 32);
            assert.equal(sex, 'M');
            assert.equal(email, undefined);
        }

        register('Mateusz', {age: 32});
    });

});