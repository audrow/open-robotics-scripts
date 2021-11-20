import { walk } from "../../deps.ts";
import type { Maintainer, Person } from "../config/types.ts";

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
  const match = url.match(/github.com\/(.*)\/([^.]*)/);
  if (!match) {
    throw new Error(`Could not parse repo url: ${url}`);
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

export function isPeopleListsTheSame(
  l1: Person[] | Maintainer[],
  l2: Person[] | Maintainer[],
) {
  if (l1.length !== l2.length) {
    return false;
  }
  for (let i = 0; i < l1.length; i++) {
    const person = l1[i];
    if (!isPersonInList(person, l2)) {
      return false;
    }
  }
  return true;
}

export function isPersonInList(
  person: Person | Maintainer,
  people: Person[] | Maintainer[],
) {
  for (const p of people) {
    if (isSamePerson(person, p)) {
      return true;
    }
  }
  return false;
}

export function isSamePerson(p1: Person | Maintainer, p2: Person | Maintainer) {
  return p1.name === p2.name || p1.email === p2.email;
}

export function comparePeopleByName(
  a: Person | Maintainer,
  b: Person | Maintainer,
) {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }
  return 0;
}
