import { assert, assertEquals, assertThrows } from "../../deps.test.ts";

import {
  comparePeopleByName,
  getRepo,
  getRepoParts,
  isObjectsEqual,
  isPeopleListsTheSame,
  isPersonInList,
  isSamePerson,
  listItems,
} from "./index.ts";
import type { Maintainer, Person } from "../config/types.ts";

Deno.test("list different number of items", () => {
  const testCases: { input: string[]; expected: string; comment: string }[] = [
    {
      input: [],
      expected: "",
      comment: "empty list",
    },
    {
      input: ["one"],
      expected: "one",
      comment: "one item",
    },
    {
      input: ["one", "two"],
      expected: "one and two",
      comment: "two items",
    },
    {
      input: ["one", "two", "three"],
      expected: "one, two, and three",
      comment: "three items",
    },
    {
      input: ["one", "two", "three", "four", "five"],
      expected: "one, two, three, four, and five",
      comment: "five items",
    },
  ];
  testCases.forEach((testCase) => {
    const actual = listItems(testCase.input);
    assertEquals(testCase.expected, actual, testCase.comment);
  });
});

Deno.test("compare objects", () => {
  const testCases: {
    object1: Record<string, unknown>;
    object2: Record<string, unknown>;
    expected: boolean;
    comment?: string;
  }[] = [
    {
      object1: {},
      object2: {},
      expected: true,
      comment: "empty",
    },
    {
      object1: { test: "test" },
      object2: { test: "test" },
      expected: true,
      comment: "one item",
    },
    {
      object1: {},
      object2: { test: "test" },
      expected: false,
    },
    {
      object1: { test: "test", test2: "test2" },
      object2: { test: "test" },
      expected: false,
    },
    {
      object1: { test: { test: "test" } },
      object2: { test: { test: "test" } },
      expected: true,
      comment: "one item nested",
    },
    {
      object1: { test: { test: "test" } },
      object2: { test: { test: "not test" } },
      expected: false,
      comment: "one item nested",
    },
  ];
  testCases.forEach((testCase) => {
    assertEquals(
      testCase.expected,
      isObjectsEqual(testCase.object1, testCase.object2),
      testCase.comment,
    );
  });
});

Deno.test("get repo parts", () => {
  const url = "https://github.com/audrow/ros2cli";
  assertEquals(
    { orgName: "audrow", repoName: "ros2cli" },
    getRepoParts(url),
  );
  assertEquals(
    "audrow/ros2cli",
    getRepo(url),
  );
});

Deno.test("get repo parts with .git url", () => {
  const url = "https://github.com/audrow/ros2cli.git";
  assertEquals(
    { orgName: "audrow", repoName: "ros2cli" },
    getRepoParts(url),
  );
  assertEquals(
    "audrow/ros2cli",
    getRepo(url),
  );
});

Deno.test("get repo throws on bad URL", () => {
  const url = "https://google.com";
  assertThrows(() => {
    getRepoParts(url);
  });
  assertThrows(() => {
    getRepo(url);
  });
});

const p1: Person = {
  name: "Audrow",
  email: "audrow@hey.com",
};
const p2: Person = {
  name: "Not Audrow",
  email: "notaudrow@hey.com",
};
const m1: Maintainer = {
  ...p1,
  id: "audrow",
};
const m2: Maintainer = {
  ...p2,
  id: "notaudrow",
};

Deno.test("is same person", () => {
  assert(isSamePerson(p1, p1));
  assert(isSamePerson(p1, m1));
  assert(isSamePerson(p2, p2));
  assert(isSamePerson(p2, m2));

  assert(!isSamePerson(p1, p2));
  assert(!isSamePerson(p1, p2));
  assert(!isSamePerson(p1, m2));
  assert(!isSamePerson(p2, m1));
});

Deno.test("is lists of people the same", () => {
  assert(isPeopleListsTheSame([p1, p2], [p1, p2]));
  assert(isPeopleListsTheSame([p1, p2], [p2, p1]));
  assert(isPeopleListsTheSame([p1, p2], [m1, m2]));
  assert(isPeopleListsTheSame([p1, p2], [m2, m1]));

  assert(!isPeopleListsTheSame([], [p1, p2]));
  assert(!isPeopleListsTheSame([p1], [p1, p2]));
  assert(!isPeopleListsTheSame([p1, p2], [p1, p2, p1]));
});

Deno.test("is person in list", () => {
  assert(isPersonInList(p1, [p1, p2]));
  assert(isPersonInList(p1, [p2, p1]));
  assert(isPersonInList(p1, [m1, m2]));
  assert(isPersonInList(p1, [m2, m1]));

  assert(isPersonInList(m1, [p1, p2]));
  assert(isPersonInList(m1, [p2, p1]));
  assert(isPersonInList(m1, [m1, m2]));
  assert(isPersonInList(m1, [m2, m1]));

  assert(!isPersonInList(p1, []));
  assert(!isPersonInList(p1, [p2]));
  assert(!isPersonInList(m1, [p2]));
  assert(!isPersonInList(p1, [m2]));
  assert(!isPersonInList(m1, [m2]));
});

Deno.test("compare people by names", () => {
  assertEquals(comparePeopleByName(p1, p1), 0);
  assertEquals(comparePeopleByName(p1, p2), -1);
  assertEquals(comparePeopleByName(p2, p1), 1);

  assertEquals(comparePeopleByName(m1, p1), 0);
  assertEquals(comparePeopleByName(m1, p2), -1);
  assertEquals(comparePeopleByName(p2, m1), 1);

  assertEquals(comparePeopleByName(p1, m1), 0);
  assertEquals(comparePeopleByName(p1, m2), -1);
  assertEquals(comparePeopleByName(m2, p1), 1);

  assertEquals(comparePeopleByName(m1, m1), 0);
  assertEquals(comparePeopleByName(m1, m2), -1);
  assertEquals(comparePeopleByName(m2, m1), 1);
});
