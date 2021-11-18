import type { Maintainer, Person } from "../config/types.ts";

export function getPackageXmlMaintainers(path: string, text: string) {
  return getPackageXmlPerson(path, text, "maintainer");
}

export function getPackageXmlAuthors(path: string, text: string) {
  return getPackageXmlPerson(path, text, "author");
}

function getPackageXmlPerson(path: string, text: string, tag: string) {
  const personRegex = new RegExp(
    `<${tag}\\s*(?:|email="(.*)")>(.*)</${tag}>`,
    "g",
  );
  const matches = [
    ...text.matchAll(personRegex),
  ];
  if (!matches) {
    throw new Error(`Could not find maintainers in package.xml: ${path}`);
  }
  return matches.map((match) => {
    return {
      name: match[2],
      email: match[1],
    } as Person;
  });
}

export function setPackageXmlMaintainers(
  path: string,
  text: string,
  maintainers: Maintainer[],
) {
  const authors = getOldMaintainersAsAuthors(path, text, maintainers);
  text = setPackageXmlAuthors(path, text, authors);
  return setPackageXmlPeople(path, text, maintainers, "maintainer");
}

function getOldMaintainersAsAuthors(
  path: string,
  text: string,
  maintainers: Maintainer[],
) {
  const previousMaintainers = getPackageXmlMaintainers(path, text);
  const previousAuthors = getPackageXmlAuthors(path, text);
  const newAuthors = previousMaintainers.filter((maintainer) => {
    const isNewMaintainer = isPersonInList(maintainer, maintainers);
    const isCurrentAuthors = isPersonInList(maintainer, previousAuthors);
    return !isNewMaintainer && !isCurrentAuthors;
  });
  const authors = [...previousAuthors, ...newAuthors].sort(sortByName);
  return authors;
}

function sortByName(a: Person | Maintainer, b: Person | Maintainer) {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }
  return 0;
}

function isPersonInList(
  person: Person | Maintainer,
  people: Person[] | Maintainer[],
) {
  for (const p of people) {
    if (isSamePerson(person, p)) {
      return true;
    }
  }
  return false;
}

function isSamePerson(p1: Person | Maintainer, p2: Person | Maintainer) {
  return p1.name === p2.name;
}

function setPackageXmlAuthors(path: string, text: string, authors: Person[]) {
  return setPackageXmlPeople(path, text, authors, "author");
}

function setPackageXmlPeople(
  path: string,
  text: string,
  people: Person[],
  tag: string,
) {
  const regex = new RegExp(
    `(\\n+)( *)(?:<${tag}\\s*(?:|email="(?:.*)")>(?:.*)</${tag}>\\s*)+`,
  );
  const match = text.match(regex);
  if (!match) {
    throw new Error(`Could not find '${tag}' tag in package.xml: ${path}`);
  }
  // match[1] captures the newline characters and makes it easy to put a space around the tag
  const indent = match[2];
  let replaceString = "\n\n"; // create a line before the tag group
  people.forEach((person) => {
    if (person.email) {
      replaceString +=
        `${indent}<${tag} email="${person.email}">${person.name}</${tag}>\n`;
    } else {
      replaceString += `${indent}<${tag}>${person.name}</${tag}>\n`;
    }
  });
  replaceString += `\n${indent}`; // create an empty line after the tag group
  return text.replace(regex, replaceString);
}
