import * as React from 'react';

import { Subscribe } from '../../dist';

import { MyService, OtherService } from './services';

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

export default class App extends React.Component {
  render() {
    return (
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
    );
  }
}
