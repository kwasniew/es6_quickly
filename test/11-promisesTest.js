var assert = require('assert');

describe('Promises: ES6', function () {
    it('promises can be fulfilled', (done) => {
        let promise = Promise.resolve(1); // promise settled to fulfillment

        promise.then(function (contents) {
            assert.equal(contents, 1);
            done();
        });
    });

    it('promises can be rejected', (done) => {
        let promise = Promise.reject('error'); // promise settled to rejected state

        promise.then(null, function (error) {
            assert.equal(error, 'error');
            done();
        });
    });

    it('promises rejection can be handled with catch', (done) => {
        let promise = Promise.reject('error');

        promise.catch(function (error) {
            assert.equal(error, 'error');
            throw new Error('another error');
        }).catch(function (error) {
            assert.equal(error.message, 'another error');
            done();
        });
    });

    it('promise handlers can be added at any time', (done) => {
        let promise = Promise.resolve(1);

        promise.then(function (contents) {
            assert.equal(contents, 1);
            promise.then(function (contents) {
                assert.equal(contents, 1);
                done();
            });
        });
    });

    it('fulfilled promises can be created with a constructor function', (done) => {
        let promise = new Promise(function (resolve) {
            resolve('data');
        });

        promise.then(function (data) {
            assert.equal(data, 'data');
            done();
        });
    });

    it('rejected promises can be created with a constructor function', (done) => {
        let promise = new Promise(function (resolve, reject) {
            reject('error');
        });

        promise.catch(function (error) {
            assert.equal(error, 'error');
            done();
        });
    });

    it('promise constructor can be used to convert callback APIs', (done) => {
        let promise = new Promise(function (resolve) {
            // inside executor function
            setTimeout(function () {
                resolve('data');
            }, 0);
        });

        promise.then(function (data) {
            assert.equal(data, 'data');
            done();
        });
    });

    it('functions inside than are always called asynchronously', (done) => {
        var results = [];

        let promise = new Promise(function (resolve) {
            results.push('executor');
            return resolve();
        });

        promise.then(function () {
            results.push('then1');
        }).then(function () {
            results.push('then2');
            assert.deepEqual(results, ['executor', 'start', 'then1', 'then2']);
            done();
        });

        results.push('start');
    });

    it('allows for non promise thenables', (done) => {
        let thenable = {
            then: function (resolve, reject) {
                reject('error');
            }
        };

        var p1 = Promise.resolve(thenable);
        p1.then(function () {
            throw 'should not be here';
        }).catch(function (error) {
            assert.equal(error, 'error');
            done();
        });
    });

    it('executors with errors are rejected', (done) => {
        let promise = new Promise(function () {
            throw new Error('something bad happened'); // it behaves like reject(new Error(...))
        });

        promise.catch(function (error) {
            assert.equal(error.message, 'something bad happened');
            done();
        });
    });

    // this is node.js specific, not part of ES6
    //it('node.js provides unhandled rejection handler', (done) => {
    //    let p1;
    //
    //    process.on('unhandledRejection', function (reason, promise) {
    //        assert.equal(reason.message, 'something bad happened');
    //        assert.ok(promise === p1);
    //        done();
    //    });
    //
    //    p1 = Promise.reject(new Error('something bad happened'));
    //});

    it('promise can pass data down the chain', (done) => {
        Promise.resolve(1).then((data) => {
            assert.equal(data, 1);
            return data + 1;
        }).then((data) => {
            assert.equal(data, 2);
            done();
        });
    });

    it('promise catch can pass the data down the promise chain', (done) => {
        let p1 = Promise.reject(1);

        p1.catch((error) => {
            assert.equal(error, 1);
            return error + 1;
        }).then((data) => {
            assert.equal(data, 2);
            done();
        });
    });

    it('promises can be returned in promise chains', (done) => {
        let p1 = Promise.resolve(1);
        let p2 = Promise.resolve(2);
        let p3 = Promise.reject(3);

        p1.then(function () {
            return p2;
        }).then(function (data) {
            assert.equal(data, 2);
            return p3;
        }).catch(function (error) {
            assert.equal(error, 3);
            done();
        });
    });

    it('gives facility to wait for several promises to succeed', (done) => {
        let p1 = Promise.resolve(1);
        let p2 = Promise.resolve(2);
        let p3 = Promise.resolve(3);

        let p4 = Promise.all([p1, p2, p3]);

        p4.then(function(result) {
            assert.deepEqual(result, [1, 2, 3]);
            done();
        });
    });

    it('first rejected promise rejects Promise.all', (done) => {
        let p1 = Promise.resolve(1);
        let p2 = Promise.reject(2);
        let p3 = Promise.resolve(3);

        let p4 = Promise.all([p1, p2, p3]);

        p4.catch(function(error) {
            assert.equal(error, 2);
            done();
        });
    });

    it('provides race semantics for promises', (done) => {
        let p1 = new Promise(function(resolve) {
            setTimeout(function() {
                resolve(1);
            }, 0);
        });
        let p2 = Promise.resolve(2);
        let p3 = Promise.resolve(3);

        let p4 = Promise.race([p1, p2, p3]);

        p4.then(function(result) {
            assert.equal(result, 2);
            done();
        });
    });

    it('race promise is rejected if first promise is rejected', (done) => {
        let p1 = new Promise(function(resolve) {
            setTimeout(function() {
                resolve(1);
            }, 0);
        });
        let p2 = Promise.reject(2);
        let p3 = Promise.resolve(3);

        let p4 = Promise.race([p1, p2, p3]);

        p4.catch(function(error) {
            assert.equal(error, 2);
            done();
        });
    });

    it('race promise is fulfilled if first promise is fulfilled', (done) => {
        let p1 = new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(1);
            }, 0);
        });
        let p2 = Promise.resolve(2);
        let p3 = Promise.reject(3);

        let p4 = Promise.race([p1, p2, p3]);

        p4.then(function(result) {
            assert.equal(result, 2);
            done();
        });
    });

    it('promises can be inherited from', (done) => {
        class MyPromise extends Promise {
            success(resolve, reject) {
                return this.then(resolve, reject);
            }

            failure(reject) {
                return this.catch(reject);
            }
        }

        let promise = MyPromise.resolve(Promise.resolve(MyPromise.resolve(1)));

        promise.success(function(value) {
            assert.equal(value, 1);
            done();
        }).failure(function() {
            // never gets here
        });
    });
});