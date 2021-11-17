# UPDATE-MAINTAINERS-HELPER

This script creates YAML files that can be used by the
[update-maintainers](../update-maintainers) script. It requires two files:

- A CSV file that contains packages and maintainers. Their should be one row
  with the package name (in the format of `org/repo`) and their can be one or
  more rows with maintainer names. The maintainers are ideally the Github
  usernames used by the maintainers. These will be the IDs in the maintainer
  YAML.

  This document can be made by deleting all of the columns in the maintainers
  sheet except the repository name and the columns for the maintainers. Note
  that empty entries in maintainer columns will be ignored, while non empty ones
  will be used.
- [A ROS repos file](https://github.com/ros2/ros2/blob/master/ros2.repos). This
  file doesn't need to be modified.

This script will generate the following files:

- A YAML file with the packages. This file contains the repositories URL,
  branch, and the IDs of its maintainers.
- A YAML file with the maintainers. This file contains a list of all of the
  maintainers. Unfortunately, I don't know how to get all of the maintainer
  information programmatically in any easy way, so this file is intended to be
  used as a template: the maintainer names and emails are to be filled out after
  this file is generated.

## Usage

To use this script, [install Deno](https://deno.land/), then run the following
command:

```bash
cd <path-to-update-maintainers-helper>
deno run --lock lock.json --allow-read --allow-write src/index.ts <your repos.csv> <your ros2.repos>
```

You can run the command with `--help` to see the options.
