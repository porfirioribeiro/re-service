/* eslint-disable dot-notation, new-cap */
import { createContext, useContext, useReducer, useEffect, useLayoutEffect } from 'react';

import { Service } from './service';
import { ServiceCtx, ServiceType } from './types';

const useFineEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function createServiceContext(): ServiceCtx {
  const services: Record<string, Service<any> | undefined> = {};
  return {
    get services() {
      return services;
    },
    get(serviceType, key, initOptions) {
      const serviceName = serviceType.serviceName + (key ? `_${key}` : '');

      return (services[serviceName] ||
        (services[serviceName] = new serviceType({ serviceContext: this, key, serviceName }, initOptions))) as any;
    },
    disposeService(serviceName: string) {
      const service = services[serviceName];
      if (service && service['disposeService']) service['disposeService']();
      delete services[serviceName];
    },
  };
}

export const defaultServiceContext = createServiceContext();

const ServiceContext = createContext<ServiceCtx>(defaultServiceContext);

/**
 * Wrap your components with this Provider to use a diferent ServiceCtx
 */
export const Provider = ServiceContext.Provider;

const reducer = (_: any, action: any) => action;

/**
 * Use the specified Service on your component
 * It will subscribe to changes on the Service,
 * The key param is used to specify what service instance to inject

 * @param serviceType Service class to use
 * @param key Used to identify the service when multiple instances are used
 * @param initOptions Is passed to Service constructed when it is initialized
 */
export function useService<State, InitOptions, Svc extends Service<State, InitOptions>>(
  serviceType: ServiceType<State, InitOptions, Svc>,
  key?: string | null,
  initOptions?: InitOptions,
): Svc {
  const service = useServiceCtx().get(serviceType, key, initOptions);
  useServiceInstance(service);
  return service as Svc;
}

/**
 * Get the current ServiceContext from the context
 */
export function useServiceCtx() {
  return useContext(ServiceContext);
}

/**
 * Subscribe to a service
 * @param service
 */
export function useServiceInstance<State>(service: Service<State>): State;
/**
 * Subscribe to a service, with a selector
 * @param service
 * @param selector
 */
export function useServiceInstance<State, R>(service: Service<State>, selector: (state: State) => R): R;
export function useServiceInstance<State, R>(service: Service<State>, selector?: (state: State) => R): R {
  const [state, dispatch] = selector
    ? useReducer((_: R, a: State) => selector(a), service.state, selector)
    : useReducer(reducer, service.state);
  useFineEffect(() => service.subscribe(dispatch), [service]);
  return state;
}

/**
 * This function can be used as a `serviceLifecycle`
 * It will dispose the service and remove it from context when the last subscriber unsubscribes
 * Usefull for short lived services that might only be needed at a certein level of the app
 *
 * ```jsx
 * class AutoDisposable extends Service<{}> {
 *   static serviceName = 'AutoDisposableService';
 *   serviceLifecycle = autoDispose;
 * }
 *
 * function Comp(){
 *   const service= useService(AutoDisposable);
 * }
 * ```
 * As soon as Comp is unmounted, this servie will be disposed, as nobody else is using it
 * @param this
 */
export function autoDispose(this: Service<any>) {
  return () => this.serviceContext.disposeService(this.serviceName);
}
