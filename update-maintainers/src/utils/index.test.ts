import { assertEquals } from "../../deps.test.ts";

import { isObjectsEqual, listItems } from "./index.ts";

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
