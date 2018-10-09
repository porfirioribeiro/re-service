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
});
