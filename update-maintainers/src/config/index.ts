import { Config, Maintainer } from "./types.ts";

import { parse } from "../../deps.ts";

export async function load(path: string) {
  return parse(await Deno.readTextFile(path)) as Config;
}

export function getMaintainers(
  maintainerIds: string[],
  maintainersList: Maintainer[],
) {
  const out: Maintainer[] = [];
  maintainerIds.forEach((id) => {
    const maintainer = maintainersList.find((m) => m.id === id);
    if (maintainer) {
      out.push(maintainer);
    } else {
      throw new Error(`Maintainer ${id} not found`);
    }
  });
  return out;
}
