import { Service, createCache } from 'rc-service';
import { Normalized, normalizeCreate, denormalize, normalize, normalizeSet } from '../normalize';

const apiURL = 'https://jsonplaceholder.typicode.com/todos';
const getTodo = (id: number) => fetch(`${apiURL}/${id}`).then(r => r.json()) as Promise<Todo>;
const getTodoList = () => fetch(`${apiURL}`).then(r => r.json()) as Promise<Todo[]>;

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoState {
  // todos: Record<number, Todo>;
  todos: Normalized<number, Todo>;
}
export class TodoService extends Service<TodoState> {
  static serviceName = 'TodoService';
  state = {
    todos: normalizeCreate<number, Todo>()
  };

  todoList = createCache<null, Todo[]>(
    /*read */ () => denormalize(this.state.todos),
    /*fetch*/ getTodoList,
    /*store*/ todos => this.setState({ todos: normalize(todos) })
  );

  todo = createCache<number, Todo>(
    /*read */ id => this.state.todos.byId[id],
    /*fetch*/ getTodo,
    /*store*/ todo => this.setState({ todos: normalizeSet(this.state.todos, todo) }),
    /*opts */ { cacheFirst: true }
  );
}
