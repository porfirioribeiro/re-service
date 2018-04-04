import { createContext, Context } from 'react';
import { ServiceMap, Service, getBitMaskForServiceNames } from './Service';

const calculateChangedBits = (_prev: ContextValue, next: ContextValue) =>
  next.servicesToUpdate ? getBitMaskForServiceNames(next.servicesToUpdate) : 0;

export interface ContextValue {
  services: ServiceMap;
  init: <State = {}>(service: Service<State>) => void;
  update: <State = {}>(service: Service, prevState: State, changes: Partial<State>) => void;
  servicesToUpdate?: string[];
}

export const RServiceContext: Context<ContextValue> = createContext({} as ContextValue, calculateChangedBits);
