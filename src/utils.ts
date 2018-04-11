import { createContext, Context } from 'react';
import { ServiceMap, Service, getBitMaskForServices } from './Service';

const calculateChangedBits = (_prev: ContextValue, next: ContextValue) =>
  next.servicesToUpdate ? getBitMaskForServices(next.servicesToUpdate) : 0;

export interface ContextValue {
  services: ServiceMap;
  initService: <State = {}>(service: Service<State>) => void;
  updateService: <State = {}>(service: Service, prevState: State, changes: Partial<State>) => void;
  servicesToUpdate: Service[] | null;
}

export const RServiceContext: Context<ContextValue> = createContext({} as ContextValue, calculateChangedBits);
