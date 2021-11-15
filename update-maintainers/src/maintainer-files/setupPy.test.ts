import {
  assertEquals,
  assertNotEquals,
  assertThrows,
} from "../../deps.test.ts";
import {
  MAINTAINERS,
  SETUP_PY,
  SETUP_PY_MODIFIED,
  SETUP_PY_NO_MAINTAINERS,
} from "./test-data/test-data.ts";

import { getSetupPyMaintainers, setSetupPyMaintainers } from "./setupPy.ts";

const PATH = "setup.py";

Deno.test("get maintainers", () => {
  const maintainers = getSetupPyMaintainers(PATH, SETUP_PY_MODIFIED);
  assertEquals(MAINTAINERS.length, maintainers.length);
  assertEquals(MAINTAINERS, maintainers);
});

Deno.test("set maintainers", () => {
  const originalMaintainers = getSetupPyMaintainers(PATH, SETUP_PY);
  const newPackageXml = setSetupPyMaintainers(PATH, SETUP_PY, MAINTAINERS);
  const newMaintainers = getSetupPyMaintainers(PATH, SETUP_PY_MODIFIED);

  assertEquals(SETUP_PY_MODIFIED, newPackageXml);
  assertEquals(MAINTAINERS, newMaintainers);
  assertNotEquals(originalMaintainers, newMaintainers);
});

Deno.test("get maintainers with no maintainers", () => {
  const maintainers = getSetupPyMaintainers(PATH, SETUP_PY_NO_MAINTAINERS);
  assertEquals([], maintainers);
});

Deno.test("throw error on set with no maintainers", () => {
  assertThrows(() => {
    setSetupPyMaintainers(PATH, SETUP_PY_NO_MAINTAINERS, MAINTAINERS);
  });
});
