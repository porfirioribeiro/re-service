import { Service } from 'rc-service/es6';

export class MyService extends Service {
  static serviceName = 'MyService';
  state = {
    value: 10
  };
  increment = () => this.setState({ value: this.state.value + 1 });
}

export class OtherService extends Service {
  static serviceName = 'OtherService';
  state = {
    other: 10
  };
  increment = () => this.setState({ other: this.state.other + 1 });
}
