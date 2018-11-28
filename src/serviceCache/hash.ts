export type HashPrimitive = number | string | null | undefined;
export type HashType = HashPrimitive | HashPrimitive[] | { [key: string]: HashPrimitive }
export type HashFunction = (x: HashType) => HashPrimitive;

export const hash: HashFunction = x =>
  x === null || x === undefined
    ? '*'
    : typeof x === 'object'
      ? (Array.isArray(x)
          ? x.map(hash)
          : Object.keys(x)
              .sort()
              .map(k => `${k}:${hash(x[k])}`)
        ).join('|')
      : x;
