const serviceBitMaskMap = new Map<string, number>();
let lastBitMask = 1;

/**
 * Service class has to be overridden
 * Sub classes of it should define their initial `state` object and the changing functions
 * You should never mutate the `state` itself, call `setState` with the new partial state
 * It will override the state and update the Provider that it is connected to
 */
export class Service<State = {}> {
  state!: State; // prettier-ignore
  readonly serviceName!: string;
  /** @internal */
  update = (_service: Service<State>, _oldState: State, _changes: Partial<State>) => {};
  constructor() {}

  /** Set the state of this service and updates the Provider */
  setState(changes?: Partial<State>) {
    if (changes) {
      const oldState = this.state;
      this.state = Object.assign({}, this.state, changes);
      this.update(this, oldState, changes);
    }
  }

  /** Create a Service and initializes it */
  static create<State, Se extends Service<State>>(
    serviceType: ServiceType<State, Se>,
    init?: (service: Se) => void
  ): Se {
    const service = new serviceType();
    // Should only log this with process.env.NODE_ENV!=='production'
    // Also, if using typescript it is already mandatory
    // if (service.serviceName)
    //   console.error(
    //     `Warning: ${
    //       service.serviceName
    //     }: serviceName is defined as an instance var and will be ignored. Instead, declare it as a static var.`
    //   );

    (service as any).serviceName = serviceType.serviceName;

    // Should only log this with process.env.NODE_ENV!=='production'
    // if (service.state === undefined)
    //   console.error(
    //     `Service: '${service.serviceName}' has an undefined state, please check the body of ${service.serviceName}`
    //   );

    // Object.freeze(service.state); todo freeze state in development mode

    if (init) init(service);
    return service;
  }
}

export interface ServiceType<St = {}, Se extends Service<St> = Service<St>> {
  new (): Se;
  serviceName: string;
}

/** @internal Get or create the bitMask of this service */
export function getServiceNameBitMask(serviceName: string): number {
  let mask = serviceBitMaskMap.get(serviceName);
  if (!mask) {
    serviceBitMaskMap.set(serviceName, (mask = lastBitMask));
    lastBitMask *= 2;
  }
  return mask;
}

/** @internal Get bitMask for an array of services */
export function getBitMaskForServices(serviceTypes: ServiceType[]): number {
  return serviceTypes.reduce((mask, serviceType) => (mask |= getServiceNameBitMask(serviceType.serviceName)), 0);
}

/** @internal Get bitMask for an array of services */
export function getBitMaskForServiceNames(serviceNames: string[]): number {
  return serviceNames.reduce((mask, serviceName) => (mask |= getServiceNameBitMask(serviceName)), 0);
}

export type ServiceMap = Map<ServiceType, Service>;
