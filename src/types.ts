import { Service } from './service';

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type ServiceListener<State> = (state: State) => void;

export interface ServiceType<State extends {}, Se extends Service<State> = Service<State>> {
  new (...args: any[]): Se;
  serviceName: string;
}

export interface ServiceCtx {
  /**
   * Get or create and inject a Service in this context
   * @param serviceType Service class to inject
   * @param serviceName Service name to use as modifier
   * @param initOptions Options passed to the Service when it is creating it
   */
  get<State = {}, InitOptions = {}, Svc extends Service<State, InitOptions> = Service<State, InitOptions>>(
    serviceType: ServiceType<State, Svc>,
    serviceName?: string,
    initOptions?: InitOptions
  ): Svc;
  disposeService(serviceName: string): void;
}

export interface UseServiceOptions<InitOptions> {
  /** Service name to connect to, default is `Service#serviceName` */
  name?: string;
  /** Subscribe this service. Default is `true`*/
  subscribe?: boolean;
  /** Dispose the service after unmount. Default is `false` */
  disposable?: boolean;
  /** Options to pass to the Service, only applied the first time the service is instanciated */
  options?: InitOptions;
}
