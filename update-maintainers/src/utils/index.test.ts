import { assertEquals } from "../../deps.test.ts";

import { listItems } from "./index.ts";

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
