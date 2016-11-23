let assert = require('assert');

describe('Arrays: ES6', function () {
    it('Array.of fixes Array constructor quirks', function () {
        let items = new Array(2);
        assert.equal(items.length, 2);
        assert.deepEqual(items[1], undefined);

        items = Array.of(2);
        assert.equal(items.length, 1);

        items = Array.of(1, 2);
        assert.equal(items.length, 2);
    });

    it('Array.from converts array like objects to arrays', function () {
        function callMe() {
            assert.ok(!(arguments instanceof Array));
            assert.ok(Array.from(arguments) instanceof Array);
        }

        callMe(1, 2);
    });

    it('Array.from provides conversion capability', function () {
        function callMe() {
            assert.deepEqual(Array.from(arguments, (value) => value + 1), [2, 3, 4]);
        }

        callMe(1, 2, 3);
    });

    it('Array.from can be used with iterables', function () {
        let numbers = {
            *[Symbol.iterator]() {
                yield 1;
                yield 2;
                yield 3;
            }
        };

        let converted = Array.from(numbers, (value) => value + 1);

        assert.deepEqual(converted, [2, 3, 4]);
    });

    it('arrays can use find and findIndex', function () {
        let numbers = [10, 20, 30, 40];

        assert.equal(numbers.find(n => n > 25), 30);
        assert.equal(numbers.findIndex(n => n > 25), 2);
    });

    it('arrays can be filled', function () {
        let numbers = [1, 2, 3, 4];

        numbers.fill(5);

        assert.deepEqual(numbers, [5, 5, 5, 5]);

        numbers.fill(6, 1, 3);

        assert.deepEqual(numbers, [5, 6, 6, 5]);
    });

    it('arrays can be copied within', function () {
        let numbers = [1, 2, 3, 4];

        numbers.copyWithin(2, 0);

        assert.deepEqual(numbers, [1, 2, 1, 2]);
    });

    // An array buffer always represents the exact number of bytes specified when it was created
    it('introduces array buffers', function () {
        let buffer = new ArrayBuffer(10); // allocate 10 bytes

        assert.equal(buffer.byteLength, 10);

        let buffer2 = buffer.slice(1, 3);

        assert.equal(buffer2.byteLength, 2);
    });

    it('array buffers can be manipulated with views', function () {
        let buffer = new ArrayBuffer(10);
        let fullView = new DataView(buffer);
        let partialView = new DataView(buffer, 5, 2);

        assert.ok(fullView.buffer = buffer);
        assert.equal(fullView.byteOffset, 0);
        assert.equal(fullView.byteLength, 10);

        assert.ok(partialView.buffer = buffer);
        assert.equal(partialView.byteOffset, 5);
        assert.equal(partialView.byteLength, 2);
    });

});