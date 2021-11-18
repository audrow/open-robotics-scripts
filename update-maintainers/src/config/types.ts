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

export type Maintainer = Person & {
  id: string;
};

export type Person = {
  name: string;
  email?: string;
};

export type Repository = {
  url: string;
  maintainerIds: string[];
  branch: string;
  path?: string;
};
