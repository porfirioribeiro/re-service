import { HashFunction, HashPrimitive, hash as defaultHash } from './hash';
export { hash } from './hash';

type ReadFN<K, V> = (key: K) => V;
type FetchFn<K, V> = (key: K) => PromiseLike<V>;
type StoreFn<K, V> = (value: V, key: K) => void;

export interface CreateCacheOptions {
  hash?: HashFunction;
  cacheFirst?: boolean;
}

export const Empty = 0;
export const Pending = 1;
export const Resolved = 2;
export const Rejected = 3;

export type LoadState = typeof Empty | typeof Pending | typeof Resolved | typeof Rejected;

export interface ResourceType<V> {
  state: LoadState;
  promise?: PromiseLike<V>;
  error?: Error;
}

export type CacheType<K, V> = K extends null | undefined
  ? {
      read(key?: K): V;
      load(key?: K): PromiseLike<V>;
      invalidate(): void;
    }
  : {
      read(key: K): V;
      load(key: K): PromiseLike<V>;
      invalidate(): void;
    };

export const createCache = <K extends HashPrimitive, V>(
  read: ReadFN<K, V>,
  fetch: FetchFn<K, V>,
  store: StoreFn<K, V>,
  o: CreateCacheOptions = {}
) => {
  const { hash = defaultHash } = o;
  const resourceMap = new Map<HashPrimitive, ResourceType<V>>();
  return {
    read(key: K) {
      const hashedKey = hash(key);
      let resource = resourceMap.get(hashedKey);
      let promise: PromiseLike<V> | undefined = undefined;
      let value = undefined;
      if (!resource) {
        if (o.cacheFirst) {
          value = read(key);
          if (value) {
            resourceMap.set(hashedKey, { state: Resolved });
            return value;
          }
        }
        promise = (this as CacheType<any, V>).load(key);
        resourceMap.set(hashedKey, { state: Pending, promise });
        throw promise;
      } else {
        if (resource.state === Resolved) return read(key);
        if (resource.state === Rejected) throw resource.error;
        throw resource.promise;
      }
    },
    load(key: K) {
      const hashedKey = hash(key);
      const promise = fetch(key);
      resourceMap.set(hashedKey, { state: Pending, promise });
      promise.then(
        data => {
          resourceMap.set(hashedKey, { state: Resolved });
          store(data, key);
          return data;
        },
        error => resourceMap.set(hashedKey, { state: Rejected, error })
      ) as PromiseLike<V>;
      return promise;
    },
    invalidate() {
      resourceMap.clear();
    }
  } as CacheType<K, V>;
};
