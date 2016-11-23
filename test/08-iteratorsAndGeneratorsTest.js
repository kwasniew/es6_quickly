var assert = require('assert');

// yield - What value should I insert here?
describe('Generators and iterators: ES6', () => {
    it('iterators can be simulated with ES5', () => {
        var iterator = createIterator_es5([1, 2]);
        assert.deepEqual(iterator.next(), {done: false, value: 1});
        assert.deepEqual(iterator.next(), {done: false, value: 2});
        assert.deepEqual(iterator.next(), {done: true, value: undefined});
        assert.deepEqual(iterator.next(), {done: true, value: undefined});
    });

    it('generator is a function returning iterator', () => {
        var iterator = createIterator_es6();
        assert.deepEqual(iterator.next(), {done: false, value: 1});
        assert.deepEqual(iterator.next(), {done: false, value: 2});
        assert.deepEqual(iterator.next(), {done: true, value: undefined});
        assert.deepEqual(iterator.next(), {done: true, value: undefined});
    });

    it('generator can be a function expression, not only declaration', () => {
        let generator = function *(items) {
            for (let i = 0; i < items.length; i++) {
                yield items[i];
            }
        };

        let iterator = generator([1, 2]);
        assert.deepEqual(iterator.next(), {done: false, value: 1});
        assert.deepEqual(iterator.next(), {done: false, value: 2});
        assert.deepEqual(iterator.next(), {done: true, value: undefined});
        assert.deepEqual(iterator.next(), {done: true, value: undefined});
    });

    it('generators can be added to object like any other function', () => {
        var o = {
            generator1: function *() {
                yield 1;
            },
            *generator2 () {
                yield 1;
            }
        };
        let iterator1 = o.generator1();
        let iterator2 = o.generator2();

        assert.equal(iterator1.next().value, iterator2.next().value);
    });

    it('new for-of loop allows to iterate over iterables', () => {
        let iterable = [1, 2, 3];
        let sum = 0;

        for (let i of iterable) {
            sum += i;
        }

        assert.equal(sum, 6);
    });

    it('gives you access to array iterator', () => {
        let iterable = [1, 2, 3];
        let iterator = iterable[Symbol.iterator]();

        assert.deepEqual(iterator.next(), {done: false, value: 1});
    });

    it('allows to create custom iterable objects', () => {
        let customIterable = {
            items: [1, 2, 3],
            *[Symbol.iterator]() {
                for (let i of this.items) {
                    yield i;
                }
            }
        };

        var sum = 0;
        for (let i of customIterable) {
            sum += i;
        }
        assert.equal(sum, 6);
    });

    it('provides collection entries iterator', () => {
        let array = ['red', 'green', 'refactor'];
        let set = new Set(array);
        let map = new Map();
        map.set('test', 'driven');
        map.set('domain', 'driven');

        assert.deepEqual(array.entries().next(), {done: false, value: [0, 'red']});
        assert.deepEqual(set.entries().next(), {done: false, value: ['red', 'red']});
        assert.deepEqual(map.entries().next(), {done: false, value: ['test', 'driven']});
    });

    it('provides collection values iterator', () => {
        let array = ['red', 'green', 'refactor'];
        let set = new Set(array);
        let map = new Map();
        map.set('test', 'driven');
        map.set('domain', 'driven');

        assert.deepEqual(set.values().next(), {done: false, value: 'red'});
        assert.deepEqual(map.values().next(), {done: false, value: 'driven'});
    });

    it('provides collection keys iterator', () => {
        let array = ['red', 'green', 'refactor'];
        let set = new Set(array);
        let map = new Map();
        map.set('test', 'driven');
        map.set('domain', 'driven');

        assert.deepEqual(set.keys().next(), {done: false, value: 'red'});
        assert.deepEqual(map.keys().next(), {done: false, value: 'test'});
    });

    it('collections have default iterator', () => {
        let array = ['red', 'green', 'refactor'];
        let set = new Set(array);
        let map = new Map();
        map.set('test', 'driven');
        map.set('domain', 'driven');

        assert.deepEqual(array[Symbol.iterator]().next(), {done: false, value: 'red'}); // values iterator
        assert.deepEqual(set[Symbol.iterator]().next(), {done: false, value: 'red'}); // values iterator
        assert.deepEqual(map[Symbol.iterator]().next(), {done: false, value: ['test', 'driven']}); // entries iterator
    });

    it('spread operator is the easiest way to convert iterable into array', function () {
        let map = new Map([['test', 'driven'], ['domain', 'driven']]);
        let array = [...map];

        assert.deepEqual(array, [['test', 'driven'], ['domain', 'driven']]);
    });

    it('allows to pass arguments to iterators with next', () => {
        function *generator() {
            let first = yield 1; // return 1 and pause
            let second = yield first + 2;
            yield second + 3;
        }

        let iterator = generator();

        // first next is always argument less
        let result = iterator.next(); // play
        assert.deepEqual(result, {done: false, value: 1});
        result = iterator.next(4); // resume yield with 4
        assert.deepEqual(result, {done: false, value: 6});
        result = iterator.next(5);
        assert.deepEqual(result, {done: false, value: 8});
        result = iterator.next();
        assert.deepEqual(result, {done: true, value: undefined});
    });

    it('allows to pass error to iterators with throw', (done) => {
        function *generator() {
            let first = yield 1; // return 1 and pause
            let second = yield first + 2;
            yield second + 3;
        }

        let iterator = generator();

        iterator.next();
        try {
            iterator.throw(new Error('something bad happened'));
        } catch (e) {
            assert.equal(e.message, 'something bad happened');
            done();
        }
    });

    it('allows to catch error inside generators', () => {
        function *generator() {
            let first = yield 1;
            let second;

            try {
                second = yield first + 2;
            } catch (e) {
                second = 6;
            }
            yield second + 3;
        }

        let iterator = generator();

        iterator.next();
        iterator.next(4); // continue normally
        var result = iterator.throw(new Error('something bad happened')); // continue with error
        assert.equal(result.value, 9);
    });

    it('allows for early exit from generator', () => {
        function *generator() {
            yield 1;
            return;
            /* eslint-disable no-unreachable */
            yield 2; // never happens
            /* eslint-enable no-unreachable */
        }

        let iterator = generator();

        iterator.next();
        let result = iterator.next();

        assert.deepEqual(result, {done: true, value: undefined});
    });

    it('generator can return value when iteration is over', () => {
        function *generator() {
            yield 1;
            return 2;
        }

        let iterator = generator();

        iterator.next();
        let result = iterator.next();
        assert.deepEqual(result, {done: true, value: 2});
        result = iterator.next();
        assert.deepEqual(result, {done: true, value: undefined});
    });

    it('generators can delegate to other generators', () => {
        function *numberGenerator() {
            yield 1;
            yield 2;
        }

        function *stringGenerator() {
            yield 'a';
            yield 'b';
        }

        function *delegatingGenerator() {
            yield *numberGenerator();
            yield *stringGenerator();
            yield true;
        }

        assert.deepEqual(collectValuesFrom(delegatingGenerator()), [1, 2, 'a', 'b', true]);
    });

    it('generator delegation supports return statements', () => {
        function *numberGenerator() {
            yield 1;
            return 2;
        }

        function *stringGenerator(count) {
            for (let i = 0; i < count; i++) {
                yield 'a';
            }
        }

        function *delegatingGenerator() {
            let result = yield *numberGenerator();
            yield result;
            yield *stringGenerator(result);
        }

        assert.deepEqual(collectValuesFrom(delegatingGenerator()), [1, 2, 'a', 'a']);
    });

    it('generator delegation works with strings', () => {
        function *delegatingGenerator() {
            yield *'abc';
        }

        assert.deepEqual(collectValuesFrom(delegatingGenerator()), ['a', 'b', 'c']);
    });

    it('generators can be used as task runners', (done) => {
        run(function*() {
            let value = yield 1;
            assert.equal(value, 1);
            value = yield value + 3;
            assert.equal(value, 4);
            done();
        });
    });

    it('generators can be used as async callback task runners', (done) => {
        function fetchData(url) {
            return function(callback) {
                setTimeout(function() {
                    callback(null, 'data from ' + url);
                }, 0);
            };
        }


        runAsyncCallbacks(function*() {
            let data = yield fetchData('localhost:3000');
            assert.equal(data, 'data from localhost:3000');
            done();
        });
    });

    it('generators can be used as async promise task runners', (done) => {
        function fetchData(url) {
            return Promise.resolve('data from ' + url);
        }

        function readFile(name) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    reject('cannot read from ' + name);
                }, 0);
            });
        }


        runAsyncPromises(function*() {
            let data = yield fetchData('localhost:3000');
            assert.equal(data, 'data from localhost:3000');
            let syncData = yield 1;
            assert.equal(syncData, 1);

            try {
                yield readFile('test.txt');
                throw 'should not enter this path';
            } catch(e) {
                assert.equal(e, 'cannot read from test.txt');
            }

            done();
        });
    });
});

function run(taskDefinition) {
    let task = taskDefinition();

    let result = task.next();

    function step() {
        if(!result.done) {
            result = task.next(result.value);
            step();
        }
    }

    step();
}

function runAsyncCallbacks(taskDefinition) {
    let task = taskDefinition();

    let result = task.next();

    function step() {
        if(!result.done) {
            if(typeof result.value === 'function') {
                result.value(function(err, data) {
                    if(err) {
                        result = task.throw(err);
                        return;
                    }
                    result = task.next(data);
                    step();
                });
            } else {
                result = task.next(result.value);
                step();
            }
        }
    }

    step();
}

function runAsyncPromises(taskDefinition) {
    let task = taskDefinition();

    let result = task.next();

    function step() {
        if(!result.done) {
            // wrap everything in a promise
            let promise = Promise.resolve(result.value);
            promise.then(function(value) {
                result = task.next(value);
                step();
            }).catch(function(error) {
                result = task.throw(error);
                step();
            });
        }
    }

    step();
}



function collectValuesFrom(iterator) {
    let results = [];
    let current = iterator.next();
    while (!current.done) {
        results.push(current.value);
        current = iterator.next();
    }
    return results;
}

function createIterator_es5(items) {
    var i = 0;

    return {
        next: function () {
            var done = (i >= items.length);
            var value = !done ? items[i++] : undefined;

            return {
                done: done,
                value: value
            };
        }
    };
}

// * makes function a generator
function *createIterator_es6() {
    // new ES6 keyword - what to return on next()
    // yield is like a pause button and next() is resume
    // yield can be only used directly in generators
    yield 1;
    yield 2;
}