import { Service } from '../src';

export class MyService extends Service<{ value: number }> {
  static serviceName = 'MyService';
  state = {
    value: 10
  };
  increment = () => this.setState({ value: this.state.value + 1 });
}

export class OtherService extends Service<{ other: number }> {
  static serviceName = 'OtherService';
  state = {
    other: 10
  };
  increment = () => this.setState({ other: this.state.other + 1 });
}
