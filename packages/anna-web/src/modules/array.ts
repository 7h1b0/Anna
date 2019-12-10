export function groupBy<T>(array: T[], predicate: (el: T) => boolean): T[][] {
  return array.reduce(
    (acc: T[][], el) => {
      if (predicate(el)) {
        acc[0].push(el);
      } else {
        acc[1].push(el);
      }
      return acc;
    },
    [[], []],
  );
}
