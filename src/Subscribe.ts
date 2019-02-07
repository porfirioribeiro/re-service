import { ReactNode, useMemo } from 'react';
import { ServiceType } from './Service';
import { useServices } from './hook';

export interface SubscribeProps {
  to: ServiceType[];
  render: (...instances: any[]) => ReactNode;
  pure?: boolean;
  pureProp?: any;
}

export function Subscribe({ to, render, pure, pureProp }: SubscribeProps) {
  const instances = useServices(to);
  const renderIt = () => render(...(instances as any));
  return (pure ? useMemo(renderIt, [pureProp, to]) : renderIt()) as any;
}
