const serviceBitMaskMap = new Map<string, number>();

export class Service<State = {}> {
  state!: State; // prettier-ignore
  readonly serviceName = (this.constructor as any).serviceName || this.constructor.name;
  update = (_service: Service<State>, _oldState: State, _changes: Partial<State>) => {};
  constructor() {}
  setState(changes?: Partial<State>) {
    if (changes) {
      const oldState = this.state;
      this.state = Object.assign({}, this.state, changes);
      this.update(this, oldState, changes);
    }
  }
}

export interface ServiceType<St = {}, Se extends Service<St> = Service<St>> {
  new (): Se;
  serviceName: string;
}

export function createService<St, Se extends Service<St>>(
  serviceType: ServiceType<St, Se>,
  init: (service: Se) => void
): Se {
  const service = new serviceType();
  init(service);
  return service;
}

export function getServiceNameBitMask(serviceName: string): number {
  let mask = serviceBitMaskMap.get(serviceName);
  if (!mask) serviceBitMaskMap.set(serviceName, (mask = (serviceBitMaskMap.size + 1) * 2));
  return mask;
}

export function getBitMaskForServices(serviceTypes: ServiceType[]): number {
  return serviceTypes.reduce((mask, serviceType) => (mask |= getServiceNameBitMask(serviceType.serviceName)), 0);
}

export function getBitMaskForServiceNames(serviceNames: string[]): number {
  return serviceNames.reduce((mask, serviceName) => (mask |= getServiceNameBitMask(serviceName)), 0);
}

export type ServiceMap = Map<ServiceType, Service>;
