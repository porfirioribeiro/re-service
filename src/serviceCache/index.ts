import { HashFunction, HashPrimitive, hash as defaultHash } from './hash';
export { hash } from './hash';

type ReadFN<K, V> = (key: K) => V;
type FetchFn<K, V> = (key: K) => PromiseLike<V>;
type StoreFn<K, V> = (value: V, key: K) => void;

interface ReadObject<V> {
  value?: V;
  loading?: boolean;
  error?: boolean;
  promise?: PromiseLike<V>;
}

interface CreateCacheOptions {
  hash?: HashFunction;
  cacheFirst?: boolean;
}

const Empty = 0;
const Pending = 1;
const Resolved = 2;
const Rejected = 3;

type LoadState = typeof Empty | typeof Pending | typeof Resolved | typeof Rejected;

type CacheType<K, V> = K extends null | undefined
  ? {
      read(key?: K): ReadObject<V>;
      load(key?: K): PromiseLike<V>;
      invalidate(): void;
    }
  : {
      read(key: K): ReadObject<V>;
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
  const resourceMap = new Map<HashPrimitive, LoadState>();
  return {
    read(key: K) {
      const hashedKey = hash(key);
      let resource = resourceMap.get(hashedKey);
      let promise: PromiseLike<V> | undefined = undefined;
      let value = undefined;
      if (!resource) {
        if (o.cacheFirst) {
          value = read(key);
          if (value) resourceMap.set(hashedKey, (resource = Resolved));
        }
        if (!value) {
          promise = (this as CacheType<any, V>).load(key);
          resource = resourceMap.get(hashedKey);
        }
      } else {
        value = resource === Resolved ? read(key) : undefined;
      }
      return {
        loading: resource === Pending,
        promise,
        error: resource === Rejected,
        value
      };
    },
    load(key: K) {
      const hashedKey = hash(key);
      resourceMap.set(hashedKey, Pending);
      return fetch(key).then(
        data => {
          resourceMap.set(hashedKey, Resolved);
          store(data, key);
          return data;
        },
        () => resourceMap.set(hashedKey, Rejected)
      ) as PromiseLike<V>;
    },
    invalidate() {
      resourceMap.clear();
    }
  } as CacheType<K, V>;
};
