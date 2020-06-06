import { Service, defaultServiceContext } from '../src';

class Toggler extends Service<{ on: boolean }, { on: boolean }> {
  static serviceName = 'TogglerService';
  initState({ on = false } = {}) {
    return {
      on,
    };
  }
  toggle = () => this.setState({ on: !this.state.on });
}

describe('Service', () => {
  it('serviceName and serviceType matches on defaultServiceContext.get', () => {
    const toggler = defaultServiceContext.get(Toggler);

    expect(toggler.serviceName).toBe(Toggler.serviceName);
    expect(toggler.serviceName).toBe('TogglerService');
    expect(toggler).toBeInstanceOf(Toggler);
  });

  it('changes the state when setState is called', () => {
    const toggler = defaultServiceContext.get(Toggler);

    expect(toggler.state.on).toBe(false);
    toggler.toggle();
    expect(toggler.state.on).toBe(true);
  });

  it('creates a Service with a different name', () => {
    const toggler = defaultServiceContext.get(Toggler, 'FooToggler');

    expect(toggler.serviceName).not.toBe(Toggler.serviceName);
    expect(toggler.serviceName).toBe('FooToggler');
  });

  it('creates a Service with parameters', () => {
    const toggler = defaultServiceContext.get(Toggler, 'Toggler', { on: true });

    expect(toggler.state.on).toBe(true);
  });
});
