import { getSetupPyMaintainers, setSetupPyMaintainers } from "./setupPy.ts";
import {
  getPackageXmlMaintainers,
  setPackageXmlMaintainers,
} from "./packageXml.ts";
import { getPathsToFiles, isObjectsEqual } from "../utils/index.ts";

import type { Maintainer, Repository, UpdateError } from "./types.ts";

export async function updateMaintainers(repo: Repository) {
  if (!repo.path) {
    throw new Error("Repo path not set");
  }
  const paths = await getPathsToFiles(repo.path, [/package.xml$/, /setup.py$/]);
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

export function getMaintainers(path: string, text: string) {
  if (path.endsWith("setup.py")) {
    return getSetupPyMaintainers(path, text);
  } else if (path.endsWith("package.xml")) {
    return getPackageXmlMaintainers(path, text);
  } else {
    throw new Error(`Unknown file type: ${text}`);
  }
}

export function setMaintainers(
  path: string,
  text: string,
  maintainers: Maintainer[],
) {
  if (path.endsWith("setup.py")) {
    return setSetupPyMaintainers(path, text, maintainers);
  } else if (path.endsWith("package.xml")) {
    return setPackageXmlMaintainers(path, text, maintainers);
  } else {
    throw new Error(`Unknown file type: ${path}`);
  }
}
