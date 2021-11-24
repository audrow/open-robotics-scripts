import type { Repository } from "../config/types.ts";

import { getRepoParts } from "../utils/index.ts";

import { clone, join } from "../../deps.ts";

export async function makePR(args: {
  path: string;
  repoName: string;
  commitMessage: string;
  prTitle: string;
  prBody: string;
  workingBranch: string;
  baseBranch: string;
  isVerbose: boolean;
  isDryRun: boolean;
}) {
  await makeCommit(args.path, args.commitMessage, {
    isVerbose: args.isVerbose,
  });
  await pushBranch({
    cwd: args.path,
    branch: args.workingBranch,
    isForce: true,
  }, { isVerbose: args.isVerbose, isDryRun: args.isDryRun });

  await makePullRequest({
    cwd: args.path,
    repo: args.repoName,
    baseBranch: args.baseBranch,
    title: args.prTitle,
    body: args.prBody,
  }, { isVerbose: args.isVerbose, isDryRun: args.isDryRun });
}

export async function cloneRepoIfNoPath(repos: Repository[], baseDir: string) {
  for (const repo of repos) {
    if (!repo.path) {
      const { orgName, repoName } = getRepoParts(repo.url);
      const dest = join(baseDir, orgName, repoName);
      await clone(repo.url, dest);
      repo.path = dest;
      await checkoutBranch(repo.path!, repo.branch, false);
    }
  }
  return repos;
}

export async function checkoutBranch(
  cwd: string,
  branch: string,
  isNewBranch = false,
  options: CommandOptions = {},
) {
  if (isNewBranch) {
    await runCommand(cwd, ["git", "checkout", "-b", branch], options);
  } else {
    await runCommand(cwd, ["git", "checkout", branch], options);
  }
}

export async function makeCommit(
  cwd: string,
  commitMessage: string,
  options: CommandOptions = {},
) {
  await runCommand(cwd, ["git", "commit", "-asm", commitMessage], options);
}

export async function pushBranch(
  args: { cwd: string; branch: string; isForce: boolean },
  options: CommandOptions = {},
) {
  const command = ["git", "push", "origin", args.branch];
  if (args.isForce) {
    command.push("--force-with-lease");
  }
  await runCommand(args.cwd, command, options);
}

export async function makePullRequest(
  args: {
    cwd: string;
    repo: string;
    baseBranch: string;
    title: string;
    body: string;
  },
  options: CommandOptions = {},
) {
  const command = [
    "gh",
    "pr",
    "create",
    "--base",
    args.baseBranch,
    "--repo",
    args.repo,
    "--title",
    args.title,
    "--body",
    args.body,
  ];
  await runCommand(args.cwd, command, options);
}

type CommandOptions = {
  isDryRun?: boolean;
  isVerbose?: boolean;
};

async function runCommand(
  cwd: string,
  command: string[],
  options: CommandOptions = {},
) {
  if (options.isDryRun) {
    console.log(
      `Would run the following command from ${cwd}: ${command.join(" ")}`,
    );
  } else {
    if (options.isVerbose) {
      console.log(`Running command from ${cwd}: ${command.join(" ")}`);
    }
    const cmd = Deno.run({
      cmd: command,
      cwd,
      stdout: options.isVerbose ? "inherit" : "null",
      stdin: options.isVerbose ? "inherit" : "null",
    });
    const status = await cmd.status();
    if (!status.success) {
      throw new Error(
        `Command failed to run in '${cwd}': '${command.join(" ")}'`,
      );
    }
  }
}
