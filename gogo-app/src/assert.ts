export function assertNever(value: never, noThrow?: boolean): never {
  if (noThrow) {
    return value;
  }

  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
}

class AssertionError extends Error {}

export function assert(
  cond: boolean,
  message: string,
  noThrow?: boolean,
): void {
  if (!cond) {
    const err = new AssertionError(message);
    if (noThrow) {
      console.error(err);
    }
    throw err;
  }
}
