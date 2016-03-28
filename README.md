# React callback props decorator

A method decorator which wraps original handlers with similar-name callback invoke.
This is particularly useful for situations like React components, where
you often pass callbacks as props and you have to invoke them explicitly.
```
Before:
class Component extends React.Component {
    handleSomething(args) {
        // do some useful work
        if (this.props.onSomething) {
            this.props.onSomething(args);
        }
    }
}

After:
class Component extends React.Component {
    @callback
    handleSomething(args) { // camelCaseName
        // do some useful work
    }
}

```

Pay attention: for now decorators can be used with transpilers such as [Babel](http://babeljs.io);

**To Babel 6 users:**
For now decorators syntax is not final. So you may use [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy).

Installation:

    % npm install react-callback-props-decorator

Example:

    import callback from 'react-callback-props-decorator'

    class Component {
      render() {
        return <div onClick={ this.handleClick } />;
      }

      @callback
      handleClick() {
        // do useful work here
      }
    }
