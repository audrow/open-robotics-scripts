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
