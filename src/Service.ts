/**
 * Service class has to be overridden
 * Sub classes of it should define their initial `state` object and the changing functions
 * You should never mutate the `state` itself, call `setState` with the new partial state
 * It will override the state and update the Provider that it is connected to
 */
export class Service<State = {}> {
  state!: State; // prettier-ignore
  readonly serviceName!: string;
  readonly serviceType!: ServiceType<State>;
  /** @internal */
  onServiceUpdate?: (_service: Service<State>, _oldState: State, _changes: Partial<State>) => void;
  constructor() {}

  /** Set the state of this service and updates the Provider */
  setState(changes?: Partial<State>) {
    if (changes) {
      const oldState = this.state;
      this.state = Object.assign({}, this.state, changes);
      if (this.onServiceUpdate) this.onServiceUpdate(this, oldState, changes);
    }
  }

  /** Create a Service and initializes it */
  static create<State, Se extends Service<State>>(
    serviceType: ServiceType<State, Se>,
    serviceName?: string,
    ...args: any[]
  ): Se {
    const service = new serviceType(...args);
    // Should only log this with process.env.NODE_ENV!=='production'
    // Also, if using typescript it is already mandatory
    // if (service.serviceName)
    //   console.error(
    //     `Warning: ${
    //       service.serviceName
    //     }: serviceName is defined as an instance var and will be ignored. Instead, declare it as a static var.`
    //   );

    (service as any).serviceType = serviceType;
    (service as any).serviceName = serviceName || serviceType.serviceName;

    // Should only log this with process.env.NODE_ENV!=='production'
    // if (service.state === undefined)
    //   console.error(
    //     `Service: '${service.serviceName}' has an undefined state, please check the body of ${service.serviceName}`
    //   );

    // Object.freeze(service.state); todo freeze state in development mode
    return service;
  }
}

export interface ServiceType<St = {}, Se extends Service<St> = Service<St>> {
  new (...args: any[]): Se;
  serviceName: string;
}

export type ServiceMap = Map<ServiceType, Service>;
