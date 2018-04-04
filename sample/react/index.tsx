import * as React from 'react';
import { render } from 'react-dom';

import { Provider, Service, Subscribe } from '../../src';
import { LogServicePlugin, PersistServicePlugin } from '../../src/plugins';

class MyService extends Service {
  static serviceName = 'MyService';
  state = {
    value: 10
  };
  increment = () => this.setState({ value: this.state.value + 1 });
}

class OtherService extends Service {
  static serviceName = 'OtherService';
  state = {
    other: 10
  };
  increment = () => this.setState({ other: this.state.other + 1 });
}

class Tester extends React.PureComponent {
  timeout: any;
  ref: HTMLDivElement;
  componentDidUpdate() {
    this.ref.style.color = 'red';
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => (this.ref.style.color = 'inherit'), 500);
  }
  setRef = r => (this.ref = r && r.firstElementChild);
  render() {
    return <div ref={this.setRef}>{this.props.children}</div>;
  }
}

class App extends React.Component {
  render() {
    return (
      <Provider plugins={[LogServicePlugin, PersistServicePlugin]}>
        <div style={{ display: 'flex' }}>
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
          {/* Hello <RServiceContext.Consumer>{x => x.test}</RServiceContext.Consumer>
          <button onClick={_ => this.setState({ test: 'hello' })}>xxx</button> */}
        </div>
      </Provider>
    );
  }
}

render(React.createElement(App), document.getElementById('root'));
