export type Config = {
  maintainers: Maintainer[];
  repositories: Repository[];
  options: Options;
};

export type Options = {
  pullRequestTitle?: string;
  workingBranch?: string;
  isDryRun?: boolean; // avoids pushing and making the PR
  isOverwrite?: boolean; // overwrites the existing contents in the temp dir
  isVerbose?: boolean;
};

export type Maintainer = {
  id: string;
  name: string;
  email: string;
};

export type Person = Pick<Maintainer, "name" | "email">;

export type Repository = {
  url: string;
  maintainerIds: string[];
  branch: string;
  path?: string;
};
