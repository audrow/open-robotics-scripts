export async function checkoutBranch(cwd: string, branch: string) {
  await commandRunner(cwd, ["git", "checkout", "-b", branch]);
}

export async function makeCommit(cwd: string, commitMessage: string) {
  await sequentialCommandRunner(cwd, [
    ["git", "add", "."],
    ["git", "commit", "-sm", commitMessage],
  ]);
}

export async function pushBranch(cwd: string, branch: string, force: boolean) {
  const command = ["git", "push", "origin", branch];
  if (force) {
    command.push("--force");
  }
  await commandRunner(cwd, command);
}

export async function makePullRequest(
  cwd: string,
  repo: string,
  baseBranch: string,
  title: string,
  body: string,
) {
  const command = [
    "gh",
    "pr",
    "create",
    "--base",
    baseBranch,
    "--repo",
    repo,
    "--title",
    title,
    "--body",
    `${body}`,
  ];
  await commandRunner(cwd, command);
}

async function commandRunner(cwd: string, command: string[]) {
  const cmd = Deno.run({
    cmd: command,
    cwd,
    stdout: "null",
    stdin: "null",
  });
  const status = await cmd.status();
  if (!status.success) {
    throw new Error(`Command failed: '${command.join(" ")}'`);
  }
}

async function sequentialCommandRunner(cwd: string, commands: string[][]) {
  for (const command of commands) {
    await commandRunner(cwd, command);
  }
}
