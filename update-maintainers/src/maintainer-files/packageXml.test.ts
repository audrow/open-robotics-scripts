import {
  assertEquals,
  assertNotEquals,
  assertThrows,
} from "../../deps.test.ts";
import {
  MAINTAINERS,
  MAINTAINERS_READ,
  PACKAGE_XML,
  PACKAGE_XML_MODIFIED,
  PACKAGE_XML_NO_MAINTAINERS,
} from "./test-data/test-data.ts";

import {
  getPackageXmlMaintainers,
  setPackageXmlMaintainers,
} from "./packageXml.ts";

const PATH = "package.xml";

Deno.test("get maintainers", () => {
  const maintainers = getPackageXmlMaintainers(PATH, PACKAGE_XML_MODIFIED);
  assertEquals(MAINTAINERS_READ.length, maintainers.length);
  assertEquals(MAINTAINERS_READ, maintainers);
});

Deno.test("set maintainers", () => {
  const originalMaintainers = getPackageXmlMaintainers(PATH, PACKAGE_XML);
  const newPackageXml = setPackageXmlMaintainers(
    PATH,
    PACKAGE_XML,
    MAINTAINERS,
  );
  const newMaintainers = getPackageXmlMaintainers(PATH, PACKAGE_XML_MODIFIED);

  assertEquals(PACKAGE_XML_MODIFIED, newPackageXml);
  assertEquals(MAINTAINERS_READ, newMaintainers);
  assertNotEquals(originalMaintainers, newMaintainers);
});

Deno.test("get maintainers with no maintainers", () => {
  const maintainers = getPackageXmlMaintainers(
    PATH,
    PACKAGE_XML_NO_MAINTAINERS,
  );
  assertEquals([], maintainers);
});

Deno.test("throw error on set with no maintainers", () => {
  assertThrows(() => {
    setPackageXmlMaintainers(PATH, PACKAGE_XML_NO_MAINTAINERS, MAINTAINERS);
  });
});
