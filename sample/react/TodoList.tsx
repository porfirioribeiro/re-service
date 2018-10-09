import React from 'react';
import { Subscribe } from '../../es6';
import { TodoService } from './TodoService';

const TodoList: React.SFC<{}> = () => (
  <Subscribe
    to={[TodoService]}
    render={(todoService: TodoService) => {
      const todo = todoService.todo.read(1);
      return <div>{todo.value ? todo.value.title : 'Loading'}</div>;
    }}
  />
);

export default TodoList;
