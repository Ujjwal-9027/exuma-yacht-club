export function getOrCreatePromise<T>(
  read: () => Promise<T> | undefined,
  write: (promise: Promise<T> | undefined) => void,
  initialize: () => Promise<T>,
): Promise<T> {
  const current = read();
  if (current) return current;

  let pending: Promise<T>;
  pending = initialize().catch((error: unknown) => {
    if (read() === pending) write(undefined);
    throw error;
  });
  write(pending);
  return pending;
}