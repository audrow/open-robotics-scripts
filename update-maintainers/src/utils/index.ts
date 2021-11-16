export function listItems(items: string[]) {
  if (items.length === 0) {
    return "";
  } else if (items.length === 1) {
    return items[0];
  } else if (items.length === 2) {
    return items.join(" and ");
  } else {
    return items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];
  }
}

export function isObjectsEqual(
  // deno-lint-ignore no-explicit-any
  obj1: Record<string, any>,
  // deno-lint-ignore no-explicit-any
  obj2: Record<string, any>,
) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
