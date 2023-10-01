export const logfy = (name: string) => (...msg: any[]) =>
  console.log(`[${name}]`, ...msg);
