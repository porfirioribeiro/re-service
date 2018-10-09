import * as React from 'react';
import { render, fireEvent } from 'react-testing-library';
// this adds custom jest matchers from jest-dom
import 'jest-dom/extend-expect'

import { Service, Provider, Subscribe } from '../src';

function click(el: HTMLElement) {
  fireEvent(
    el,
    new MouseEvent('click', {
      bubbles: true, // click events must bubble for React to see it
      cancelable: true
    })
  );
}

export class MyService extends Service {
  static serviceName = 'MyService';
  state = {
    value: 10
  };
  increment = () => this.setState({ value: this.state.value + 1 });
  decrement = () => this.setState({ value: this.state.value - 1 });
}

const Counter = () => (
  <Subscribe to={[MyService]}>
    {counter => (
      <div>
        <span data-testid="value">{counter.state.value}</span>
        <button data-testid="decrement" onClick={() => counter.decrement()}>
          -
        </button>
        <button data-testid="increment" onClick={() => counter.increment()}>
          +
        </button>
      </div>
    )}
  </Subscribe>
);

describe('Provider', () => {
  it('does something', () => {
    const p = render(
      <Provider>
        <Counter />
      </Provider>
    );
    expect(p.getByTestId('value')).toHaveTextContent('10');
    click(p.getByTestId('increment'));
    expect(p.getByTestId('value')).toHaveTextContent('11');
    click(p.getByTestId('decrement'));
    expect(p.getByTestId('value')).toHaveTextContent('10');
  });

  it('Provider with inject', () => {
    const myService = Service.create(MyService);

    const p = render(
      <Provider inject={[myService]}>
        <Counter />
      </Provider>
    );
    expect(p.getByTestId('value')).toHaveTextContent('10');
    expect(myService.state.value).toBe(10);
    click(p.getByTestId('increment'));
    expect(p.getByTestId('value')).toHaveTextContent('11');
    expect(myService.state.value).toBe(11);
    click(p.getByTestId('decrement'));
    expect(p.getByTestId('value')).toHaveTextContent('10');
    expect(myService.state.value).toBe(10);
  });
});
