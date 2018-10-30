import { useContext } from 'react';
import { RServiceContext, getBitMaskForServices } from './utils';
import { Service, ServiceType, ServiceTypeArray, ServiceArray } from './Service';

export function useService<St, Se extends Service<St>>(service: ServiceType<St, Se>) {
  return useContext(RServiceContext, getBitMaskForServices([service])).getInstances([service])[0] as Se;
}

export function useServices<T extends ServiceTypeArray>(...services: T) {
  return useContext(RServiceContext, getBitMaskForServices(services)).getInstances(services) as ServiceArray<T>;
}
