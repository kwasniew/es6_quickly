var assert = require('assert');

// classes are just syntactic sugar on the top of behavior delegation of prototypes
describe('Classes: ES6', () => {
    it('introduces class declaration', function () {
        // it's not hoisted
        class Person {
            constructor(name) {
                this.name = name;
            }

            sayName() {
                return 'I am ' + this.name;
            }
        }

        let person = new Person('Mateusz');

        assert.equal(person.sayName(), 'I am Mateusz');
        assert.ok(person instanceof Person);
        assert.ok(person instanceof Object);
        assert.equal(typeof Person, 'function');
        assert.equal(typeof Person.prototype.sayName, 'function');
        assert.equal(Person.name, 'Person');
    });

    it('introduces class expressions', function () {
        let Person = class {
            constructor(name) {
                this.name = name;
            }

            sayName() {
                return 'I am ' + this.name;
            }
        };

        let person = new Person('Mateusz');

        assert.equal(person.sayName(), 'I am Mateusz');
        assert.equal(Person.name, 'Person');
    });

    it('introduces named class expressions', function () {
        let PersonAlias = class Person {
            constructor(name) {
                this.name = name;
            }

            sayName() {
                return 'I am ' + this.name;
            }
        };

        assert.equal(typeof Person, 'undefined');
        assert.equal(typeof PersonAlias, 'function');
    });

    it('classes are first class objects', function () {
        function createObject(classDefinition) {
            return new classDefinition();
        }

        let obj = createObject(class {
            sayHi() {
                return 'Hi';
            }
        });

        assert.equal(obj.sayHi(), 'Hi');
    });

    it('allows to create singletons with immediately invoked constructor', function () {
        let person = new class {
            constructor(name) {
                this.name = name;
            }

            sayName() {
                return 'I am ' + this.name;
            }
        }('Mateusz');

        assert.equal(person.sayName(), 'I am Mateusz');
    });

    it('classes can have accessor properties', function () {
        class Person {
            constructor(name) {
                this._name = name;
            }

            get name() {
                return this._name;
            }

            set name(value) {
                this._name = value;
            }
        }

        var descriptor = Object.getOwnPropertyDescriptor(Person.prototype, 'name');
        assert.ok('get' in descriptor);
        assert.ok('set' in descriptor);
        assert.equal(descriptor.enumerable, false);

        var p = new Person('Mateusz');
        assert.equal(p.name, 'Mateusz');
        p.name = 'Matt';
        assert.equal(p.name, 'Matt');
    });

    it('classes can have computed member names', function () {
        let methodName = 'sayName';

        class Person {
            constructor(name) {
                this.name = name;
            }

            [methodName]() {
                return this.name;
            }
        }

        let me = new Person('Mateusz');
        assert.equal(me.sayName(), 'Mateusz');
    });

    it('classes can have generator methods', function () {
        class Numbers {
            *generate() {
                yield 1;
                yield 2;
            }
        }

        let n = new Numbers();
        let iterator = n.generate();

        assert.equal(iterator.next().value, 1);
    });

    it('classes can have a default generator', function () {
        class Collection {
            constructor(items) {
                this.items = items;
            }

            *[Symbol.iterator]() {
                yield *this.items;
            }
        }

        let collection = new Collection([1, 2, 3]);
        let sum = 0;
        for (let i of collection) {
            sum += i;
        }
        assert.equal(sum, 6);
    });

    it('classes can have static members', function () {
        class Person {
            constructor(name) {
                this.name = name;
            }

            sayName() {
                return 'I am ' + this.name;
            }

            static create(name) {
                return new Person(name);
            }
        }

        let person = Person.create('Mateusz');

        assert.equal(person.sayName(), 'I am Mateusz');
    });

    it('classes can extend from other classes', function () {
        class Rectangle {
            constructor(width, length) {
                this.width = width;
                this.length = length;
            }

            getArea() {
                return this.width * this.length;
            }
        }

        class Square extends Rectangle {
            constructor(length) {
                super(length, length);
            }
        }

        let s = new Square(3);

        assert.equal(s.getArea(), 9);
        assert.ok(s instanceof Square);
        assert.ok(s instanceof Rectangle);
    });

    it('derived class methods can shadow base class methods', function () {
        class Base {
            callMe() {
                return 'base';
            }
        }
        class Derived extends Base {
            callMe() {
                return super.callMe() + ' derived';
            }
        }

        let d = new Derived();

        assert.equal(d.callMe(), 'base derived');
    });

    it('static members are inherited', function () {
        class Base {
            static callMe() {
                return 'base';
            }
        }
        class Derived extends Base {
        }

        assert.equal(Derived.callMe(), 'base');
    });

    it('classes can extends from expressions', function () {
        function Rectangle(width, length) {
            this.width = width;
            this.length = length;
        }

        Rectangle.prototype.getArea = function () {
            return this.width * this.length;
        };

        function getBase() {
            return Rectangle;
        }

        class Square extends getBase() {
            constructor(length) {
                super(length, length);
            }
        }

        let s = new Square(3);

        assert.equal(s.getArea(), 9);
        assert.ok(s instanceof Rectangle);
    });

    it('allows to extend from mixins', function () {
        let Serializable = {
            serialize() {
                return JSON.stringify(this);
            }
        };
        let Area = {
            getArea() {
                return this.width * this.length;
            }
        };

        function mixin(...mixins) {
            var base = function () {
            };
            Object.assign(base.prototype, ...mixins);
            return base;
        }

        class Square extends mixin(Area, Serializable) {
            constructor(length) {
                super();
                this.width = length;
                this.length = length;
            }
        }

        let s = new Square(3);

        assert.equal(s.getArea(), 9);
        assert.equal(s.serialize(), '{"width":3,"length":3}');
    });

    it('unlike ES5 allows to inherit from built-ins', function () {
        class MyArray extends Array {
        }

        let a = new MyArray();
        a[0] = 'test';
        assert.equal(a.length, 1);

        a.length = 0;
        assert.equal(a[0], undefined);
    });

    it('inheritance from built-ins preserves species', function () {
        class MyArray extends Array {
        }

        let a = new MyArray(1, 2, 3);
        let b = a.slice(1, 2);

        assert.ok(b instanceof MyArray); 
    });

    it('new.target can be used in constructors', function () {
        class MyClass {
            constructor() {
                assert.strictEqual(new .target, MyClass);
            }
        }

        new MyClass();
    });

    it('new.target is affected by the class', function () {
        class Base {
            constructor() {
                assert.strictEqual(new .target, Derived);
            }
        }
        class Derived extends Base {
        }

        new Derived();
    });

    it('new.target allows to simulate abstract classes', function () {
        class Shape {
            constructor() {
                if (new .target === Shape) {
                    throw new Error('this class cannot be instantiated directly');
                }
            }
        }

        class Rectangle extends Shape {
            constructor(length, width) {
                super();
                this.length = length;
                this.width = width;
            }
        }

        new Rectangle(1, 2); // no errors
        assert.throws(() => {
            new Shape();
        }, /this class cannot be instantiated directly/);
    });

    it('classes cannot be called without new', function () {
        class MyClass {}

        assert.throws(() => {
            MyClass();
        }, /Class constructor MyClass cannot be invoked without 'new'/);
    });
});