import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useService } from 'rc-service';
import { TodoService } from './TodoService';

const Todo: React.SFC<RouteComponentProps<{ id: number }>> = ({ id }) => {
  const todo = useService(TodoService).todo.read(id);
  return (
    <div>
      <h2>Todo</h2>
      {todo.value ? todo.value.title : 'Loading'}
    </div>
  );
};

export default Todo;
