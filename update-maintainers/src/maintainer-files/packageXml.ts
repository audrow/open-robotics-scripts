import type { maintainer } from "./types.ts";

export function getPackageXmlMaintainers(path: string, text: string) {
  const matches = [
    ...text.matchAll(/<maintainer email="(.*)">(.*)<\/maintainer>/g),
  ];
  if (!matches) {
    throw new Error(`Could not find maintainers in package.xml: ${path}`);
  }
  return matches.map((match) => {
    return {
      name: match[2],
      email: match[1],
    } as maintainer;
  });
}

export function setPackageXmlMaintainers(
  path: string,
  text: string,
  maintainers: maintainer[],
) {
  const maintainerRegex =
    /( *)(?:<maintainer email="(?:.*)">(?:.*)<\/maintainer>\s*)+/;
  const match = text.match(maintainerRegex);
  if (!match) {
    throw new Error(`Could not find maintainers in package.xml: ${path}`);
  }
  const indent = match[1];
  let replaceString = "";
  maintainers.forEach((maintainer) => {
    replaceString +=
      `${indent}<maintainer email="${maintainer.email}">${maintainer.name}</maintainer>\n`;
  });
  replaceString += indent;
  return text.replace(maintainerRegex, replaceString);
}
