export type Maintainer = {
  name: string;
  email: string;
};

export type UpdateError = {
  path: string;
  error: Error;
};

export type Repository = {
  url: string;
  maintainers: Maintainer[];
  branch: string;
  path?: string;
};
