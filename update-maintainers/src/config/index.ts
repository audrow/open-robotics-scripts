import { Config, Maintainer, Options, Repository } from "./types.ts";

import { parse } from "../../deps.ts";

export async function load(path: string) {
  return parse(await Deno.readTextFile(path)) as Config;
}

export function getMaintainers(
  maintainerIds: string[],
  maintainersList: Maintainer[],
) {
  const out: Maintainer[] = [];
  maintainerIds.forEach((id) => {
    const maintainer = maintainersList.find((m) => m.id === id);
    if (maintainer) {
      out.push(maintainer);
    } else {
      throw new Error(`Maintainer '${id}' not found`);
    }
  });
  return out;
}

type configParts = {
  options?: Options;
  maintainers?: Maintainer[];
  repositories?: Repository[];
};

export function makeConfig(parts: configParts) {
  if (!parts.options) {
    parts.options = {};
  }
  if (!parts.maintainers) {
    parts.maintainers = [];
  }
  if (!parts.repositories) {
    parts.repositories = [];
  }
  return {
    options: parts.options,
    maintainers: parts.maintainers,
    repositories: parts.repositories,
  } as Config;
}

export function updateConfig(
  config: Config,
  parts: configParts,
) {
  if (!parts.maintainers) {
    parts.maintainers = [];
  }
  if (!parts.repositories) {
    parts.repositories = [];
  }
  if (!parts.options) {
    parts.options = {};
  }
  const options: Options = {
    pullRequestTitle: parts.options.pullRequestTitle ||
      config.options.pullRequestTitle,
    workingBranch: parts.options.workingBranch || config.options.workingBranch,
    isDryRun: parts.options.isDryRun || config.options.isDryRun,
    isOverwrite: parts.options.isOverwrite || config.options.isOverwrite,
    isVerbose: parts.options.isVerbose || config.options.isVerbose,
  };
  return makeConfig({
    options: {
      ...options,
    },
    maintainers: [...config.maintainers, ...parts.maintainers],
    repositories: [...config.repositories, ...parts.repositories],
  });
}
