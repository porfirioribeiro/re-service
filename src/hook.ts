import * as React from 'react';
import { RServiceContext, getBitmask } from './utils';
import { Service, ServiceType, ServiceTypeArray, ServiceArray } from './Service';

// Ok i may be fired now :/
const dispatcher = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
export function useService<St, Se extends Service<St>>(
  serviceType: ServiceType<St, Se>,
  serviceName = serviceType.serviceName
): Se {
  return dispatcher.current.useContext(RServiceContext, getBitmask(serviceName)).getInstance(serviceType, serviceName);
}

export function useServices<T extends ServiceTypeArray>(serviceTypes: T) {
  const bitmask = serviceTypes.reduce((bm, st: any) => (bm |= getBitmask(st.serviceName)), 0);
  const ctx = dispatcher.current.useContext(RServiceContext, bitmask);
  return serviceTypes.map((st: any) => ctx.getInstance(st, st.serviceName)) as ServiceArray<T>;
}
