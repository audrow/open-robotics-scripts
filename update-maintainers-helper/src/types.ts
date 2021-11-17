export type Repository = {
  maintainerIds: string[];
  branch: string;
  url: string;
};

export type Maintainer = {
  id: string;
  name: string;
  email: string;
};

export type ReposFile = {
  repositories: {
    [name: string]: {
      type: string;
      url: string;
      version: string;
    };
  };
};
