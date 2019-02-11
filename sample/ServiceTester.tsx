import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Subscribe, Service, Provider, useService } from '../src';
import { MyService, OtherService } from './services';

const injectedService = Service.create(MyService, 'MyService');

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
  console.log('useServices', name);
  const myService = useService(MyService, name);

  return (
    <Tester>
      <button onClick={myService.increment}>{`myService(${name})` + myService.state.value}</button>
    </Tester>
  );
}

const ServiceTester: React.SFC<RouteComponentProps> = () => (
  <div style={{ display: 'flex' }}>
    <Subscribe
      to={[MyService]}
      render={myService => (
        <Tester>
          <button onClick={myService.increment}>{'myService ' + myService.state.value}</button>
        </Tester>
      )}
    />
    <Subscribe
      to={[OtherService]}
      render={other => (
        <Tester>
          <button onClick={other.increment}>{'other ' + other.state.other}</button>
        </Tester>
      )}
    />
    <Subscribe
      to={[MyService, OtherService]}
      render={(myService: MyService, other: OtherService) => (
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
      )}
    />
    <Provider inject={[injectedService]}>
      <Subscribe
        to={[MyService]}
        render={(myService: MyService) => (
          <Tester>
            <button onClick={myService.increment}>{'myService ' + myService.state.value}</button>
          </Tester>
        )}
      />
      <Subscribe
        to={[OtherService]}
        render={(other: OtherService) => (
          <Tester>
            <button onClick={other.increment}>{'other ' + other.state.other}</button>
          </Tester>
        )}
      />
    </Provider>
    <div>
      <HookService name="serviceone" />
      <HookService name="MyService" />
      <HookService name="serviceone" />
    </div>
    {/* Hello <RServiceContext.Consumer>{x => x.test}</RServiceContext.Consumer>
            <button onClick={_ => this.setState({ test: 'hello' })}>xxx</button> */}
  </div>
);

export default ServiceTester;
