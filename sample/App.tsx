import * as React from 'react';
import { Router, Link } from '@reach/router';
import TodoList from './todos/TodoList';
import Todo from './todos/Todo';
import ServiceTester from './ServiceTester';
import './app.css';

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/tests">Tests</Link>
        </nav>
        <Router>
          <ServiceTester path="/tests" />
          <TodoList path="/" />
          <Todo path="/:id" />
        </Router>
      </React.Fragment>
    );
  }
}
