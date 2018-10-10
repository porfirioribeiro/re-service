import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Subscribe } from '../../es6';
import { TodoService } from './TodoService';

const Todo: React.SFC<RouteComponentProps> = ({ id }: { id: number }) => (
  <Subscribe
    to={[TodoService]}
    render={(todoService: TodoService) => {
      const todo = todoService.todo.read(id);
      return (
        <div>
          <h2>Todo</h2>
          {todo.value ? todo.value.title : 'Loading'}
        </div>
      );
    }}
  />
);

export default Todo;
