import { clone } from "https://deno.land/x/clone@v1.0.6/mod.ts";
import { join } from "https://deno.land/std@0.114.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.114.0/fs/walk.ts";

import { getMaintainers, setMaintainers } from "./maintainer-files/index.ts";
import { maintainer } from "./maintainer-files/types.ts";

type repo = {
  url: string;
  maintainers: maintainer[];
  branch: string;
  path?: string;
};

const audrow: maintainer = {
  name: "Audrow Nash",
  email: "audrow@openrobotics.org",
};
// const michelley: maintainer = {
//   name: "Michelley Chen",
//   email: "michelley@kimo.com",
// };
// const aditya = {
//   name: "Aditya Pande",
//   email: "aditya.pande@openrobotics.org",
// };
// const michael = {
//   name: "Michael Jeronimo",
//   email: "michael.jeronimo@openrobotics.org",
// };

const repos: repo[] = [
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

async function cloneRepo(url: string, baseDir = "temp") {
  const match = url.match(/github.com\/(.*)\/(.*)/);
  if (!match) {
    throw new Error("Could not parse repo url");
  }
  const org = match[1];
  const repoName = match[2];
  const dest = join(baseDir, org, repoName);
  await clone(url, dest);
  return dest;
}

async function getPathsToFiles(path: string, match: RegExp[]) {
  const paths: string[] = [];
  for await (
    const entry of walk(path, { match: match })
  ) {
    paths.push(entry.path);
  }
  return paths;
}

function isObjectsEqual(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

type UpdateError = {
  path: string;
  error: Error;
};

async function updateMaintainers(repo: repo) {
  if (!repo.path) {
    throw new Error("Repo path not set");
  }
  const paths = await getPathsToFiles(repo.path, [/package.xml/, /setup.py/]);
  const updateErrors: UpdateError[] = [];
  paths.forEach(async (path) => {
    try {
      const fileText = await Deno.readTextFile(path);
      const currentMaintainers = getMaintainers(path, fileText);
      if (!isObjectsEqual(currentMaintainers, repo.maintainers)) {
        const newFileText = setMaintainers(path, fileText, repo.maintainers);
        await Deno.writeTextFile(path, newFileText);
      }
    } catch (error) {
      updateErrors.push({ path, error });
    }
  });
  return { errors: updateErrors };
}

function listItems(items: string[]) {
  if (items.length === 0) {
    return "";
  } else if (items.length === 1) {
    return items[0];
  } else if (items.length === 2) {
    return items.join(" and ");
  } else {
    return items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];
  }
}

async function makeCommit(path: string, maintainers: maintainer[]) {
  const maintainerNames = listItems(maintainers.map((m) => m.name));
  const commitMessage = `Update maintainers to ${maintainerNames}`;

  await sequentialCommandRunner(path, [
    ["git", "add", "."],
    ["git", "commit", "-sm", commitMessage],
  ]);
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

async function checkoutBranch(cwd: string, branch: string) {
  await commandRunner(cwd, ["git", "checkout", "-b", branch]);
}

const tempDir = "temp";
// await Deno.remove(tempDir, { recursive: true });
const allErrors: UpdateError[] = [];
for (const repo of repos) {
  if (!repo.path) {
    repo.path = await cloneRepo(repo.url, tempDir);
  }
  await checkoutBranch(repo.path, "update-maintainers");
  const { errors } = await updateMaintainers(repo);
  allErrors.push(...errors);
  // if (errors.length === 0) {
  await makeCommit(repo.path, repo.maintainers);
  await sequentialCommandRunner(repo.path, [
    ["git", "push", "origin", "update-maintainers", "--force"],
    [
      "gh",
      "pr",
      "create",
      "--base",
      "master",
      "--repo",
      "audrow/ros2cli",
      "--title",
      "Update maintainers",
      "--body",
      "See the output of the command.",
    ],
  ]);
  // }
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
