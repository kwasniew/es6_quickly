var assert = require('assert');

describe('Strings and Regular Expressions: ES6', function () {
    it('exposes code points', function() {
        // code point = 1 (BPM plane) or 2 (supplementary planes) code units (16-bits)
        var text = '𠮷a';

        assert.equal(text.charCodeAt(0), 55362);
        assert.equal(text.charCodeAt(1), 57271);
        assert.equal(text.charCodeAt(2), 97);

        assert.equal(text.codePointAt(0), 134071);
        assert.equal(text.codePointAt(1), 57271);
        assert.equal(text.codePointAt(2), 97);

        assert.equal(text.length, 3); // 3 code units, 2 code points
    });

    it('allows to create strings from code points', function () {
        assert.equal(String.fromCodePoint(134071), '𠮷');
    });

    it('regular expressions can work with characters with 2 code units', function () {
        var text = '𠮷';

        assert.ok(!/^.$/.test(text));
        assert.ok(/^.$/u.test(text));
    });

    it('regular expressions can be use to count code points', function () {
        // warning: slow
        function codePointLength(text) {
            var result = text.match(/[\s\S]/gu); // whitespace and non-whitespace applied globally with Unicode enabled
            return result ? result.length : 0;
        }

        assert.equal(codePointLength('abc'), 3);
        assert.equal(codePointLength('𠮷bc'), 3);
    });

    it('provides useful substring methods', function () {
        var message = 'This is awesome';

        assert.ok(message.startsWith('This'));
        assert.ok(message.startsWith('awe', 8));
        assert.ok(message.endsWith('some'));
        assert.ok(message.endsWith('T', 1));
        assert.ok(message.includes('is'));
    });

    it('allows to repeat string', function () {
        assert.equal('ab'.repeat(3), 'ababab');
    });

    /* eslint-disable quotes */
    it('introduces template strings syntax', function () {
        let message = `Hello world`;

        assert.equal(typeof message, 'string'); // it's just a string
    });

    it('template strings can use quotes', function () {
        let message = `This 'is' "a" m\`essage`;

        assert.equal(typeof message, 'string');
    });
    /* eslint-enable quotes */

    it('template strings make multiline strings easy', function () {
        let message = `Hello
                       World`;

        assert.equal(message.length, 34);
    });

    it('template strings allow for substitutions', function () {
        let name = 'Mateusz';
        let message = `Hello ${name}`;

        assert.equal(message, 'Hello Mateusz');
    });

    /* eslint-disable no-unused-vars */
    it('template strings substitution throws error on missing reference', function () {
        assert.throws(() => {
            let message = `Hello ${name}`;
        }, /ReferenceError: name is not defined/);
    });
    /* eslint-enable no-unused-vars */

    it('template strings substitution supports complex expressions', function () {
        let count = 10;
        let message = `${count} * ${count} = ${(count * count).toFixed(2)}`;

        assert.equal(message, '10 * 10 = 100.00');
    });

    it('allows to create template tags', function () {
        function passthru(literals, ...substitutions) {
            let result = '';

            for(let i = 0; i < substitutions.length; i++) {
                result += literals[i];
                result += substitutions[i];
            }

            result += literals[literals.length - 1];

            return result;
        }

        let count = 10;
        let message = passthru`${count} * ${count} = ${(count * count).toFixed(2)}`;

        assert.equal(message, '10 * 10 = 100.00');
    });

    it('template tags get all literals and substitutions', function () {
        function passthru(literals, ...substitutions) {
            assert.equal(literals[0], '');
            assert.equal(literals.raw[0], ''); // no escapes in raw
            assert.equal(literals[1], ' * ');
            assert.equal(literals.raw[1], ' * ');
            assert.equal(literals[2], ' = ');
            assert.equal(literals.raw[2], ' = ');
            assert.equal(literals[3], '');
            assert.equal(literals.raw[3], '');
            // there's always one more literal than substitution

            assert.equal(substitutions[0], 10);
            assert.equal(substitutions[1], 10);
            assert.equal(substitutions[2], 100.00);
        }

        let count = 10;
        passthru`${count} * ${count} = ${(count * count).toFixed(2)}`;
    });
});