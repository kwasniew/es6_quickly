var assert = require('assert');

describe('Proxies: ES6', function () {
    it('allows to create simple proxies', function () {
        let target = {};

        let proxy = new Proxy(target, {}); // proxy forwards everything to target

        proxy.name = 'proxy';

        assert.equal(proxy.name, 'proxy');
        assert.equal(target.name, 'proxy');

        target.name = 'target';

        assert.equal(proxy.name, 'target');
        assert.equal(target.name, 'target');
    });

    it('set trap overrides writing to a property', function () {
        let target = {};

        let proxy = new Proxy(target, {
            // this is a trap
            set(target, key, value, proxy) {
                if (isNaN(value)) {
                    throw 'property must be a number';
                }

                return Reflect.set(target, key, value, proxy); // default implementation
            }
        });

        proxy.count = 1;
        assert.equal(proxy.count, 1);
        assert.equal(target.count, 1);

        assert.throws(() => {
            proxy.count = 'a';
        }, /property must be a number/);
    });

    it('get trap overrides reading a property value', function () {
        let proxy = new Proxy({}, {
            get(target, key, proxy) {
                if (!(key in proxy)) {
                    throw new TypeError('Property ' + key + ' does not exist');
                }

                return Reflect.get(target, key, proxy); // default implementation
            }
        });

        proxy.name = 'test';
        assert.equal(proxy.name, 'test');

        assert.throws(() => {
            proxy.nam; // intentional typo
        }, /Property nam does not exist/);
    });

    it('has trap overrides the in operator', function () {
        let target = {
            name: 'Mateusz',
            age: 32
        };

        let proxy = new Proxy(target, {
            has(target, key) {
                if (key === 'age') {
                    return false;
                } else {
                    return Reflect.has(target, key); // default implementation
                }
            }
        });

        assert.ok('name' in proxy);
        assert.ok('toString' in proxy);
        assert.ok(!('age' in proxy));
    });

    // alternative to throwing error in strict mode for nonconfigurable properties
    it('deleteProperty trap overrides the delete operator', function () {
        let target = {
            name: 'Mateusz',
            age: 32
        };

        let proxy = new Proxy(target, {
            deleteProperty(target, key) {
                if (key === 'name') {
                    return false;
                } else {
                    return Reflect.deleteProperty(target, key);
                }
            }
        });

        assert.equal(delete proxy.age, true);
        assert.equal(delete proxy.name, false);
        assert.equal('age' in proxy, false);
        assert.equal('name' in proxy, true);
    });

    /* eslint-disable no-unused-vars*/
    it('getPrototypeOf and setPrototypeOf traps override behavior of Object.getPrototypeOf() and Object.setPrototypeOf()', function () {
        let target = {};
        let proxy = new Proxy(target, {
            getPrototypeOf(target) {
                return null;
            },
            setPrototypeOf(target, proto) {
                return false;
            }
        });

        assert.ok(Object.getPrototypeOf(target) === Object.prototype);
        assert.ok(Object.getPrototypeOf(proxy) === null);

        assert.throws(() => {
            Object.setPrototypeOf(proxy, {});
        }, /TypeError: 'setPrototypeOf' on proxy: trap returned falsish/);
    });
    /* eslint-enable no-unused-vars*/

    it('defineProperty trap overrides behavior of Object.defineProperty()', function () {
        let proxy = new Proxy({}, {
            defineProperty(target, key, descriptor) {
                assert.equal(descriptor.ignored, undefined);

                if (typeof key === 'symbol') {
                    return false; // return true would silently fail, but we want to fail with Error
                }
                return Reflect.defineProperty(target, key, descriptor);
            }
        });

        Object.defineProperty(proxy, 'name', {
            value: 'proxy',
            ignored: 'abc'
        });

        assert.equal(proxy.name, 'proxy');

        assert.throws(() => {
            Object.defineProperty(proxy, Symbol('name'), {
                value: 'proxy'
            });
        }, /TypeError/);
    });

    it('ownKeys trap overrides behavior of Object.getOwnPropertyNames', function () {
        let proxy = new Proxy({}, {
            ownKeys(trapTarget) {
                return Reflect.ownKeys(trapTarget).filter(key => {
                    return typeof key !== 'string' || key[0] !== '_';
                });
            }
        });

        let s = Symbol('name');
        proxy.name = 'proxy';
        proxy._name = 'private';
        proxy[s] = 'symbol';

        let ownProperties = Object.getOwnPropertyNames(proxy);
        let ownSymbols = Object.getOwnPropertySymbols(proxy);
        let keys = Object.keys(proxy);

        assert.equal(ownProperties.length, 1);
        assert.equal(ownProperties[0], 'name');

        assert.equal(keys.length, 1);
        assert.equal(keys[0], 'name');

        assert.equal(ownSymbols.length, 1);
        assert.equal(ownSymbols[0], s);
    });

    it('apply and construct traps override function calling bahavior', function () {
        function sum(...values) {
            return values.reduce((acc, curr) => acc + curr, 0);
        }

        let proxy = new Proxy(sum, {
            apply: function (target, thisArg, argumentList) {
                argumentList.forEach((arg) => {
                    if (typeof arg !== 'number') {
                        throw new TypeError('All arguments must be numbers');
                    }
                });

                return Reflect.apply(target, thisArg, argumentList);
            },
            construct: function () {
                throw new TypeError('This function cannot be called with new');
            }
        });

        assert.equal(proxy(1, 2), 3);
        assert.throws(() => {
            proxy(1, '2');
        }, /TypeError: All arguments must be numbers/);
        assert.throws(() => {
            new proxy(1, 2);
        }, /TypeError: This function cannot be called with new/);
    });

    it('proxies can be revoked', function () {
        let target = {
            name: 'target'
        };

        let revokableProxy = Proxy.revocable(target, {});

        assert.equal(revokableProxy.proxy.name, 'target');

        revokableProxy.revoke();

        assert.throws(() => {
            revokableProxy.proxy.name;
        }, /TypeError: Cannot perform 'get' on a proxy that has been revoked/);
    });


});