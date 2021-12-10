import { makeCli } from "./cli/index.ts";
import { bumpFiles, getVersion, setFiles } from "./file_system/index.ts";
import { getVersionFromString } from "./update_package/index.ts";
import type { BumpFn, GetFn, SetFn } from "./cli/index.ts";

const bumpFn: BumpFn = async (path, bumpType) => {
  await bumpFiles(path, bumpType);
  console.log(`Done!`);
};

const setFn: SetFn = async (path, version) => {
  await setFiles(path, getVersionFromString(version));
  console.log(`Done!`);
};

const getFn: GetFn = async (path) => {
  console.log(`Current Version: ${await getVersion(path)}`);
};

const cli = makeCli({
  name: "update-package-versions",
  defaultBumpType: "patch",
  version: "0.0.1",
  bumpFn,
  setFn,
  getFn,
});
cli.parse();