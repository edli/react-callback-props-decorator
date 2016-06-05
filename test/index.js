import callback from '..';
import sinon from 'sinon';
import expect from 'expect';

describe('@callback', () => {
    it('should decorate a method', () => {
        class Foo {
            constructor() {
                this.props = {};
            }

            @callback
            handleSomething() {}
        }

        let foo = new Foo();
        let onSomethingSpy = sinon.spy();
        foo.props.onSomething = onSomethingSpy;
        let handleSomethingSpy = sinon.spy(foo, 'handleSomething');
        foo.handleSomething();

        expect(onSomethingSpy.calledAfter(handleSomethingSpy)).toBeTruthy();
    });

    it('should use specified callback name', () => {
        class Foo {
            constructor() {
                this.props = {};
            }

            @callback('mySpecialCallback')
            handleSomething() {}
        }

        let foo = new Foo();
        let mySpecialCallbackSpy = sinon.spy();
        foo.props.mySpecialCallback = mySpecialCallbackSpy;
        let handleSomethingSpy = sinon.spy(foo, 'handleSomething');

        foo.handleSomething();

        expect(mySpecialCallbackSpy.calledAfter(handleSomethingSpy)).toBeTruthy();
    });

    it('should use specified value converting function', () => {
        class Foo {
            constructor() {
                this.props = {};
            }

            @callback(args => { return { '0': args.bar } })
            handleSomething() {}
        }

        let foo = new Foo();
        let onSomethingSpy = sinon.spy();
        foo.props.onSomething = onSomethingSpy;
        foo.handleSomething({ bar: 'hi there' });
        expect(onSomethingSpy.getCall(0).args).toEqual(['hi there']);
    });

    it('should use specified value converting function and callback with custom name', () => {
        class Foo {
            constructor() {
                this.props = {};
            }

            @callback('myCoolCallback', args => { return { '0': args.bar } })
            handleSomething() {}
        }

        let foo = new Foo();
        let myCoolCallbackSpy = sinon.spy();
        foo.props.myCoolCallback = myCoolCallbackSpy;
        let handleSomethingSpy = sinon.spy(foo, 'handleSomething');
        foo.handleSomething({ bar: 'hi there'});

        expect(myCoolCallbackSpy.calledAfter(handleSomethingSpy)).toBeTruthy();
        expect(myCoolCallbackSpy.getCall(0).args).toEqual(['hi there']);
    });

});
