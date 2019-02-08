import { Component, createElement, ReactNode } from 'react';
// @ts-ignore  - Typings
import { ProviderProps, ConsumerProps, ReactElement } from 'react';

import { RServiceContext, ContextValue, emptyContext, getBitmask } from './utils';
import { Service } from './Service';
import { IServicePlugin } from './Plugin';

export interface IProviderProps {
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
  /**
   * This provider is the root provider, will not try to Subscribe to parent Provider's
   */
  root?: boolean;
}

/**
 * Provider component is the holder of the service map.
 * It's responsible to update it's indirect child Subscribe components
 * Updating only the components that are connected to the changed Service
 */
export class Provider extends Component<IProviderProps, ContextValue> {
  static displayName = 'RCProvider';
  state: ContextValue = {
    services: {},
    changes: 0,
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
    updateService: (service, prevState, changes, callback) => {
      this.setState(state => ({ changes: state.changes | getBitmask(service.serviceName) }), callback);
      if (this.props.plugins) this.props.plugins.forEach(p => p.update(service, prevState, changes));
    },
    getInstance: (serviceType, serviceName) => {
      let instance =
        (this.state.injectedServices && this.state.injectedServices[serviceName]) || this.state.services[serviceName];
      if (!instance) {
        instance = Service.create(serviceType, serviceName);
        this.state.initService(instance);
        this.state.services[serviceName] = instance;
      }
      // @ts-ignore
      instance.onServiceUpdate = this.state.updateService;
      return instance;
    }
  };

  static getDerivedStateFromProps({ inject }: IProviderProps, prevState: ContextValue): Partial<ContextValue> | null {
    return inject !== prevState.prevInject
      ? {
          prevInject: inject,
          injectedServices: inject && inject.reduce((acc, service) => ({ ...acc, [service.serviceName]: service }), {})
        }
      : null;
  }

  /** Only update  */
  shouldComponentUpdate(nextProps: IProviderProps, nextState: ContextValue) {
    return nextProps !== this.props || !!nextState.changes;
  }

  componentDidUpdate() {
    // Cleanup `servicesToUpdate`
    if (this.state.changes) this.setState({ changes: 0 });
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
    return this.props.root
      ? this.renderChild(emptyContext)
      : createElement(RServiceContext.Consumer, {
          children: this.renderChild
        });
  }
}
