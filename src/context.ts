import { createContext, useContext, useState, useEffect } from 'react';

import { Service } from './service';
import { ServiceCtx, ServiceType, UseServiceOptions } from './types';

export function createServiceContext(): ServiceCtx {
  const services: Record<string, Service<any> | undefined> = {};
  return {
    get(serviceType, serviceName = serviceType.serviceName, initOptions) {
      return (services[serviceName] ||
        (services[serviceName] = new serviceType(this, serviceName, initOptions))) as any;
    },
    disposeService(serviceName: string) {
      const service = services[serviceName];
      if (service) Service.dispose(service);
      delete services[serviceName];
    }
  };
}

export const defaultServiceContext = createServiceContext();

const ServiceContext = createContext<ServiceCtx>(defaultServiceContext);

/**
 * Wrap your components with this Provider to use a diferent ServiceCtx
 */
export const Provider = ServiceContext.Provider;

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
export function useService<State, InitOptions, Svc extends Service<State, InitOptions>>(
  serviceType: ServiceType<State, Svc>,
  options?: string | UseServiceOptions<InitOptions>
): Svc {
  const opt: UseServiceOptions<InitOptions> = typeof options === 'string' ? { name: options } : options || {};
  const serviceName = opt.name || serviceType.serviceName;

  const ctx = useContext(ServiceContext);
  const service = ctx.get(serviceType, serviceName, opt.options);
  const s = useState(service.state);

  useEffect(() => (opt.subscribe !== false ? service.subscribe(s[1]) : void 0), [service, opt.subscribe]);

  useEffect(() => (opt.disposable ? () => ctx.disposeService(serviceName) : void 0), [service, opt.disposable]);

  return service as Svc;
}

export function useServiceInstance<State>(service: Service<State>) {
  const s = useState(service.state);
  useEffect(() => service.subscribe(s[1]), [service]);
}
