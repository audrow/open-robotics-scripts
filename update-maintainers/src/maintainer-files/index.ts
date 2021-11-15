import { getSetupPyMaintainers, setSetupPyMaintainers } from "./setupPy.ts";
import {
  getPackageXmlMaintainers,
  setPackageXmlMaintainers,
} from "./packageXml.ts";

import type { maintainer } from "./types.ts";

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
  maintainers: maintainer[],
) {
  if (path.endsWith("setup.py")) {
    return setSetupPyMaintainers(path, text, maintainers);
  } else if (path.endsWith("package.xml")) {
    return setPackageXmlMaintainers(path, text, maintainers);
  } else {
    throw new Error(`Unknown file type: ${path}`);
  }
}
