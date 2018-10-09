import { Service } from '../../es6';
import { createCache } from '../../es6/serviceCache';

const apiURL = 'https://jsonplaceholder.typicode.com/todos';
const getTodo = (id: number) => fetch(`${apiURL}/${id}`).then(r => r.json()) as Promise<Todo>;

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Record<number, Todo>;
}
export class TodoService extends Service<TodoState> {
  static serviceName = 'TodoService';
  state = {
    todos: {}
  };

  todo = createCache<number, Todo>(
    /*read*/ id => this.state.todos[id],
    /*fetch*/ id => getTodo(id),
    /*store*/ (todo, id) => this.setState({ todos: { ...this.state.todos, [id]: todo } })
  );
}
