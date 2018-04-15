import { ComponentType, ReactNode } from 'react';
import { Context } from './utils';

declare module 'react' {
  function createContext<T>(defaultValue: T, calculateChangedBits?: (prev: T, next: T) => number): Context<T>;
}
