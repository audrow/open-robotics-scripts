# UPDATE-MAINTAINERS

This script is used to update package maintainers and to create a pull request
with these changes.

This script uses a YAML file to specify the packages and maintainer information.

Here are some high level notes on the script's behavior:

- You can use `-h` or `--help` on the script or on any of its commands to get
  more information and view the available options.
- The `run` command uses the config file to update the maintainers for all
  repositories. You can run this with `--dry-run` to see what would be done.
- Create a config file with the `make-config` command. This command can accept
  file arguments to include maintainers and repositories from YAML files. These
  yaml files can be created with the
  [update-maintainers-helper](../update-maintainers-helper/README.md) script.
- If anything unexpected occurs the script records the error and doesn't make
  any changes.
  - If a maintainer is listed for a repository, but the maintainer's info is not
    provided, that repository will not be updated.
  - If a project doesn't have a maintainer listed, it will not be updated.
- In `setup.py` files, if the added lines are too long (over 99 characters), a
  comment will be added to the line to tell the linter to ignore checking the
  line length (flake8 E501).

## Usage

To use this script, [install Deno](https://deno.land/) and make sure that you
have [Git](https://git-scm.com/) and
[Github's command line tool](https://github.com/cli/cli) setup and working. Once
you do, you can clone this repository and run the following command:

```bash
cd <path-to-update-maintainers>
deno run --lock lock.json -A --unstable src/index.ts make-config
deno run --lock lock.json -A --unstable src/index.ts run
```

You can run the command with `--help` to see the options.
