import imm from 'dot-prop-immutable';
import memoize from 'fast-memoize';

function without<K>(array: K[], value: K): K[] {
  const index = array.indexOf(value);
  return index === -1 ? array.slice() : array.slice(0, index).concat(array.slice(index + 1));
}

function concatUniq<K>(array: K[], value: K) {
  return array.concat(array.includes(value) ? [] : [value]);
}

type KeyType = string | number;

export interface Normalized<K extends KeyType, V> {
  byId: Record<K, V>;
  list: K[];
}

/**
 * This function accepts an array and returns a normalized object with myId and list
 */
export const normalize = <K extends KeyType, V>(array: V[], idKey = 'id', map?: Function): Normalized<K, V> => ({
  byId: array.reduce((acc, item: any, index) => ({ ...acc, [item[idKey]]: map ? map(item, index) : item }), {}) as Record<K, V>,
  list: array.map((a: any) => a[idKey]),
});

/**
 * Set a value to the normalized state or add it
 */
export const normalizeSet = <K extends KeyType, V>(state: Normalized<K, V>, value: V, idKey = 'id') => ({
  byId: imm.set(state.byId, (value as any)[idKey], value),
  list: concatUniq(state.list, (value as any)[idKey]),
});

/**
 * Delete a value from this normalized state
 */
export const normalizeDelete = <K extends KeyType, V>(state: Normalized<K, V>, id: K) => ({
  byId: imm.delete(state.byId, id as string),
  list: without(state.list, id),
});

/**
 * Transforms state back to its original form
 */
export const denormalize: DenormalizeFn = memoize(state => state.list.map((id: any) => state.byId[id]));
type DenormalizeFn = <K extends KeyType, V>(state: Normalized<K, V>) => V[];

export const normalizeCreate = <K extends KeyType, V>(): Normalized<K, V> => ({ byId: {} as Record<K, V>, list: [] });
