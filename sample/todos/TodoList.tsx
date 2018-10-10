import React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { Subscribe } from '../../es6';
import { TodoService } from './TodoService';

const TodoList: React.SFC<RouteComponentProps> = () => (
  <Subscribe
    to={[TodoService]}
    render={(todoService: TodoService) => {
      const todoList = todoService.todoList.read();
      return (
        <div>
          <button onClick={todoService.todoList.invalidate}>Invalidate</button>
          <ul>
            {todoList.value
              ? todoList.value.map(todo => (
                  <li key={todo.id}>
                    <Link to={`${todo.id}`}>{todo.title}</Link>
                  </li>
                ))
              : 'Loading'}
          </ul>
        </div>
      );
    }}
  />
);

export default TodoList;
