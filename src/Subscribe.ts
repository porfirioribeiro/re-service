import { Component, createElement, ReactNode } from 'react';
import { Service, ServiceType } from './Service';
import { RServiceContext, ContextValue, getBitMaskForServices } from './utils';
import { shallowEqual } from './shallowEqual';

export interface SubscribeProps {
  to: ServiceType[];
  render?: (...instances: any[]) => ReactNode;
  children?: (...instances: any[]) => ReactNode;
  pure?: boolean;
  pureProp?: any;
}

export interface SubscribeState {
  observedBits?: number;
}

/**
 * Subscribe component acts as a connection to the Provider services
 * It will look for services specified on `to` in the Provider and create them if they don't exist
 */
export class Subscribe extends Component<SubscribeProps, SubscribeState> {
  static displayName = 'RCSubscribe';
  static defaultProps = { pure: true };
  instances: Service<any>[] = [];
  needsUpdate = true;
  state: SubscribeState = {};
  observedBits?: number;
  /**
   * React 16.3 context has children as a function
   * This function is called with the current
   */
  renderChild = (ctx: ContextValue): ReactNode => {
    //check if `to` changed and create instances if needed
    if (this.needsUpdate) {
      this.instances = ctx.getInstances(this.props.to);
      // Calculate the bits we want to observe so this component will only be updated when the subscribed services update
      this.observedBits = getBitMaskForServices(this.props.to);
    }

    return this.props.render
      ? this.props.render(...(this.instances as any))
      : typeof this.props.children === 'function'
      ? this.props.children(...(this.instances as any))
      : this.props.children;
  };

  /**
   * Only re-render this component if `to` changed or if we are in setting observedBits phase.
   */
  shouldComponentUpdate(nextProps: SubscribeProps, nextState: SubscribeState) {
    this.needsUpdate =
      !this.props.to ||
      this.props.to.length !== nextProps.to.length ||
      nextProps.to.some((s, i) => s !== this.props.to[i]);
    return nextProps.pure && shallowEqual(this.props.pureProp, nextProps.pureProp)
      ? this.needsUpdate || nextState !== this.state
      : true;
  }

  componentDidMount() {
    if (this.observedBits) this.setState({ observedBits: this.observedBits });
  }

  componentDidUpdate() {
    if (this.observedBits !== this.state.observedBits) this.setState({ observedBits: this.observedBits });
  }

  render() {
    return createElement(RServiceContext.Consumer, {
      unstable_observedBits: this.state.observedBits,
      children: this.renderChild
    });
  }
}
