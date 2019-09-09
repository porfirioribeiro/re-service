import { createCache } from '../src/serviceCache';
describe('serviceCache', () => {
  it('Width null key', async () => {
    let value: string;
    const defaultValue = 'Hey';
    const readFn = jest.fn(() => value);
    const fetchFn = jest.fn(() => Promise.resolve(defaultValue));
    const storeFn = jest.fn(v => (value = v));
    const cache = createCache<null, any>(readFn, fetchFn, storeFn);

    let result = cache.read();
    expect(result.loading).toBe(true);
    expect(result.value).toBeUndefined();
    expect(result.promise).toBeInstanceOf(Promise);

    expect(fetchFn).toBeCalled();

    await result.promise;

    result = cache.read();

    expect(result.loading).toBe(false);
    expect(result.value).toBe(defaultValue);
    expect(result.promise).toBeUndefined();

    expect(readFn).toBeCalled();
    expect(storeFn).toBeCalled();
  });

  it('Width id key', async () => {
    const value: Record<number, string> = {};
    const defaultValue = 'Hey';
    const readFn = jest.fn(id => value[id]);
    const fetchFn = jest.fn(() => Promise.resolve(defaultValue));
    const storeFn = jest.fn((v, id) => (value[id] = v));
    const cache = createCache<number, any>(readFn, fetchFn, storeFn);

    const id = 5;
    let result = cache.read(id);
    expect(result.loading).toBe(true);
    expect(result.value).toBeUndefined();
    expect(result.promise).toBeInstanceOf(Promise);

    expect(fetchFn).toBeCalledWith(id);

    await result.promise;

    result = cache.read(id);

    expect(result.loading).toBe(false);
    expect(result.value).toBe(defaultValue);
    expect(result.promise).toBeUndefined();

    expect(readFn).toBeCalledWith(id);
    expect(storeFn).toBeCalledWith(defaultValue, id);
  });

  it('Width object key', async () => {
    type Key = { aId: number; bId: number };
    const value: Record<string, string> = {};
    const defaultValue = 'Hey';
    const readFn = jest.fn((key: Key) => value[`${key.aId}_${key.bId}`]);
    const fetchFn = jest.fn(() => Promise.resolve(defaultValue));
    const storeFn = jest.fn((v, key: Key) => (value[`${key.aId}_${key.bId}`] = v));

    const cache = createCache<Key, any>(readFn, fetchFn, storeFn);

    const key = { aId: 5, bId: 5 };
    let result = cache.read(key);
    expect(result.loading).toBe(true);
    expect(result.value).toBeUndefined();
    expect(result.promise).toBeInstanceOf(Promise);

    expect(fetchFn).toBeCalledWith(key);

    await result.promise;

    result = cache.read(key);

    expect(result.loading).toBe(false);
    expect(result.value).toBe(defaultValue);
    expect(result.promise).toBeUndefined();

    expect(readFn).toBeCalledWith(key);
    expect(storeFn).toBeCalledWith(defaultValue, key);
  });
});
