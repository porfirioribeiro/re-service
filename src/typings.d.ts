import React, { Context } from 'react';
declare module 'react' {
  export function useState<T = any>(value: T): [T, (value: T) => void];
  export function useContext<T = any>(context: Context<T>, observedBits?: number): T;
}
