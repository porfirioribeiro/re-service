import { hash } from '../src/serviceCache/hash';

describe('hash', () => {
  it('Generates the right hash from primitive', () => {
    expect(hash(1)).toBe(1);
    expect(hash('string')).toBe('string');
    expect(hash(undefined)).toBe('*');
    expect(hash(null)).toBe('*');
  });

  it('Generates the right hash from array', () => {
    expect(hash([1])).toBe('1');
    expect(hash(['string'])).toBe('string');
    expect(hash(['string', 1])).toBe('string|1');
    expect(hash(['string', 1, null])).toBe('string|1|*');
  });

  it('Generates the right hash from object', () => {
    expect(hash({ id: 1 })).toBe('id:1');
    expect(hash({ name: 'string' })).toBe('name:string');
    expect(hash({ name: 'string', id: 1 })).toBe('id:1|name:string');
    expect(hash({ id: 1, name: 'string' })).toBe('id:1|name:string');
    expect(hash({ id: 1, name: 'string', empty: null })).toBe('empty:*|id:1|name:string');
    expect(hash({ id: 1, name: 'string', empty: undefined })).toBe('empty:*|id:1|name:string');
  });

  it('Generates the right hash from unordered object', () => {
    expect(hash({ entityId: 5, userId: 1 })).toBe(hash({ userId: 1, entityId: 5 }));
    expect(hash({ entityId: 5, userId: null })).toBe(hash({ userId: undefined, entityId: 5 }));
  });
});
