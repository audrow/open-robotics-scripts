import {
  getReposWithMaintainerId,
  getReposWithOrg,
  intersectRepos,
  unionRepos,
} from "./index.ts";
import { assertEquals } from "../../deps.test.ts";
import type { Repository } from "../config/types.ts";

const R1: Repository = {
  url: "www.github.com/audrow/test-repo",
  branch: "master",
  maintainerIds: ["m1"],
  path: "test-repo",
};
const R2: Repository = {
  url: "www.github.com/audrow/test-repo2",
  branch: "master",
  maintainerIds: ["m1", "m2"],
  path: "test-repo2",
};
const R3: Repository = {
  url: "www.github.com/notaudrow/test-repo3",
  branch: "master",
  maintainerIds: ["m1", "m2", "m3"],
  path: "test-repo3",
};
const REPOS: Repository[] = [R1, R2, R3];

Deno.test("get repos with maintainer id", () => {
  assertEquals(getReposWithMaintainerId(REPOS, "m1"), REPOS);
  assertEquals(getReposWithMaintainerId(REPOS, "m2"), [R2, R3]);
  assertEquals(getReposWithMaintainerId(REPOS, "m3"), [R3]);
  assertEquals(getReposWithMaintainerId(REPOS, "??"), []);
});

Deno.test("get repos with org name", () => {
  assertEquals(getReposWithOrg(REPOS, "audrow"), [R1, R2]);
  assertEquals(getReposWithOrg(REPOS, "notaudrow"), [R3]);
});

Deno.test("union repos", () => {
  assertEquals(unionRepos(REPOS, REPOS), REPOS);
  assertEquals(unionRepos(REPOS, [R1]), REPOS);
  assertEquals(unionRepos(REPOS, []), REPOS);
  assertEquals(unionRepos([R1, R2], [R2, R3]), REPOS);
  assertEquals(unionRepos([], []), []);
});

Deno.test("intersect repos", () => {
  assertEquals(intersectRepos(REPOS, REPOS), REPOS);
  assertEquals(intersectRepos(REPOS, [R1]), [R1]);
  assertEquals(intersectRepos([R1, R2], [R2, R3]), [R2]);
  assertEquals(intersectRepos([R1], [R2, R3]), []);
  assertEquals(intersectRepos([], []), []);
});
