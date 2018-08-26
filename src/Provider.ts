import { Component, createElement, ReactNode } from 'react';
import { RServiceContext, ContextValue, emptyContext } from './utils';
import { Service, ServiceType } from './Service';
import { IServicePlugin } from './Plugin';

export interface ProviderProps {
  children: ReactNode;
  /**
   * You can pass a array of plugin objects that can be used to do something
   * when the service is created every time it is changed
   */
  plugins?: IServicePlugin[];
  /**
   * Inject services in the provider
   */
  inject?: Service[];
}

/**
 * Provider component is the holder of the service map.
 * It's responsible to update it's indirect child Subscribe components
 * Updating only the components that are connected to the changed Service
 */
export class Provider extends Component<ProviderProps, ContextValue> {
  static displayName = 'RCProvider';
  state: ContextValue = {
    services: new Map(),
    changes: null,
    /**
     * Called when a service is initialized and calls all plugins `init` method
     */
    initService: <State = {}>(service: Service<State>) => {
      (this.props.plugins || []).forEach(p => {
        p.init(service as any);
      });
    },
    /**
     * Called when a service is updated
     * Sets the `servicesToUpdate` state with the changed service and calls `update` on plugins
     */
    updateService: <State = {}>(service: Service, prevState: State, changes: Partial<State>) => {
      this.setState(state => ({ changes: (state.changes || []).concat(service) }));
      if (this.props.plugins) this.props.plugins.forEach(p => p.update(service, prevState, changes));
    }
  };

  static getDerivedStateFromProps({ inject }: ProviderProps, prevState: ContextValue): Partial<ContextValue> | null {
    return inject !== prevState.prevInject
      ? {
          prevInject: inject,
          injectedServices:
            inject && new Map(inject.map(service => [service.serviceType, service]) as [ServiceType, Service][])
        }
      : null;
  }

  /** Only update  */
  shouldComponentUpdate(nextProps: ProviderProps, nextState: ContextValue) {
    return nextProps !== this.props || !!nextState.changes;
  }

  componentDidUpdate() {
    // Cleanup `servicesToUpdate`
    if (this.state.changes) this.setState({ changes: null });
    //todo Probably i could probably call update on plugins here passing an array with the modified services
  }

  renderChild = (contextValue: ContextValue) =>
    createElement(
      RServiceContext.Provider,
      {
        value:
          contextValue !== emptyContext
            ? Object.assign({}, contextValue, { injectedServices: this.state.injectedServices })
            : this.state
      },
      this.props.children
    );

  render() {
    return createElement(RServiceContext.Consumer, {
      children: this.renderChild
    });
  }
}
