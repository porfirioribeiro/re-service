import * as React from 'react';

import { Service, ServiceType, getBitMaskForServices } from './Service';
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
  renderChild = ({ services, initService, updateService }: ContextValue) => {
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
      this.setState({ observedBits: getBitMaskForServices(this.instances) });
    } else {
      this.lastNode = this.props.render
        ? this.props.render(...this.instances)
        : typeof this.props.children === 'function' ? this.props.children(...this.instances) : this.props.children;
    }
    // It needs to do a 2 cycle render when the `to` changes so we keep a copy of the last rendered node, so we don't need to call render again
    return this.lastNode;
  };

  render() {
    return React.createElement(RServiceContext.Consumer, {
      unstable_observedBits: this.state.observedBits,
      children: this.renderChild
    });
  }
}
