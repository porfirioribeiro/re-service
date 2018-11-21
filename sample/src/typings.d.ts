
declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'dot-prop-immutable' {
  const imm: {
    get: <T = object, V = any>(object: T, path: string, defaultValue?: V) => V;
    set: <T = object>(object: T, path: string, value: any) => T;
    merge: <T = object>(object: T, path: string, value: any) => T;
    toggle: <T = object>(object: T, path: string) => T;
    delete: <T = object>(object: T, path: string) => T;
  };
  export default imm;
}
