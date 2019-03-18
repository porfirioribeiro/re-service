import * as React from 'react';
import { RServiceContext, getBitmask, ContextValue } from './utils';
import { Service, ServiceType, ServiceTypeArray, ServiceArray } from './Service';

// Ok i may be fired now :/
const dispatcher = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;

interface UseServiceOptions {
  /** Service name to connect to, default is `Service#serviceName` */
  name?: string;
  /** Subscribe this service. Default is `true`*/
  subscribe?: boolean;
}

/**
 * Use the specified Service on your component
 * By default it will subscribe to changes on the Service,
 * that can be avoided by passing `{subscribe: false}`
 * The name option is used to specify what service instance to inject
 * If not specified the default `Service#serviceName` will be used and it will
 * connect to the default instance of the Service
 * This is the expected behavior most of the times
 *
 * Use `{name: 'someService'}` only if you need to use the same service
 * multiple times differently.
 * @param serviceType Service class to use
 * @param options serviceName or options
 */
export function useService<St, Se extends Service<St>>(
  serviceType: ServiceType<St, Se>,
  options?: string | UseServiceOptions
): Se {
  const opt: UseServiceOptions = typeof options === 'string' ? { name: options } : options || {};
  const serviceName = opt.name || serviceType.serviceName;

  return dispatcher.current
    .useContext(RServiceContext, opt.subscribe === false ? 0 : getBitmask(serviceName))
    .getInstance(serviceType, serviceName) as Se;
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
