import * as React from 'react';
import { RServiceContext, ContextValue } from './utils';
import { Service } from './Service';
import { IServicePlugin } from './Plugin';

export interface ProviderProps {
  children: React.ReactNode;
  /**
   * You can pass a array of plugin objects that can be used to do something
   * when the service is created every time it is changed
   */
  plugins?: IServicePlugin[];
}

/**
 * Provider component is the holder of the service map.
 * It's responsible to update it's indirect child Subscribe components
 * Updating only the components that are connected to the changed Service
 */
export class Provider extends React.Component<ProviderProps, ContextValue> {
  state = {
    services: new Map(),
    changes: null,
    /**
     * Called when a service is initialized and calls all plugins `init` method
     */
    initService: <State = {}>(service: Service<State>) => {
      if (this.props.plugins) this.props.plugins.forEach(p => p.init(service as any));
    },
    /**
     * Called when a service is updated
     * Sets the `servicesToUpdate` state with the changed service and calls `update` on plugins
     */
    updateService: <State = {}>(service: Service, prevState: State, changes: Partial<State>) => {
      this.setState(state => ({ changes: (state.changes || []).concat(service) }));
      if (this.props.plugins) this.props.plugins.forEach(p => p.update(service, prevState, changes));
    },
  };

  /** Only update  */
  shouldComponentUpdate(nextProps: ProviderProps, nextState: ContextValue) {
    return nextProps !== this.props || !!nextState.changes;
  }

  componentDidUpdate() {
    // Cleanup `servicesToUpdate`
    if (this.state.changes) this.setState({ changes: null });
    //todo Probably i could probably call update on plugins here passing an array with the modified services
  }

  render() {
    return React.createElement(RServiceContext.Provider, { value: this.state }, this.props.children);
  }
}
