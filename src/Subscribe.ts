import * as React from 'react';

import { Service, ServiceType, getBitMaskForServices, createService } from './Service';
import { RServiceContext, ContextValue } from './utils';

export interface SubscribeProps {
  to: ServiceType[];
  render?: (...instances: Service[]) => React.ReactNode;
  children?: (...instances: Service[]) => React.ReactNode;
}

export class Subscribe extends React.PureComponent<SubscribeProps> {
  instances: Service<any>[] = [];
  prevTo?: ServiceType[];
  renderChild = ({ services, init, update }: ContextValue) => {
    //check if `to` changed and create instances if needed
    if (this.props.to !== this.prevTo) {
      this.prevTo = this.props.to;
      this.instances = this.props.to.map(serviceType => {
        let instance = services.get(serviceType);
        if (!instance) {
          instance = createService(serviceType, init);
          services.set(serviceType, instance);
        }
        instance.update = update;
        return instance;
      });
    }

    return this.props.render
      ? this.props.render(...this.instances)
      : typeof this.props.children === 'function'
        ? this.props.children(...this.instances)
        : this.props.children || null;
  };

  render() {
    return React.createElement(RServiceContext.Consumer, {
      unstable_observedBits: getBitMaskForServices(this.props.to),
      children: this.renderChild
    });
  }
}
