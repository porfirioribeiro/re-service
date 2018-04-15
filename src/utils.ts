import { ComponentType, ReactNode, createContext } from 'react';
import { ServiceMap, Service, ServiceType } from './Service';

export interface Context<T> {
  Provider: ComponentType<{
    value: T;
    children?: ReactNode;
  }>;
  Consumer: ComponentType<{
    children: (value: T) => ReactNode;
    unstable_observedBits?: number;
  }>;
}

const serviceBitMaskMap = new Map<string, number>();

function serviceReducer(mask: number, serviceName: string) {
  let m = serviceBitMaskMap.get(serviceName);
  if (!m) serviceBitMaskMap.set(serviceName, (m = 1 << serviceBitMaskMap.size));
  return (mask |= m);
}

export function getBitMaskForServices(services: Service[]): number {
  return services.map(service => service.serviceName).reduce(serviceReducer, 0);
}

export function getBitMaskForServiceTypes(services: ServiceType[]): number {
  return services.map(service => service.serviceName).reduce(serviceReducer, 0);
}

const calculateChangedBits = (_prev: ContextValue, next: ContextValue) =>
  next.changes ? getBitMaskForServices(next.changes) : 0;

export interface ContextValue {
  services: ServiceMap;
  changes: Service[] | null;
  initService: <State = {}>(service: Service<State>) => void;
  updateService: <State = {}>(service: Service, prevState: State, changes: Partial<State>) => void;
}

export const RServiceContext: Context<ContextValue> = createContext({} as ContextValue, calculateChangedBits);
