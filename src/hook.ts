import * as React from 'react';
import { RServiceContext, getBitmask, ContextValue } from './utils';
import { Service, ServiceType, ServiceTypeArray, ServiceArray } from './Service';

// Ok i may be fired now :/
const dispatcher = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;

interface UserServiceOptions {
  name?: string;
  group?: string;
}

export function useService<St, Se extends Service<St>>(
  serviceType: ServiceType<St, Se>,
  options?: string | UserServiceOptions
): Se {
  const serviceName = typeof options === 'string' ? options : (options && options.name) || serviceType.serviceName;

  const ctx: ContextValue = dispatcher.current.useContext(RServiceContext, getBitmask(serviceName));

  return ctx.getInstance(serviceType, serviceName) as Se;
}

export function useServiceDisposable<St, Se extends Service<St>>(
  serviceType: ServiceType<St, Se>,
  serviceName?: string
): Se {
  const u = React.useRef(Math.random() * 1e10);

  const sname = serviceName || `tmp${u.current}_${serviceType.serviceName}`;

  const ctx: ContextValue = dispatcher.current.useContext(RServiceContext, getBitmask(sname));

  React.useEffect(() => () => ctx.disposeService(sname), [sname]);
  return ctx.getInstance(serviceType, sname) as Se;
}

export function useServices<T extends ServiceTypeArray>(serviceTypes: T) {
  const bitmask = serviceTypes.reduce((bm, st: any) => (bm |= getBitmask(st.serviceName)), 0);
  const ctx = dispatcher.current.useContext(RServiceContext, bitmask);
  return serviceTypes.map((st: any) => ctx.getInstance(st, st.serviceName)) as ServiceArray<T>;
}
