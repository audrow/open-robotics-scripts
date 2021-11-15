import { clone } from "https://deno.land/x/clone@v1.0.6/mod.ts";
import { join, walk } from "../deps.ts";

import { listItems } from "./utils/index.ts";
import { getMaintainers, setMaintainers } from "./maintainer-files/index.ts";
import { maintainer } from "./maintainer-files/types.ts";
import {
  checkoutBranch,
  makeCommit,
  makePullRequest,
  pushBranch,
} from "./cli/index.ts";

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
const aditya = {
  name: "Aditya Pande",
  email: "aditya.pande@openrobotics.org",
};
const michael = {
  name: "Michael Jeronimo",
  email: "michael.jeronimo@openrobotics.org",
};

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
  // deno-lint-ignore no-explicit-any
  obj1: Record<string, any>,
  // deno-lint-ignore no-explicit-any
  obj2: Record<string, any>,
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

async function main() {
  const tempDir = await Deno.makeTempDir();
  const workingBranch = "update-maintainers";
  const allErrors: UpdateError[] = [];
  for (const repo of repos) {
    if (!repo.path) {
      repo.path = await cloneRepo(repo.url, tempDir);
    }
    await checkoutBranch(repo.path, workingBranch);
    const { errors } = await updateMaintainers(repo);
    allErrors.push(...errors);
    // if (errors.length === 0) {
    const maintainerNames = listItems(repo.maintainers.map((m) => m.name));
    const commitMessage = `Update maintainers to ${maintainerNames}`;
    await makeCommit(repo.path, commitMessage);
    await pushBranch(repo.path, workingBranch, true);
    await makePullRequest(
      repo.path,
      "audrow/ros2cli",
      repo.branch,
      "Update maintainers",
      commitMessage + ".",
    );
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
  await Deno.remove(tempDir, { recursive: true });
}

await main();
