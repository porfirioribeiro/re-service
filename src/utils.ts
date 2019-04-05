import { createContext } from 'react';

import { ServiceMap, Service, ServiceType } from './Service';

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
  inject?: Service[];
  changes: number;
  updateService: UpdateServiceFunction;
  getInstance: GetInstanceFn;
  disposeService(serviceName: string): void;
}

export const emptyContext = {} as ContextValue;
export const RServiceContext = createContext<ContextValue>(emptyContext, (_prev, next) => next.changes);

/** Creates a map to store services names bitmask used for injection */
const bitmaskMap: Record<string, number> = {};

/** current bitmask count, this is always increasing to avoid colision */
let bitmaskCount = 0;

export function getBitmask(serviceName: string): number {
  return bitmaskMap[serviceName] || (bitmaskMap[serviceName] = 1 << bitmaskCount++);
}
