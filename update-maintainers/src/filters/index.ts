import type { Repository } from "../config/types.ts";
import { getRepoParts } from "../utils/index.ts";

export function getReposWithMaintainerId(
  repos: Repository[],
  maintainerId: string,
): Repository[] {
  const out: Repository[] = [];
  for (const repo of repos) {
    if (repo.maintainerIds.includes(maintainerId)) {
      out.push(repo);
    }
  }
  return out;
}

export function getReposWithOrg(
  repos: Repository[],
  org: string,
): Repository[] {
  const out: Repository[] = [];
  for (const repo of repos) {
    if (org === getRepoParts(repo.url).orgName) {
      out.push(repo);
    }
  }
  return out;
}

export function unionRepos(
  repos: Repository[],
  repos2: Repository[],
): Repository[] {
  const out: Repository[] = [];
  for (const repo of repos) {
    out.push(repo);
  }
  for (const repo of repos2) {
    if (!out.includes(repo)) {
      out.push(repo);
    }
  }
  return out;
}

export function intersectRepos(
  repos: Repository[],
  repos2: Repository[],
): Repository[] {
  const out: Repository[] = [];
  for (const repo of repos) {
    if (repos2.includes(repo)) {
      out.push(repo);
    }
  }
  return out;
}
