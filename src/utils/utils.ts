export const withTimeout = (onSuccess, onTimeout, timeout) => {
  let called = false;

  const timer = setTimeout(() => {
    if (called) return;
    called = true;
    onTimeout();
  }, timeout);

  return (...args) => {
    if (called) return;
    called = true;
    clearTimeout(timer);
    onSuccess.apply(this, args);
  };
};

export const measurePerformanceInMs = (callback: () => void): number => {
  const startTime = Date.now();
  callback();
  const endTime = Date.now();

  return endTime - startTime;
};

export const combineAndAddUsedBy = (
  entries: { name: string; usedBy: number }[],
  log = false
) => {
  const combinedEntries: Record<string, { name: string; usedBy: number }> = {};

  for (const entry of entries) {
    if (!combinedEntries[entry.name]) {
      combinedEntries[entry.name] = entry;
    } else {
      combinedEntries[entry.name] = {
        ...combinedEntries[entry.name],
        usedBy: combinedEntries[entry.name].usedBy + entry.usedBy,
      };
    }
  }

  if (log) console.log({ combinedEntries, entries });
  return Object.values(combinedEntries);
};

interface KeyExtractor<T> {
  (item: T): any;
}

export function uniqBy<T>(array: T[], keyExtractor: KeyExtractor<T>): T[] {
  const seenKeys = new Set();

  return array.filter((item) => {
    const key = keyExtractor(item);
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      return true;
    }
    return false;
  });
}

export function countBy<T>(
  collection: T[],
  keyExtractor: KeyExtractor<T>
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const item of collection) {
    const key = keyExtractor(item);
    counts[key] = (counts[key] || 0) + 1;
  }

  return counts;
}

export function sortBy<T>(collection: T[], keyExtractor: KeyExtractor<T>): T[] {
  return [...collection].sort((a, b) => {
    const keyA = keyExtractor(a);
    const keyB = keyExtractor(b);

    if (keyA < keyB) {
      return -1;
    }
    if (keyA > keyB) {
      return 1;
    }
    return 0;
  });
}
