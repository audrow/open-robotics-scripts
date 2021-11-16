import { walk } from "../../deps.ts";

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

export function getRepoParts(url: string) {
  const match = url.match(/github.com\/(.*)\/(.*)/);
  if (!match) {
    throw new Error("Could not parse repo url");
  }
  const orgName = match[1];
  const repoName = match[2];
  return { orgName, repoName };
}

export function getRepo(url: string) {
  const { orgName, repoName } = getRepoParts(url);
  return `${orgName}/${repoName}`;
}

export async function getPathsToFiles(path: string, match: RegExp[]) {
  const paths: string[] = [];
  for await (
    const entry of walk(path, { match: match })
  ) {
    paths.push(entry.path);
  }
  return paths;
}
