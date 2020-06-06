import { Service } from '../src';

export class MyService extends Service<{ value: number }> {
  static serviceName = 'MyService';
  state = {
    value: 10,
  };
  increment = () => this.setState({ value: this.state.value + 1 });
}

export class OtherService extends Service<{ other: number }> {
  static serviceName = 'OtherService';
  state = {
    other: 10,
  };
  increment = () => this.setState({ other: this.state.other + 1 });
}

interface ReducerState {
  name: string;
  age: number;
}

type Actions = any;

function reducer(state: ReducerState, action: Actions): ReducerState {
  switch (action.type) {
    case 'OLD':
      return { ...state, age: state.age++ };
    default:
      return state;
  }
}

export class ReducerService extends Service<ReducerState> {
  state = {
    name: '',
    age: 0,
  };

  dispatch(action: Actions) {
    this.setState(reducer(this.state, action), true);
  }

  older() {
    this.dispatch({ type: 'OLD' });
  }
}
