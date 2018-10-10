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

### serviceCache

For make it easier to deal with fetch/store/read values, it was added a small helper.

It works by creating a cache object that can be read many times but it's only fetched once.

`createCache` accepts 3 functions (read, fetch, store)
* `read(id)` should return the cached value for the id
* `fetch(id)` should return Promise resolving the value of the id
* `store(data, id)` should store the resolved data into id

### Example Service for storing and fetch todo's 
`TodoService.ts`
```javascript
import { Service, createCache } from 'rc-service';

const apiURL = 'https://jsonplaceholder.typicode.com/todos';
/** fetch the todo from API */
const getTodo = (id: number) => fetch(`${apiURL}/${id}`).then(r => r.json()) as Promise<Todo>;

/** shape of the Todo object returned by the API*/
interface Todo {
  id: number;
  title: string;
}

export class TodoService extends Service<{todos: Record<number, Todo>}> {
  static serviceName = 'TodoService';
  state = {
    todos: {}
  };

  /**
   * Creates the cache using number as its key type and Todo as Value type 
   */
  todo = createCache<number, Todo>(
    /*read*/ id => this.state.todos[id],
    /*fetch*/ id => getTodo(id),
    /*store*/ (todo, id) => this.setState({ todos: { ...this.state.todos, [id]: todo } })
  );
}

```
`Todo.tsx`
```tsx
import React from 'react';
import { Subscribe } from 'rc-service';
import { TodoService } from './TodoService';

const Todo = () => (
  <Subscribe
    to={[TodoService]}
    render={(todoService: TodoService) => {
      // For this example it just reads a static todo id
      const todo = todoService.todo.read(1);
      return <div>{todo.value ? todo.value.title : 'Loading'}</div>;
    }}
  />
);

export default Todo;
```

When the Todo components render the first time it will try to read from todo
Has it was not loaded yet it will return a object with a empty value
and we can display a loading...
But it will trigger the fetch function and when it resolves it calls the store function
As store function is calling `setState` on the Service, it will make the Subscribe'd components
to update. So our Todo component will render again and now the read function knows we have the value,
it calls the `read` from the `createCache` that will return our value from Service state, 
so now the Todo will render the title of the fetched Todo.

If we had other components Subscribe'd to the `TodoService` and reading the same Todo, it will return from
the cache and not fetch again.