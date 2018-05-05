# rc-service

React Context Services

Create services and subscribe to them with the new React context API

No callback's needed

## Build

`$ yarn build`

## Run Sample

`$ yarn sample`

## How it works?

Define your services extending the Service class with the internal `state` and the methods that will change the state using `setState`.

_Tip: Use arrow functions if you want to pass your methods as callbacks to events_

The Provider renders a Context#Provider with the current map of services and the services that need to be updates.

The Subscribe renders a Context#Consumer that will specify the bitMask of the subscribed components

When you call setState to update state, the Context will verify the bitMask of the changed Service's and the bitMask of the connected Service's on Subscribe and update only the Subscribe components that are connected to that services

## Other state management libs
+ unstated: https://github.com/jamiebuilds/unstated

    The Api is inspired by unstated lib but they work different. Even tough unstated uses the new Context, it still uses a subscriber pattern and connects Subscribers directly to Containers (Service) while rc-service connects Services to Providers that will use Context bitMask diff to update Subscribers
+ redux: https://github.com/reactjs/redux

    Probably the most used state management of react, created by Dan Abramov (@gaearon), it follows a different approach in a more pure programming way.
    In redux all Connected components listens to changes on the store and all of them will update if any state change, it then uses mapStateToProps to know if it needs to update it's children's or not. 

### Services

```javascript
class MyService extends Service {
  // define name of the service, used for log's and key
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
          render={myService => <button onClick={myService.increment}>{'myService ' + myService.state.value}</button>}
        />
      </Provider>
    );
  }
}
```

## Todo

* [x] Unit tests
* [x] Inject Services
