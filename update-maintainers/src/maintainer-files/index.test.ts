import { getMaintainers, setMaintainers } from "./index.ts";
import {
  MAINTAINERS,
  PACKAGE_XML,
  PACKAGE_XML_MODIFIED,
  SETUP_PY,
  SETUP_PY_MODIFIED,
} from "./test-data/test-data.ts";

import { assertEquals, assertThrows } from "../../deps.test.ts";

const SETUP_PY_PATH = "setup.py";
const PACKAGE_XML_PATH = "package.xml";

Deno.test("get maintainers from setup.py", () => {
  const maintainers = getMaintainers(SETUP_PY_PATH, SETUP_PY_MODIFIED);
  assertEquals(MAINTAINERS.length, maintainers.length);
  assertEquals(MAINTAINERS, maintainers);
});

Deno.test("set maintainers in setup.py", () => {
  const outText = setMaintainers(SETUP_PY_PATH, SETUP_PY, MAINTAINERS);
  assertEquals(SETUP_PY_MODIFIED, outText);
});

Deno.test("get maintainers from package.xml", () => {
  const maintainers = getMaintainers(PACKAGE_XML_PATH, PACKAGE_XML_MODIFIED);
  assertEquals(MAINTAINERS.length, maintainers.length);
  assertEquals(MAINTAINERS, maintainers);
});

Deno.test("set maintainers in package.xml", () => {
  const outText = setMaintainers(PACKAGE_XML_PATH, PACKAGE_XML, MAINTAINERS);
  assertEquals(PACKAGE_XML_MODIFIED, outText);
});

Deno.test("throw error on get with unknown file type", () => {
  ["badfile", "", "badfile.txt"].forEach((file) => {
    assertThrows(() => {
      getMaintainers(file, SETUP_PY);
    });
  });
});

Deno.test("throw error on set with unknown file type", () => {
  ["badfile", "", "badfile.txt"].forEach((file) => {
    assertThrows(() => {
      setMaintainers(file, SETUP_PY, MAINTAINERS);
    });
  });
});
