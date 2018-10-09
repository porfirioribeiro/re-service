import { Service } from '../src';

class Toggler extends Service<{ on: boolean }> {
  static serviceName = 'TogglerService';
  constructor(on = false) {
    super();
    this.state = {
      on
    };
  }
  toggle = () => this.setState({ on: !this.state.on });
}

describe('Service', () => {
  it('serviceName and serviceType matches on Service.create', () => {
    const toggler = Service.create(Toggler);

    expect(toggler.serviceName).toBe(Toggler.serviceName);
    expect(toggler.serviceName).toBe('TogglerService');
    expect(toggler.serviceType).toBe(Toggler);
    expect(toggler).toBeInstanceOf(Toggler);
  });

  it('changes the state when setState is called', () => {
    const toggler = Service.create(Toggler);

    expect(toggler.state.on).toBe(false);
    toggler.toggle();
    expect(toggler.state.on).toBe(true);
  });

  it('creates a Service with a different name', () => {
    const toggler = Service.create(Toggler, 'FooToggler');

    expect(toggler.serviceName).not.toBe(Toggler.serviceName);
    expect(toggler.serviceName).toBe('FooToggler');
  });

  it('creates a Service with parameters', () => {
    const toggler = Service.create(Toggler, 'Toggler', true);

    expect(toggler.state.on).toBe(true);
  });
});
