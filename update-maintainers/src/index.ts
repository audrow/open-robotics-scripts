import { clone, exists, join } from "../deps.ts";

import { getRepo, getRepoParts, listItems } from "./utils/index.ts";
import { updateMaintainers } from "./maintainer-files/index.ts";
import type { UpdateError } from "./maintainer-files/types.ts";
import type { Config } from "./config/types.ts";
import {
  checkoutBranch,
  makeCommit,
  makePullRequest,
  pushBranch,
} from "./cli/index.ts";
import { getMaintainers, load as loadConfig } from "./config/index.ts";

async function main(config: Config) {
  const options = config.options;
  if (!options.pullRequestTitle) {
    options.pullRequestTitle = "Update maintainers";
  }
  if (!options.workingBranch) {
    options.workingBranch = "update-maintainers";
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

    const maintainers = getMaintainers(repo.maintainerIds, config.maintainers);
    maintainers.sort((a, b) => a.name.localeCompare(b.name));

    await checkoutBranch(repo.path, options.workingBranch);
    const { errors } = await updateMaintainers(repo.path, maintainers);
    allErrors.push(...errors);
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
      await makePullRequest({
        cwd: repo.path,
        repo: repoName,
        baseBranch: repo.branch,
        title: options.pullRequestTitle,
        body: commitMessage + ".",
      }, { isVerbose: options.isVerbose, isDryRun: options.isDryRun });
    }
  }
  if (allErrors.length > 0) {
    console.error(
      `\n${allErrors.length} errors occurred while updating maintainers.`,
    );
    console.log("Errors");
    allErrors.forEach((error) => {
      console.error(`- ${error.error.message}`);
    });
  }
}

const config = await loadConfig("config.yaml");
await main(config);
