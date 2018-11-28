import React,{useContext} from 'react';
import { RouteComponentProps } from '@reach/router';
import { useService } from 'rc-service/es6';
import { TodoService } from './TodoService';

const Todo: React.SFC<RouteComponentProps<{ id: number }>> = ({ id }) => {
  console.log('Todo before');
  const todo = useService(TodoService).todo.read(id!);
  console.log('Todo after');
  return (
    <div>
      <h2>Todo</h2>
      {todo.title}
    </div>
  );
};

export default Todo;
