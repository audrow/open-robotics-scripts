import { clone } from "https://deno.land/x/clone@v1.0.6/mod.ts";
import { join } from "https://deno.land/std@0.114.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.114.0/fs/walk.ts";

const SETUP_PY_MAINTAINER_REGEX =
  /(\s*maintainer=')(?:.*)(',\s+maintainer_email=')(?:.*)(')/;

type maintainer = {
  name: string;
  email: string;
};
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
const michelley: maintainer = {
  name: "Michelley Chen",
  email: "michelley@kimo.com",
};
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
  let paths: string[] = [];
  for await (
    const entry of walk(path, { match: match })
  ) {
    paths.push(entry.path);
  }
  return paths;
}

async function getPackageXmlMaintainers(path: string) {
  const fileText = await Deno.readTextFile(path);
  const matches = [
    ...fileText.matchAll(/<maintainer email="(.*)">(.*)<\/maintainer>/g),
  ];
  if (!matches) {
    throw new Error(`Could not find maintainers in package.xml: ${path}`);
  }
  return matches.map((match) => {
    return {
      name: match[2],
      email: match[1],
    } as maintainer;
  });
}

async function setPackageXmlMaintainers(
  path: string,
  maintainers: maintainer[],
) {
  const maintainerRegex =
    /( *)(?:<maintainer email="(?:.*)">(?:.*)<\/maintainer>\s*)+/;
  const fileText = await Deno.readTextFile(path);
  const match = fileText.match(maintainerRegex);
  if (!match) {
    throw new Error(`Could not find maintainers in package.xml: ${path}`);
  }
  const indent = match[1];
  let replaceString = "";
  maintainers.forEach((maintainer) => {
    replaceString +=
      `${indent}<maintainer email="${maintainer.email}">${maintainer.name}</maintainer>\n`;
  });
  replaceString += indent;
  const newFileText = fileText.replace(maintainerRegex, replaceString);
  await Deno.writeTextFile(path, newFileText);
}

async function getSetupPyMaintainers(path: string) {
  const fileText = await Deno.readTextFile(path);
  const nameMatches = fileText.match(/maintainer=["|'](.*)["|']/);
  if (!nameMatches) {
    throw new Error(`Could not find maintainer in setup.py: ${path}`);
  }
  const emailMatches = fileText.match(/maintainer_email=["|'](.*)["|']/);
  if (!emailMatches) {
    throw new Error(`Could not find maintainer email in setup.py: ${path}`);
  }
  const names = nameMatches[1].split(",").map((name) => name.trim());
  const emails = emailMatches[1].split(",").map((email) => email.trim());
  if (names.length !== emails.length) {
    throw new Error(
      `Number of maintainer names does not match number of emails: ${path}`,
    );
  }
  let out: maintainer[] = [];
  for (let i = 0; i < names.length; i++) {
    out.push({
      name: names[i],
      email: emails[i],
    });
  }
  return out;
}

async function setSetupPyMaintainers(
  path: string,
  maintainers: maintainer[],
) {
  const fileText = await Deno.readTextFile(path);

  // Build replacement maintainer name string
  const maintainerNameRegex = /( *)maintainer=(?:.*),\n/;
  const nameMatch = fileText.match(maintainerNameRegex);
  if (!nameMatch) {
    throw new Error(`Could not find maintainer in setup.py: ${path}`);
  }
  const nameIndent = nameMatch[1];
  const replaceNameString =
    `${nameIndent}maintainer='${maintainers.map((m) => m.name).join(", ")}` +
    "',\n";

  // Build replacement maintainer email string
  const maintainerEmailRegex = /( *)maintainer_email=(?:.*),\n/;
  const emailMatch = fileText.match(maintainerEmailRegex);
  if (!emailMatch) {
    throw new Error(`Could not find maintainer email in setup.py: ${path}`);
  }
  const emailIndent = emailMatch[1];
  const replaceEmailString =
    `${emailIndent}maintainer_email='${
      maintainers.map((m) => m.email).join(", ")
    }` + "',\n";

  // Replace maintainer
  const newFileText = fileText.replace(maintainerNameRegex, replaceNameString)
    .replace(maintainerEmailRegex, replaceEmailString);
  await Deno.writeTextFile(path, newFileText);
}

function isObjectsEqual(obj1: Object, obj2: Object) {
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
  let updateErrors: UpdateError[] = [];
  paths.forEach(async (path) => {
    try {
      const currentMaintainers = await getMaintainers(path);
      if (!isObjectsEqual(currentMaintainers, repo.maintainers)) {
        setMaintainers(path, repo.maintainers);
      }
    } catch (error) {
      updateErrors.push({ path, error });
    }
  });
  return { errors: updateErrors };
}

async function getMaintainers(path: string) {
  if (path.endsWith("setup.py")) {
    return await getSetupPyMaintainers(path);
  } else if (path.endsWith("package.xml")) {
    return await getPackageXmlMaintainers(path);
  } else {
    throw new Error(`Unknown file type: ${path}`);
  }
}

async function setMaintainers(path: string, maintainers: maintainer[]) {
  if (path.endsWith("setup.py")) {
    return await setSetupPyMaintainers(path, maintainers);
  } else if (path.endsWith("package.xml")) {
    return await setPackageXmlMaintainers(path, maintainers);
  } else {
    throw new Error(`Unknown file type: ${path}`);
  }
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
