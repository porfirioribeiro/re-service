import * as React from 'react';

import { Service, ServiceType } from './Service';
import { RServiceContext, ContextValue } from './utils';

export interface SubscribeProps {
  to: ServiceType[];
  render?: (...instances: Service[]) => React.ReactNode;
  children?: (...instances: Service[]) => React.ReactNode;
}

export interface SubscribeState {
  observedBits?: number;
}

/**
 * Subscribe component acts as a connection to the Provider services
 * It will look for services specified on `to` in the Provider and create them if they don't exist
 */
export class Subscribe extends React.Component<SubscribeProps, SubscribeState> {
  instances: Service<any>[] = [];
  needsUpdate = true;
  lastNode: React.ReactNode = null;
  state: SubscribeState = {};
  /**
   * React 16.3 context has children as a function
   * This function is called with the current
   */
  renderChild = ({ services, initService, updateService, getBitMaskForServices }: ContextValue) => {
    //check if `to` changed and create instances if needed
    if (this.needsUpdate) {
      this.instances = this.props.to.map(serviceType => {
        let instance = services.get(serviceType);
        if (!instance) {
          instance = Service.create(serviceType, initService);
          services.set(serviceType, instance);
        }
        instance.onServiceUpdate = updateService;
        return instance;
      });
      // Calculate the bits we want to observe so this component will only be updated when the subscribed services update
      this.setState({ observedBits: getBitMaskForServices(this.instances) });
      /**
       * We cache last rendered node, at the first render this will be null
       * We only want to actually render the children after we assign observedBits to the Consumer
       */
      return this.lastNode;
    }

    return (this.lastNode = this.props.render
      ? this.props.render(...this.instances)
      : typeof this.props.children === 'function'
        ? this.props.children(...this.instances)
        : this.props.children);
  };

  /**
   * Only re-render this component if `to` changed or if we are in setting observedBits phase.
   */
  shouldComponentUpdate(nextProps: SubscribeProps, nextState: SubscribeState) {
    return (
      (this.needsUpdate =
        !this.props.to ||
        this.props.to.length !== nextProps.to.length ||
        nextProps.to.some((s, i) => s !== this.props.to![i])) || nextState !== this.state
    );
  }

  render() {
    return React.createElement(RServiceContext.Consumer, {
      unstable_observedBits: this.state.observedBits,
      children: this.renderChild
    });
  }
}
