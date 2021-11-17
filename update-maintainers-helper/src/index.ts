import {
  cac,
  ensureDir,
  join,
  parseCsv,
  parseYaml,
  stringifyYaml,
} from "./deps.ts";
import type { Maintainer, ReposFile, Repository } from "./types.ts";

async function getRepositories(
  maintainersFileText: string,
  reposFileText: string,
) {
  const reposYaml = parseYaml(reposFileText) as ReposFile;
  const maintainerCsvRows = await parseCsv(maintainersFileText, {
    skipFirstRow: false,
  }) as string[][];
  const repositories: Repository[] = maintainerCsvRows.map((row) => {
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
  return repositories;
}

function getMaintainers(repositories: Repository[]): Maintainer[] {
  return Array.from(
    new Set(repositories.flatMap((repo) => repo.maintainerIds)),
  )
    .sort()
    .map((id) => ({ id, name: "", email: "" }));
}

async function main(args: {
  packageMaintainersCsvFile: string;
  reposYamlFile: string;
  reposOutFile?: string;
  maintainersOutFile?: string;
  outputDir?: string;
}) {
  if (!args.reposOutFile) {
    args.reposOutFile = "repositories.yaml";
  }
  if (!args.maintainersOutFile) {
    args.maintainersOutFile = "maintainers.yaml";
  }
  if (!args.outputDir) {
    args.outputDir = "temp";
  }
  ensureDir(args.outputDir);

  const maintainersFileText = await Deno.readTextFile(
    args.packageMaintainersCsvFile,
  );
  const reposFileText = await Deno.readTextFile(args.reposYamlFile);

  const repositories: Repository[] = await getRepositories(
    maintainersFileText,
    reposFileText,
  );
  const maintainers: Maintainer[] = getMaintainers(repositories);

  const reposOutFile = join(args.outputDir, args.reposOutFile);
  const maintainersOutFile = join(args.outputDir, args.maintainersOutFile);
  await Deno.writeTextFile(reposOutFile, stringifyYaml({ repositories }));
  await Deno.writeTextFile(maintainersOutFile, stringifyYaml({ maintainers }));
  console.log(`Wrote '${reposOutFile}' and '${maintainersOutFile}'`);
}

const cli = cac("update-maintainers-helper");
cli.command(
  "<package-maintainers-csv-file> <repos-yaml-file>",
  "Create maintainers and repositories YAML files",
)
  .option("--repos-out-file <file>", "Path to output file for repos")
  .option(
    "--maintainers-out-file <file>",
    "Path to output file for maintainers",
  )
  .option("--output-dir <dir>", "Path to output directory")
  .action(async (packageMaintainersCsvFile, reposYamlFile, options) => {
    await main({
      packageMaintainersCsvFile,
      reposYamlFile,
      reposOutFile: options.reposOutFile,
      maintainersOutFile: options.maintainersOutFile,
      outputDir: options.outputDir,
    });
  });

cli.help();
cli.version("0.0.0");
cli.parse();
