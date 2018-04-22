import { Context, createContext } from 'react';
import { ServiceMap, Service } from './Service';

const calculateChangedBits = (_prev: ContextValue, next: ContextValue) =>
  next.changes ? next.getBitMaskForServices(next.changes) : 0;

export interface ContextValue {
  services: ServiceMap;
  serviceBitMaskMap: Map<Service, number>;
  changes: Service[] | null;
  getBitMaskForServices: (services: Service[]) => number;
  initService: <State = {}>(service: Service<State>) => void;
  updateService: <State = {}>(service: Service, prevState: State, changes: Partial<State>) => void;
}

export const RServiceContext: Context<ContextValue> = createContext({} as ContextValue, calculateChangedBits);
