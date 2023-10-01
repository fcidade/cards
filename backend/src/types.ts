export type Nullable<T> = T | null;
export class Result<T, E extends Error> {
  constructor(public readonly ok: T | null, public readonly err: E | null) {}
  throwOnErr(): this {
    if (this.err) throw this.err;
    return this;
  }
}
export const Ok = <T>(value: T) => new Result(value, null);
export const Err = <E extends Error>(err: E) => new Result(null, err);
