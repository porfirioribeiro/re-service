# re-service
React Easy Services

Create services and subscribe to them with the new React context API

No callback's needed

## Build
`$ yarn build`

## Run Sample

`$ yarn sample`

## How it works?

### Services
```javascript
class MyService extends Service {
  // define name of the service for log, not required
  static serviceName = 'MyService';
  // define initial state
  state = {
    value: 10
  };
  //Use setState to update the Service state
  increment = () => this.setState({ value: this.state.value + 1 });
}
```
### Provider and Subscribe
Subscribe receives a `to` array with Service classes and uses a render prop with the value of the subscribed Services
```jsx
class App extends React.Component {
  render() {
    return (
      <Provider>
        <Subscribe
          to={[MyService]}
          render={myService => (
            <button onClick={myService.increment}>{'myService ' + myService.state.value}</button>
          )}
        />
      </Provider>
    );
  }
}
```

## Todo
- [ ] Unit tests
- [ ] Inject Services