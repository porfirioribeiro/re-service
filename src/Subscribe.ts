import * as React from 'react';

import { Service, ServiceType } from './Service';
import { RServiceContext, ContextValue, getBitMaskForServiceTypes } from './utils';

export interface SubscribeProps {
  to: ServiceType[];
  render?: (...instances: Service[]) => React.ReactNode;
  children?: (...instances: Service[]) => React.ReactNode;
}

/**
 * Subscribe component acts as a connection to the Provider services
 * It will look for services specified on `to` in the Provider and create them if they don't exist
 */
export class Subscribe extends React.Component<SubscribeProps> {
  instances: Service<any>[] = [];
  needsUpdate = true;
  /**
   * React 16.3 context has children as a function
   * This function is called with the current
   */
  renderChild = ({ services, initService, updateService }: ContextValue) => {
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
    }

    return this.props.render
      ? this.props.render(...this.instances)
      : typeof this.props.children === 'function' ? this.props.children(...this.instances) : this.props.children;
  };

  shouldComponentUpdate(nextProps: SubscribeProps) {
    return (this.needsUpdate =
      !this.props.to ||
      this.props.to.length !== nextProps.to.length ||
      nextProps.to.some((s, i) => s !== this.props.to![i]));
  }

  render() {
    return React.createElement(RServiceContext.Consumer, {
      unstable_observedBits: getBitMaskForServiceTypes(this.props.to),
      children: this.renderChild
    });
  }
}
