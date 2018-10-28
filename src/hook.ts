import { useContext } from 'react';
import { RServiceContext, getBitMaskForServices } from './utils';
import { Service, ServiceType } from './Service';

export function useService<St, Se extends Service<St>>(service: ServiceType<St, Se>): Se {
  return useContext(RServiceContext, getBitMaskForServices([service])).getInstances([service])[0] as any;
}

export function useServices<T0 extends Service>(bT0: ServiceType<{}, T0>): [T0];
export function useServices<T0 extends Service, T1 extends Service>(
  bT0: ServiceType<{}, T0>,
  bT1: ServiceType<{}, T1>
): [T0, T1];
export function useServices<T0 extends Service, T1 extends Service, T2 extends Service>(
  bT0: ServiceType<{}, T0>,
  bT1: ServiceType<{}, T1>,
  bT2: ServiceType<{}, T2>
): [T0, T1, T2];
export function useServices<T0 extends Service, T1 extends Service, T2 extends Service, T3 extends Service>(
  bT0: ServiceType<{}, T0>,
  bT1: ServiceType<{}, T1>,
  bT2: ServiceType<{}, T2>,
  bT3: ServiceType<{}, T3>
): [T0, T1, T2, T3];
export function useServices<St, T extends Service<St>>(...services: ServiceType<St, T>[]): Service[] {
  return useContext(RServiceContext, getBitMaskForServices(services)).getInstances(services);
}
