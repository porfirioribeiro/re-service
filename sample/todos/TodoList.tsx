import React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { useService } from 'rc-service';
import { TodoService } from './TodoService';

const TodoList: React.SFC<RouteComponentProps> = () => {
  const todoService = useService(TodoService);
  const todoList = todoService.todoList.read();
  return (
    <div>
      <button onClick={todoService.todoList.invalidate}>Invalidate</button>
      <ul>
        {todoList.map(todo => (
          <li key={todo.id}>
            <Link to={`${todo.id}`}>{todo.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
