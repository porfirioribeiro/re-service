import { ReactNode, useMemo } from 'react';
import { ServiceType } from './Service';
import { useServices } from './hook';

export interface SubscribeProps {
  to: ServiceType[];
  render: (...instances: any[]) => ReactNode;
  pure?: boolean;
  pureProp?: any;
}

/**
 * Subscribe to many services.
 * Use `useService` hook instead of this as it allows better options
 * @deprecated
 */
export function Subscribe({ to, render, pure, pureProp }: SubscribeProps) {
  const instances = useServices(to);
  const renderIt = () => render(...(instances as any));
  return (pure ? useMemo(renderIt, [pureProp, to]) : renderIt()) as any;
}
