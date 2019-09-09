import React, { useState } from 'react';

import { Service, useService } from '../src';
import { RouteComponentProps } from '@reach/router';

class CounterService extends Service<{ count: number }> {
  static serviceName = 'Counter';

  state = { count: 1 };

  increment = () => this.setState({ count: this.state.count + 1 });
  decrement = () => this.setState({ count: this.state.count - 1 });
}

function Counter({ name }: { name?: string }) {
  const counter = useService(CounterService, name);

  console.log('Counter', counter.serviceName);

  return <SimpleCounter counter={counter} name={name} />;
}

function SimpleCounter({ counter, name }: { counter: CounterService; name?: string }) {
  return (
    <div>
      <button onClick={counter.increment}>+</button>
      {name}:{counter.serviceName} - {counter.state.count}
      <button onClick={counter.decrement}>-</button>
    </div>
  );
}

function DisposableCounter({ id }: { id: number }) {
  const name = `counter_${id}`;
  const counter = useService(CounterService, { name, disposable: true });

  console.log('DisposableCounter', counter.serviceName);

  return (
    <>
      <div>
        Counter injected {counter.serviceName} {counter.state.count}
      </div>
      <Counter name={name} />
      <Counter name={name} />
      <SimpleCounter counter={counter} name={counter.serviceName} />
    </>
  );
}

function Feat() {
  const [show, setShow] = useState(true);

  const counter = useService(CounterService);

  return (
    <>
      {show && <DisposableCounter id={counter.state.count} />}
      <input type="checkbox" checked={show} onChange={e => setShow(e.currentTarget.checked)} />
    </>
  );
}

export default function Other(p: RouteComponentProps) {
  return (
    <>
      <Counter />
      <Counter name="counts" />
      <Feat />
    </>
  );
}
