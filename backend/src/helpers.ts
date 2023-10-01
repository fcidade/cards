export const times = <T>(
  amount: number,
  fn: (i: number) => T,
): T[] => {
  const output: T[] = [];
  for (let i = 0; i < amount; i++) {
    output.push(fn(i));
  }
  return output;
};

// TODO: Better ID generation
export const randID = (): string =>
  Math.random().toFixed(3).toString().replace(".", "");
