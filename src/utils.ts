import { createContext } from 'react';
// @ts-ignore  - Typings
import { Context } from 'react';
import { ServiceMap, Service } from './Service';

const calculateChangedBits = (_prev: ContextValue, next: ContextValue) =>
  next.changes ? getBitMaskForServices(next.changes) : 0;

export interface ContextValue {
  services: ServiceMap;
  injectedServices?: ServiceMap;
  prevInject?: Service[];
  changes: Service[] | null;
  initService: <State = {}>(service: Service<State>) => void;
  updateService: <State = {}>(service: Service, prevState: State, changes: Partial<State>) => void;
}

export const emptyContext = {} as ContextValue;
export const RServiceContext = createContext<ContextValue>(emptyContext, calculateChangedBits);

const serviceBitMaskMap = new Map<Service, number>();

export const getBitMaskForServices = (services: Service[]): number =>
  services.reduce((mask, service) => {
    let m = serviceBitMaskMap.get(service);
    if (!m) serviceBitMaskMap.set(service, (m = 1 << serviceBitMaskMap.size));
    return (mask |= m);
  }, 0);
