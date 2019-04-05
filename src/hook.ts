import * as React from 'react';
import { RServiceContext, getBitmask, ContextValue } from './utils';
import { Service, ServiceType } from './Service';

// Ok i may be fired now :/
const dispatcher = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;

interface UseServiceOptions {
  /** Service name to connect to, default is `Service#serviceName` */
  name?: string;
  /** Subscribe this service. Default is `true`*/
  subscribe?: boolean;
  /** Dispose the service after unmount. Default is `false` */
  disposable?: boolean;
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
 *
 * Use `{disposable: true, name: 'someService'}` to make the service disposable.
 * A disposable service will be destroyed after the component unmount.
 * May be usefull to inject in a sub Provider
 * When `disposable: true` be aware that if you don't specify a name you will destroy the default instance of your service.
 * Make sure that is what you want
 * @param serviceType Service class to use
 * @param options serviceName or options
 */
export function useService<St, Se extends Service<St>>(
  serviceType: ServiceType<St, Se>,
  options?: string | UseServiceOptions
): Se {
  const opt: UseServiceOptions = typeof options === 'string' ? { name: options } : options || {};
  const serviceName = opt.name || serviceType.serviceName;

  const ctx: ContextValue = dispatcher.current.useContext(
    RServiceContext,
    opt.subscribe === false ? 0 : getBitmask(serviceName)
  );

  React.useEffect(() => (opt.disposable ? () => ctx.disposeService(serviceName) : void 0), [
    serviceName,
    opt.disposable
  ]);

  return ctx.getInstance(serviceType, serviceName) as Se;
}
