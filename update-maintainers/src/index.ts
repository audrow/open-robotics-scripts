import {
  cac,
  clone,
  exists,
  join,
  parse as yamlParse,
  stringify as yamlStringify,
} from "../deps.ts";

import { getRepo, getRepoParts, listItems } from "./utils/index.ts";
import { updateMaintainers } from "./maintainer-files/index.ts";
import type { UpdateError } from "./maintainer-files/types.ts";
import type {
  Config,
  Maintainer,
  Options,
  Repository,
} from "./config/types.ts";
import {
  checkoutBranch,
  makeCommit,
  makePullRequest,
  pushBranch,
} from "./cli/index.ts";
import {
  getMaintainers,
  load as loadConfig,
  makeConfig,
  updateConfig,
} from "./config/index.ts";

async function main(config: Config) {
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
  for (const repo of config.repositories) {
    if (!repo.path) {
      const { orgName, repoName } = getRepoParts(repo.url);
      const dest = join(tempDir, orgName, repoName);
      await clone(repo.url, dest);
      repo.path = dest;
    }

    let maintainers: Maintainer[] = [];
    try {
      maintainers = getMaintainers(repo.maintainerIds, config.maintainers);
    } catch (error) {
      allErrors.push({ path: repo.path, error });
      continue;
    }

    maintainers.sort((a, b) => a.name.localeCompare(b.name));
    await checkoutBranch(repo.path, options.workingBranch);
    const { errors } = await updateMaintainers(repo.path, maintainers);
    allErrors.push(...errors);

    // If no errors, proceed with making a PR - only prints if in dry run mode
    if (errors.length === 0) {
      const maintainerNames = listItems(maintainers.map((m) => m.name));
      const commitMessage = `Update maintainers to ${maintainerNames}`;
      await makeCommit(repo.path, commitMessage, {
        isVerbose: options.isVerbose,
      });
      await pushBranch({
        cwd: repo.path,
        branch: options.workingBranch,
        isForce: true,
      }, { isVerbose: options.isVerbose, isDryRun: options.isDryRun });
      const repoName = getRepo(repo.url);
      try {
        await makePullRequest({
          cwd: repo.path,
          repo: repoName,
          baseBranch: repo.branch,
          title: options.pullRequestTitle,
          body: commitMessage + ".",
        }, { isVerbose: options.isVerbose, isDryRun: options.isDryRun });
      } catch (error) {
        allErrors.push({
          path: repo.path,
          error,
        });
      }
    }
  }
  if (allErrors.length > 0) {
    console.error(
      `\n${allErrors.length} errors occurred while updating maintainers.`,
    );
    console.log("Errors:");
    allErrors.forEach((error) => {
      console.error(`- ${error.error.message}`);
    });
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
    await main(config);
  });

cli.command("make-config", "Make a config file")
  .option("-o, --output <path>", "Path to output file", {
    default: "config.yaml",
  })
  .option("--maintainers-file <path>", "Path to maintainers YAML file")
  .option("--repositories-file <path>", "Path to repositories YAML file")
  .option("--dry-run", "Print the text, don't save the file")
  .action(async (options) => {
    const defaultOptions: Options = {
      isVerbose: false,
      isDryRun: true,
      isOverwrite: true,
      pullRequestTitle: "Update maintainers",
      workingBranch: "update-maintainers",
    };
    let maintainers: Maintainer[] = [];
    if (options.maintainersFile) {
      maintainers = await yamlParse(
        await Deno.readTextFile(options.maintainersFile),
      ) as Maintainer[];
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
      repositories = await yamlParse(
        await Deno.readTextFile(options.repositoriesFile),
      ) as Repository[];
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
    }
  });

cli.help();
cli.version("0.0.0");
cli.parse();
