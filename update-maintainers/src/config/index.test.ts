import { Config, Maintainer, Repository } from "./types.ts";
import { makeConfig, updateConfig } from "./index.ts";
import { assertEquals } from "../../deps.test.ts";

const maintainers: Maintainer[] = [
  {
    id: "jd",
    name: "John Doe",
    email: "jd@test.com",
  },
  {
    id: "jd2",
    name: "John Doe 2",
    email: "jd2@test.com",
  },
  {
    id: "jd3",
    name: "John Doe 3",
    email: "jd3@test.com",
  },
];

const repositories: Repository[] = [
  {
    url: "www.github.com/foo/bar",
    maintainerIds: ["jd"],
    branch: "master",
  },
  {
    url: "www.github.com/foo/baz",
    maintainerIds: ["jd", "jd2"],
    branch: "master",
  },
];
Deno.test("make config", () => {
  assertEquals(
    {
      maintainers: [],
      repositories: [],
      options: {},
    } as Config,
    makeConfig({}),
    "empty config",
  );

  assertEquals(
    {
      maintainers: maintainers,
      repositories: repositories,
      options: {
        isVerbose: false,
      },
    } as Config,
    makeConfig({
      maintainers: maintainers,
      repositories: repositories,
      options: {
        isVerbose: false,
      },
    }),
    "full setup",
  );
});

Deno.test("update empty config", () => {
  const emptyConfig = makeConfig({});

  assertEquals(
    {
      maintainers: [],
      repositories: [],
      options: {},
    } as Config,
    updateConfig(emptyConfig, {}),
    "empty config",
  );

  assertEquals(
    {
      maintainers: maintainers,
      repositories: repositories,
      options: {
        isVerbose: false,
      },
    } as Config,
    updateConfig(emptyConfig, {
      maintainers: maintainers,
      repositories: repositories,
      options: {
        isVerbose: false,
      },
    }),
    "full setup",
  );
});
