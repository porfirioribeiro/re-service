import { createContext } from 'react';

import { ServiceMap, Service, ServiceType, ServiceTypeArray, ServiceArray } from './Service';

const calculateChangedBits = (_prev: ContextValue, next: ContextValue) =>
  next.changes ? getBitMaskForServices(next.changes) : 0;

export type UpdateServiceCallback = () => void;
export type UpdateServiceFunction = <State = {}>(
  service: Service,
  prevState: State,
  changes: Partial<State>,
  callback?: UpdateServiceCallback
) => void;

export interface ContextValue {
  services: ServiceMap;
  injectedServices?: ServiceMap;
  prevInject?: Service[];
  changes: Service[] | null;
  initService: <State = {}>(service: Service<State>) => void;
  updateService: UpdateServiceFunction;
  getInstances: <T extends ServiceTypeArray>(serviceTypes: T) => ServiceArray<T>;
}

export const emptyContext = {} as ContextValue;
export const RServiceContext = createContext<ContextValue>(emptyContext, calculateChangedBits);

const serviceBitMaskMap = new Map<ServiceType, number>();

export const getBitMaskForServices = (services: (ServiceType | Service)[]): number =>
  services.reduce((mask, service) => {
    const serviceType = service instanceof Service ? service.serviceType : service;
    let m = serviceBitMaskMap.get(serviceType);
    if (!m) serviceBitMaskMap.set(serviceType, (m = 1 << serviceBitMaskMap.size));
    return (mask |= m);
  }, 0);
