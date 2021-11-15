import type { maintainer } from "./types.ts";

export function getSetupPyMaintainers(path: string, text: string) {
  const nameMatches = text.match(/maintainer=["|'](.*)["|']/);
  const emailMatches = text.match(/maintainer_email=["|'](.*)["|']/);
  if (!nameMatches || !emailMatches) {
    return [];
  }
  const names = nameMatches[1].split(",").map((name) => name.trim());
  const emails = emailMatches[1].split(",").map((email) => email.trim());
  if (names.length !== emails.length) {
    throw new Error(
      `Number of maintainer names does not match number of emails: ${path}`,
    );
  }
  const out: maintainer[] = [];
  for (let i = 0; i < names.length; i++) {
    out.push({
      name: names[i],
      email: emails[i],
    });
  }
  return out;
}

export function setSetupPyMaintainers(
  path: string,
  text: string,
  maintainers: maintainer[],
) {
  // Build replacement maintainer name string
  const maintainerNameRegex = /( *)maintainer=(?:.*),\n/;
  const nameMatch = text.match(maintainerNameRegex);
  if (!nameMatch) {
    throw new Error(`Could not find maintainer in setup.py: ${path}`);
  }
  const nameIndent = nameMatch[1];
  const replaceNameString =
    `${nameIndent}maintainer='${maintainers.map((m) => m.name).join(", ")}` +
    "',\n";

  // Build replacement maintainer email string
  const maintainerEmailRegex = /( *)maintainer_email=(?:.*),\n/;
  const emailMatch = text.match(maintainerEmailRegex);
  if (!emailMatch) {
    throw new Error(`Could not find maintainer email in setup.py: ${path}`);
  }
  const emailIndent = emailMatch[1];
  const replaceEmailString =
    `${emailIndent}maintainer_email='${
      maintainers.map((m) => m.email).join(", ")
    }` + "',\n";

  // Replace maintainer
  return text.replace(maintainerNameRegex, replaceNameString)
    .replace(maintainerEmailRegex, replaceEmailString);
}
