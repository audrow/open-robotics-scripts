import { clone, exists, join } from "../deps.ts";

import { getRepo, getRepoParts, listItems } from "./utils/index.ts";
import { updateMaintainers } from "./maintainer-files/index.ts";
import type {
  Maintainer,
  Repository,
  UpdateError,
} from "./maintainer-files/types.ts";
import {
  checkoutBranch,
  makeCommit,
  makePullRequest,
  pushBranch,
} from "./cli/index.ts";

const audrow: Maintainer = {
  name: "Audrow Nash",
  email: "audrow@openrobotics.org",
};
// const michelley: maintainer = {
//   name: "Michelley Chen",
//   email: "michelley@kimo.com",
// };
const aditya = {
  name: "Aditya Pande",
  email: "aditya.pande@openrobotics.org",
};
const michael = {
  name: "Michael Jeronimo",
  email: "michael.jeronimo@openrobotics.org",
};

const repos: Repository[] = [
  {
    url: "https://github.com/audrow/ros2cli",
    maintainers: [
      audrow,
      aditya,
      michael,
    ],
    branch: "master",
  },
  // {
  //   url: "https://github.com/ros2/demos",
  //   maintainers: [
  //     audrow,
  //     michelley,
  //   ],
  // },
];

async function main(args: {
  pullRequestTitle?: string;
  workingBranch?: string;
  isDryRun?: boolean; // avoids pushing and making the PR
  isOverwrite?: boolean; // overwrites the existing contents in the temp dir
  isVerbose?: boolean;
} = {}) {
  if (!args.pullRequestTitle) {
    args.pullRequestTitle = "Update maintainers";
  }
  if (!args.workingBranch) {
    args.workingBranch = "update-maintainers";
  }

  const tempDir = "temp";
  if (await exists(tempDir)) {
    if (args.isOverwrite) {
      await Deno.remove(tempDir, { recursive: true });
    } else {
      throw new Error("Temp directory already exists");
    }
  }
  const allErrors: UpdateError[] = [];
  for (const repo of repos) {
    if (!repo.path) {
      const { orgName, repoName } = getRepoParts(repo.url);
      const dest = join(tempDir, orgName, repoName);
      await clone(repo.url, dest);
      repo.path = dest;
    }

    repo.maintainers.sort((a, b) => a.name.localeCompare(b.name));

    await checkoutBranch(repo.path, args.workingBranch);
    const { errors } = await updateMaintainers(repo);
    allErrors.push(...errors);
    if (errors.length === 0) {
      const maintainerNames = listItems(repo.maintainers.map((m) => m.name));
      const commitMessage = `Update maintainers to ${maintainerNames}`;
      await makeCommit(repo.path, commitMessage, { isVerbose: args.isVerbose });
      await pushBranch({
        cwd: repo.path,
        branch: args.workingBranch,
        isForce: true,
      }, { isVerbose: args.isVerbose, isDryRun: args.isDryRun });
      const repoName = getRepo(repo.url);
      await makePullRequest({
        cwd: repo.path,
        repo: repoName,
        baseBranch: repo.branch,
        title: args.pullRequestTitle,
        body: commitMessage + ".",
      }, { isVerbose: args.isVerbose, isDryRun: args.isDryRun });
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

await main({ isOverwrite: true, isDryRun: false, isVerbose: false });
