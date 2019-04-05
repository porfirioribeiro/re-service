import { ServiceListener, Mutable, ServiceCtx } from "./types";

export abstract class Service<State, InitOptions = {}> {
  state: State; // prettier-ignore
  readonly serviceName: string;
  readonly serviceContext: ServiceCtx;

  private listeners: ServiceListener<any>[] = [];

  protected initState?(initOptions: InitOptions): State;
  protected disposeService?(): void;

  static dispose<State>(service: Service<State>) {
    if (service.disposeService) service.disposeService();
  }

  constructor(
    serviceContext: ServiceCtx,
    serviceName: string,
    initOptions: InitOptions
  ) {
    this.serviceContext = serviceContext;
    this.serviceName = serviceName;

    this.state = this.initState ? this.initState(initOptions) : ({} as State);
  }

  protected setState(newState: Partial<State>) {
    const state = Object.assign({}, this.state, newState);
    (this as Mutable<Service<State>>).state = state;
    this.listeners.forEach(l => l(state));
  }

  subscribe(listener: ServiceListener<State>) {
    this.listeners.push(listener);
    return () => (
      (this.listeners = this.listeners.filter(l => l != listener)), void 0
    );
  }
}
