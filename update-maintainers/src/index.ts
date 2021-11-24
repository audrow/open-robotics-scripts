import {
  cac,
  clone,
  exists,
  join,
  parse as yamlParse,
  sleep,
  stringify as yamlStringify,
} from "../deps.ts";

import {
  getPathsToFiles,
  getRepo,
  getRepoParts,
  isPeopleListsTheSame,
  listItems,
} from "./utils/index.ts";
import { getMaintainers, updateMaintainers } from "./maintainer-files/index.ts";
import type { UpdateError } from "./maintainer-files/types.ts";
import type {
  Config,
  Maintainer,
  Options,
  Repository,
} from "./config/types.ts";
import { checkoutBranch, cloneRepoIfNoPath, makePR } from "./cli/index.ts";
import {
  getMaintainersFromIds,
  load as loadConfig,
  makeConfig,
  updateConfig,
} from "./config/index.ts";

async function updateRepoMaintainers(config: Config) {
  const options = config.options;

  if (!options.pullRequestTitle) {
    throw new Error("Missing --pullRequestTitle");
  }
  if (!options.workingBranch) {
    throw new Error("Missing --workingBranch");
  }

  const tempDir = "temp";
  if (await exists(tempDir)) {
    if (options.isOverwrite) {
      await Deno.remove(tempDir, { recursive: true });
    } else {
      throw new Error("Temp directory already exists");
    }
  }

  const allErrors: UpdateError[] = [];

  const repos = await cloneRepoIfNoPath(config.repositories, tempDir);

  for (const repo of repos) {
    if (!repo.path) {
      throw new Error(`Repo ${repo.url} has no path`);
    }

    let maintainers: Maintainer[] = [];
    try {
      maintainers = getMaintainersFromIds(
        repo.maintainerIds,
        config.maintainers,
      );
    } catch (error) {
      allErrors.push({ path: repo.path, error });
      continue;
    }

    await checkoutBranch(repo.path, options.workingBranch, true);
    const { errors } = await updateMaintainers(repo.path, maintainers);
    allErrors.push(...errors);

    // If no errors, proceed with making a PR - only prints if in dry run mode
    if (errors.length === 0) {
      // sleeping seems to be necessary to let the file system catch up
      // I don't like this either
      await sleep(0.5);

      const commitMessage = `Update maintainers to ${
        listItems(maintainers.map((m) => m.name))
      }`;
      const pullRequestBody = `Update maintainers to ${
        listItems(maintainers.map((m) => `${m.name} (@${m.id})`))
      }.`;
      try {
        await makePR({
          path: repo.path,
          repoName: getRepo(repo.url),
          commitMessage: commitMessage,
          prTitle: options.pullRequestTitle,
          prBody: pullRequestBody,
          workingBranch: options.workingBranch,
          baseBranch: repo.branch,
          isVerbose: options.isVerbose || false,
          isDryRun: options.isDryRun || false,
        });
      } catch (error) {
        allErrors.push({
          path: repo.path,
          error,
        });
      }
    }
  }
  printSuccessOrErrorInfo(allErrors);
}

function printSuccessOrErrorInfo(errors: UpdateError[]) {
  if (errors.length > 0) {
    console.error(
      `\n${errors.length} errors occurred.`,
    );
    console.log("Errors:");
    errors.forEach((error) => {
      console.error(`- ${error.error.message}`);
    });
  } else {
    console.log("\nSuccess!");
  }
}

type repoStatus = Pick<Repository, "branch" | "path" | "url"> & {
  isUpToDate: boolean;
};

async function getMaintainerStatus(config: Config) {
  const options = config.options;

  const tempDir = "temp";
  if (await exists(tempDir)) {
    if (options.isOverwrite) {
      await Deno.remove(tempDir, { recursive: true });
    } else {
      throw new Error("Temp directory already exists");
    }
  }

  const repositoryStatuses: repoStatus[] = [];
  const allErrors: UpdateError[] = [];
  for (const repo of config.repositories) {
    if (!repo.path) {
      const { orgName, repoName } = getRepoParts(repo.url);
      const dest = join(tempDir, orgName, repoName);
      await clone(repo.url, dest);
      repo.path = dest;
      await checkoutBranch(repo.path, repo.branch, false);
    }

    let desiredMaintainers: Maintainer[] = [];
    try {
      desiredMaintainers = getMaintainersFromIds(
        repo.maintainerIds,
        config.maintainers,
      );
    } catch (error) {
      allErrors.push({ path: repo.path, error });
      continue;
    }

    const paths = await getPathsToFiles(repo.path, [
      /package.xml$/,
      /setup.py$/,
    ]);
    const updateErrors: UpdateError[] = [];
    let isUpToDate = true;
    for (const path of paths) {
      try {
        const fileText = await Deno.readTextFile(path);
        const currentMaintainers = getMaintainers(path, fileText);
        isUpToDate &&= isPeopleListsTheSame(
          currentMaintainers,
          desiredMaintainers,
        );
      } catch (error) {
        updateErrors.push({ path, error });
      }
    }
    repositoryStatuses.push({
      ...repo,
      isUpToDate,
    });
  }
  if (allErrors.length > 0) {
    console.error(
      `\n${allErrors.length} errors occurred while getting maintainer status.`,
    );
    console.log("Errors:");
    allErrors.forEach((error) => {
      console.error(`- ${error.error.message}`);
    });
  }
  const notUpToDateRepos = repositoryStatuses.filter((r) => !r.isUpToDate);
  if (notUpToDateRepos.length > 0) {
    console.error(
      `\n${notUpToDateRepos.length} out of ${repositoryStatuses.length} repositories are not up to date.`,
    );
    console.log("Repositories:");
    notUpToDateRepos.forEach((repo) => {
      console.log(`- ${getRepo(repo.url)}`);
    });
  } else {
    console.log(
      `All ${repositoryStatuses.length} repositories are up to date.`,
    );
  }
}

async function createConfigFile(options: {
  output: string;
  maintainersFile?: string;
  repositoriesFile?: string;
  dryRun?: boolean;
}) {
  const defaultOptions: Options = {
    isVerbose: false,
    isDryRun: false,
    isOverwrite: true,
    pullRequestTitle: "Update maintainers",
    workingBranch: "update-maintainers",
  };
  let maintainers: Maintainer[] = [];
  if (options.maintainersFile) {
    maintainers = (await yamlParse(
      await Deno.readTextFile(options.maintainersFile),
    ) as { maintainers: Maintainer[] }).maintainers;
  } else {
    maintainers = [
      {
        id: "audrow",
        name: "Audrow Nash",
        email: "audrow@openrobotics.org",
      },
      {
        id: "notaudrow",
        name: "Not Audrow",
        email: "notaudrow@openrobotics.org",
      },
    ];
  }
  let repositories: Repository[] = [];
  if (options.repositoriesFile) {
    repositories = (await yamlParse(
      await Deno.readTextFile(options.repositoriesFile),
    ) as { repositories: Repository[] }).repositories;
  } else {
    repositories = [
      {
        url: "https://github.com/audrow/ros2cli",
        branch: "master",
        maintainerIds: ["audrow", "notaudrow"],
      },
    ];
  }

  const config = makeConfig({
    options: defaultOptions,
    maintainers,
    repositories,
  });
  const configText = yamlStringify(config);
  if (options.dryRun) {
    console.log(configText);
  } else {
    await Deno.writeTextFile(options.output, configText);
    console.log(`Config file created at ${options.output}`);
  }
}

const cli = cac("update-maintainers");

cli.option("-v, --verbose", "verbose output");

cli
  .command("run", "Update the maintainers with detail from the config file")
  .option("-c, --config <path>", "Path to config file", {
    default: "config.yaml",
  })
  .option("--dry-run", "Don't push the changes or make the PR")
  .option("--overwrite", "Overwrite content in the temp dir")
  .option("--pull-request-title <title>", "Pull request title", {
    default: "Update maintainers",
  })
  .option("--temp-dir", "Path to temp dir", {
    default: "temp",
  })
  .option("--working-branch <branch>", "Branch to work on", {
    default: "update-maintainers",
  })
  .action(async (options) => {
    const readConfig = await loadConfig(options.config);
    const configOptions: Options = {
      isVerbose: options.verbose,
      isDryRun: options.dryRun,
      isOverwrite: options.overwrite,
      pullRequestTitle: options.pullRequestTitle,
      workingBranch: options.workingBranch,
    };
    const config = updateConfig(readConfig, { options: configOptions });
    await updateRepoMaintainers(config);
  });

cli
  .command("status", "Get the status of the maintainers")
  .option("-c, --config <path>", "Path to config file", {
    default: "config.yaml",
  })
  .action(async (options) => {
    const config = await loadConfig(options.config);
    await getMaintainerStatus(config);
  });

cli
  .command("make-config", "Make a config file")
  .option("-o, --output <path>", "Path to output file", {
    default: "config.yaml",
  })
  .option("--maintainers-file <path>", "Path to maintainers YAML file")
  .option("--repositories-file <path>", "Path to repositories YAML file")
  .option("--dry-run", "Print the text, don't save the file")
  .action(async (options) => {
    await createConfigFile(options);
  });

cli
  .command(
    "get-packages [maintainer]",
    "Get the packages maintained by a maintainer (use Github Id)",
  )
  .option("-c, --config <path>", "Path to config file", {
    default: "config.yaml",
  })
  .action(async (maintainer, options) => {
    const config = await loadConfig(options.config);
    if (!config.maintainers.some((m) => m.id === maintainer)) {
      console.error(`Maintainer ${maintainer} not found in config.`);
      return;
    }
    const packages: string[] = [];
    for (const repo of config.repositories) {
      if (repo.maintainerIds.includes(maintainer)) {
        packages.push(repo.url);
      }
    }
    if (packages.length === 0) {
      console.error(`No packages found for maintainer '${maintainer}'`);
    } else {
      console.log(`Packages for maintainer ${maintainer}:`);
      packages.forEach((p) => {
        console.log(`- ${getRepo(p)}\n  ${p}\n`);
      });
      console.log(`Total: ${packages.length}`);
    }
  });

cli.help();
cli.version("0.0.0");
cli.parse();
