import * as React from 'react';
import { RServiceContext, ContextValue } from './utils';
import { Service } from './Service';
import { IServicePlugin } from './Plugin';

export interface ProviderProps {
  children: React.ReactNode;
  plugins?: IServicePlugin[];
}

export class Provider extends React.Component<ProviderProps, ContextValue> {
  state = {
    services: new Map(),
    update: <State = {}>(service: Service, prevState: State, changes: Partial<State>) => {
      this.setState(state => ({ servicesToUpdate: (state.servicesToUpdate || []).concat(service.serviceName) }));
      if (this.props.plugins) this.props.plugins.forEach(p => p.update(service, prevState, changes));
    },
    init: <State = {}>(service: Service<State>) => {
      if (this.props.plugins) this.props.plugins.forEach(p => p.init(service as any));
    }
  };

  shouldComponentUpdate(nextProps: ProviderProps, nextState: ContextValue) {
    return nextProps !== this.props || !!nextState.servicesToUpdate;
  }

  componentDidUpdate() {
    this.setState({ servicesToUpdate: undefined });
  }

  render() {
    return React.createElement(RServiceContext.Provider, { value: this.state }, this.props.children);
  }
}
