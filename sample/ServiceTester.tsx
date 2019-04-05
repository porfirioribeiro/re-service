import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useService } from '../src';
import { MyService, OtherService } from './services';

class Tester extends React.PureComponent {
  timeout: any;
  ref = React.createRef<HTMLDivElement>();
  componentDidUpdate() {
    const ref = this.ref.current!.firstElementChild as HTMLDivElement;
    ref.style.color = 'red';
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => (ref.style.color = 'inherit'), 500);
  }
  render() {
    return <div ref={this.ref}>{this.props.children}</div>;
  }
}

function HookService({ name }: { name: string }) {
  const myService = useService(MyService, name);
  return (
    <Tester>
      <button onClick={myService.increment}>{`myService(${name})` + myService.state.value}</button>
    </Tester>
  );
}

function Disconnected() {
  const myService = useService(MyService, { subscribe: false });
  return (
    <Tester>
      <button onClick={myService.increment}>myService(disconnected)</button>
    </Tester>
  );
}

function S1() {
  const myService = useService(MyService);
  return (
    <Tester>
      <button onClick={myService.increment}>{'myService ' + myService.state.value}</button>
    </Tester>
  );
}

function S2() {
  const other = useService(OtherService);
  return (
    <Tester>
      <button onClick={other.increment}>{'other ' + other.state.other}</button>
    </Tester>
  );
}

function S3() {
  const myService = useService(MyService);
  const other = useService(OtherService);
  return (
    <Tester>
      <button
        onClick={() => {
          myService.increment();
          other.increment();
        }}
      >
        {'myService ' + myService.state.value + ' other ' + other.state.other}
      </button>
    </Tester>
  );
}

const ServiceTester: React.SFC<RouteComponentProps> = () => (
  <div style={{ display: 'flex' }}>
    <S1 />
    <S2 />
    <S3 />
    <div>
      <HookService name="serviceone" />
      <HookService name="MyService" />
      <HookService name="serviceone" />
      <Disconnected />
    </div>
  </div>
);

export default ServiceTester;
