import { ServiceListener, Mutable, ServiceCtx } from './types';
import { batch } from './batch';

export abstract class Service<State, InitOptions = {}> {
  state: State;
  initOptions: InitOptions;
  readonly serviceName: string;
  readonly serviceContext: ServiceCtx;

  private _listeners: ServiceListener<any>[] = [];

  protected initState?(initOptions: InitOptions): State;
  protected postInit?(): void;
  protected disposeService?(): void;

  static dispose<State>(service: Service<State>) {
    if (service.disposeService) service.disposeService();
  }

  constructor(serviceContext: ServiceCtx, serviceName: string, initOptions: InitOptions) {
    this.serviceContext = serviceContext;
    this.serviceName = serviceName;
    this.initOptions = initOptions;

    this.state = this.initState ? this.initState(initOptions) : ({} as State);
    if (this.postInit) this.postInit();
  }

  protected setState(newState: Partial<State>): void;
  protected setState(newState: State, full: true): void;
  protected setState(newState: State, full?: boolean) {
    const state = full ? newState : Object.assign({}, this.state, newState);
    (this as Mutable<Service<State>>).state = state;
    batch(listeners => {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](state);
      }
    }, this._listeners);
  }

  subscribe(listener: ServiceListener<State>) {
    this._listeners.push(listener);
    return () => ((this._listeners = this._listeners.filter(l => l != listener)), void 0);
  }
}
