import { createContext } from 'react';

import { ServiceMap, Service, ServiceType } from './Service';

const calculateChangedBits = (_prev: ContextValue, next: ContextValue) => next.changes;

export type UpdateServiceCallback = () => void;
export type UpdateServiceFunction = <State = {}>(
  service: Service,
  prevState: State,
  changes: Partial<State>,
  callback?: UpdateServiceCallback
) => void;

type GetInstanceFn<St = {}, Se extends Service<St> = Service<St>> = (
  serviceType: ServiceType<St, Se>,
  serviceName: string
) => Se;

export interface ContextValue {
  services: ServiceMap;
  injectedServices?: ServiceMap;
  prevInject?: Service[];
  changes: number;
  initService: <State = {}>(service: Service<State>) => void;
  updateService: UpdateServiceFunction;
  getInstance: GetInstanceFn;
}

export const emptyContext = {} as ContextValue;
export const RServiceContext = createContext<ContextValue>(emptyContext, calculateChangedBits);

/** Creates a map to store services names bitmask used for injection */
const bitmaskMap: Record<string, number> = {};

/** current bitmask count, this is always increasing to avoid colision */
let bitmaskCount = 0;

export function getBitmask(serviceName: string): number {
  return bitmaskMap[serviceName] || (bitmaskMap[serviceName] = 1 << bitmaskCount++);
}
