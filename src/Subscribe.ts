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
export class Subscribe extends React.PureComponent<SubscribeProps, SubscribeState> {
  instances: Service<any>[] = [];
  prevTo?: ServiceType[];
  lastNode: React.ReactNode = null;
  state = {
    observedBits: 0
  };
  /**
   * React 16.3 context has children as a function
   * This function is called with the current
   */
  renderChild = ({ services, initService, updateService, getBitMaskForServices }: ContextValue) => {
    //check if `to` changed and create instances if needed
    if (this.props.to !== this.prevTo) {
      this.prevTo = this.props.to;
      this.instances = this.props.to.map(serviceType => {
        let instance = services.get(serviceType);
        if (!instance) {
          instance = Service.create(serviceType, initService);
          services.set(serviceType, instance);
        }
        instance.onServiceUpdate = updateService;
        return instance;
      });
      /**
       * As we are mapping the services bitmask with the instance we need access to the instances,
       * And it can only be done after render so we will re-render again the Consumer now with the bits
       */
      this.setState({ observedBits: getBitMaskForServices(this.instances) });
      return this.lastNode;
    }
    return (this.lastNode = this.props.render
      ? this.props.render(...this.instances)
      : typeof this.props.children === 'function' ? this.props.children(...this.instances) : this.props.children);
  };

  render() {
    return React.createElement(RServiceContext.Consumer, {
      unstable_observedBits: this.state.observedBits,
      children: this.renderChild
    });
  }
}
