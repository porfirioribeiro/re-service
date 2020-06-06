/* eslint-disable no-dupe-class-members,no-underscore-dangle */
import { ServiceListener, Mutable, ServiceCtx } from './types';
import { batch } from './batch';

export type ServiceInit = { serviceContext: ServiceCtx; serviceName: string };

export abstract class Service<State, InitOptions = {}> {
  state: State;
  readonly initOptions?: InitOptions;
  readonly serviceName: string;
  readonly serviceContext: ServiceCtx;

  private _listeners: ServiceListener<any>[] = [];

  protected initState?(initOptions?: InitOptions): State;
  protected disposeService?(): void;

  static dispose<State>(service: Service<State>) {
    if (service.disposeService) service.disposeService();
  }

  constructor(init: ServiceInit, options?: InitOptions) {
    this.serviceContext = init.serviceContext;
    this.serviceName = init.serviceName;
    this.initOptions = options;
    this.state = this.initState ? this.initState(options) : ({} as State);
  }

  protected setState(newState: Partial<State>): void;
  protected setState(newState: State, o: { full: true; silent?: boolean; queue?: boolean }): void;
  protected setState(newState: Partial<State>, o: { full?: false; silent?: boolean; queue?: boolean }): void;
  protected setState(newState: State, { full, silent, queue }: { full?: boolean; silent?: boolean; queue?: boolean } = {}) {
    const state = full ? newState : Object.assign({}, this.state, newState);
    (this as Mutable<Service<State>>).state = state;
    if (!silent) {
      const callback = () =>
        batch(listeners => {
          for (let i = 0; i < listeners.length; i += 1) {
            listeners[i](state);
          }
        }, this._listeners);
      if (queue) queueMicrotask(callback);
      else callback();
    }
  }

  subscribe(listener: ServiceListener<State>) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  }
}
