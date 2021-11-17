import { parse as parseCsv } from "https://deno.land/std@0.114.0/encoding/csv.ts";
import {
  parse as parseYaml,
  stringify as stringifyYaml,
} from "https://deno.land/std@0.114.0/encoding/yaml.ts";

type Repository = {
  maintainerIds: string[];
  branch: string;
  url: string;
};

type Maintainer = {
  id: string;
  name: string;
  email: string;
};

type ReposFile = {
  repositories: {
    [name: string]: {
      type: string;
      url: string;
      version: string;
    };
  };
};

const maintainersFileText = await Deno.readTextFile("files/repos.csv");

const reposFileText = await Deno.readTextFile("files/ros2.repos");
const reposYaml = parseYaml(reposFileText) as ReposFile;

const reposOutFile = "repositories.yaml";
const rows = await parseCsv(maintainersFileText, {
  skipFirstRow: false,
}) as string[][];
const repositories: Repository[] = rows.map((row) => {
  const name = row[0];
  const maintainerIds = row.slice(1).filter(Boolean);
  const url = reposYaml.repositories[name]?.url;
  const branch = reposYaml.repositories[name]?.version;
  return {
    maintainerIds,
    url,
    branch,
  };
}).filter((repo) => repo.url);
await Deno.writeTextFile(reposOutFile, stringifyYaml({ repositories }));
console.log(`Wrote ${reposOutFile}`);

const maintainersOutFile = "maintainers.yaml";
const allMaintainers = Array.from(
  new Set(repositories.flatMap((repo) => repo.maintainerIds)),
).sort();
const maintainers: Maintainer[] = allMaintainers.map((maintainerId) => {
  return { id: maintainerId, name: "", email: "" };
});
await Deno.writeTextFile(maintainersOutFile, stringifyYaml({ maintainers }));
console.log(`Wrote ${maintainersOutFile}`);
