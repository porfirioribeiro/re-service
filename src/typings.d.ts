import React, { Context } from 'react';
declare module 'react' {
  export function useContext<T>(context: Context<T>, observedBits?: number | boolean): T;
}
