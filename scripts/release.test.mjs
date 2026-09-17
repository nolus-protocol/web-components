import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  TitleError,
  changesFromGitLog,
  highestLevel,
  isReleaseLevel,
  nextVersion,
  parseTitle,
  releaseLevel
} from "./release.mjs";

const script = fileURLToPath(new URL("./release.mjs", import.meta.url));

describe("parseTitle", () => {
  it("reads type, scope and the breaking marker", () => {
    assert.deepEqual(parseTitle("feat(table): header slot beside the settings icon"), {
      type: "feat",
      scope: "table",
      breaking: false
    });
    assert.deepEqual(parseTitle("refactor(animation)!: move the last animations to CSS"), {
      type: "refactor",
      scope: "animation",
      breaking: true
    });
    assert.deepEqual(parseTitle("chore(deps-dev): bump vite from 7.1.12 to 7.3.2"), {
      type: "chore",
      scope: "deps-dev",
      breaking: false
    });
  });

  it("rejects titles that are not conventional commits", () => {
    for (const title of [
      "Bump vite from 7.1.12 to 7.3.2",
      "Feat: capitalised type",
      "feat:missing space",
      "feat: ",
      "feat(Table): uppercase scope",
      "feat(): empty scope",
      ""
    ]) {
      assert.throws(() => parseTitle(title), TitleError, title);
    }
  });

  it("rejects unknown types, including lowercase names inherited from Object.prototype", () => {
    for (const title of ["feature: something", "constructor: x"]) {
      assert.throws(() => parseTitle(title), /not a known type/, title);
    }
  });

  it("accepts the pull request number GitHub appends to a squash commit", () => {
    assert.equal(parseTitle("fix(presence): enter through CSS (#39)").type, "fix");
  });
});

describe("releaseLevel", () => {
  it("maps each type to its release", () => {
    assert.equal(releaseLevel({ title: "feat: add a slot" }), "minor");
    for (const type of ["fix", "perf", "refactor", "revert", "build"]) {
      assert.equal(releaseLevel({ title: `${type}: change shipped code` }), "patch", type);
    }
    for (const type of ["docs", "ci", "test", "chore", "style"]) {
      assert.equal(releaseLevel({ title: `${type}: change nothing shipped` }), "none", type);
    }
  });

  it("treats a breaking marker or footer as major, whatever the type", () => {
    assert.equal(releaseLevel({ title: "fix!: remove a prop" }), "major");
    assert.equal(releaseLevel({ title: "chore(deps)!: require vue 4" }), "major");
    assert.equal(
      releaseLevel({ title: "fix: remove a prop", body: "Why.\n\nBREAKING CHANGE: rotateValue is gone" }),
      "major"
    );
    assert.equal(releaseLevel({ title: "fix: remove a prop", body: "BREAKING-CHANGE: rotateValue is gone" }), "major");
  });

  it("does not read a breaking change from prose that merely mentions one", () => {
    assert.equal(releaseLevel({ title: "fix: typo", body: "This is not a BREAKING CHANGE: just a typo" }), "patch");
    assert.equal(releaseLevel({ title: "fix: typo", body: null }), "patch");
  });

  it("releases nothing for the bump pull request itself", () => {
    assert.equal(releaseLevel({ title: "chore: release v2.0.76" }), "none");
  });
});

describe("highestLevel", () => {
  it("takes the highest release across every merged change", () => {
    assert.equal(highestLevel([]), "none");
    assert.equal(highestLevel([{ title: "docs: readme" }, { title: "ci: checks" }]), "none");
    assert.equal(highestLevel([{ title: "fix: a" }, { title: "feat: b" }, { title: "docs: c" }]), "minor");
    assert.equal(highestLevel([{ title: "feat: a" }, { title: "refactor!: b" }]), "major");
  });

  it("fails on any unparseable title instead of guessing", () => {
    assert.throws(() => highestLevel([{ title: "fix: a" }, { title: "Bump vite" }]), TitleError);
  });
});

describe("changesFromGitLog", () => {
  it("splits NUL-separated commit messages into titles and bodies", () => {
    const log = "feat(table): header slot (#32)\n\nWhy it matters.\n\0\nfix: typo (#33)\n\0\n";
    assert.deepEqual(changesFromGitLog(log), [
      { title: "feat(table): header slot (#32)", body: "\nWhy it matters.\n" },
      { title: "fix: typo (#33)", body: "" }
    ]);
  });

  it("reads nothing from an empty range", () => {
    assert.deepEqual(changesFromGitLog(""), []);
    assert.deepEqual(changesFromGitLog("\n"), []);
  });
});

describe("isReleaseLevel", () => {
  it("accepts only the four levels", () => {
    for (const level of ["none", "patch", "minor", "major"]) {
      assert.equal(isReleaseLevel(level), true, level);
    }
    for (const value of ["", "Patch", "prerelease", "constructor"]) {
      assert.equal(isReleaseLevel(value), false, value);
    }
  });
});

describe("nextVersion", () => {
  it("bumps the matching part and resets the lower ones", () => {
    assert.equal(nextVersion("2.0.75", "patch"), "2.0.76");
    assert.equal(nextVersion("2.0.75", "minor"), "2.1.0");
    assert.equal(nextVersion("2.0.75", "major"), "3.0.0");
    assert.equal(nextVersion("0.9.9", "patch"), "0.9.10");
  });

  it("refuses versions it cannot bump safely", () => {
    assert.throws(() => nextVersion("2.0", "patch"), /not a plain/);
    assert.throws(() => nextVersion("2.0.75-rc.1", "patch"), /not a plain/);
    assert.throws(() => nextVersion("02.0.1", "patch"), /not a plain/);
    assert.throws(() => nextVersion("2.0.75", "none"), /no next version/);
  });
});

describe("command line", () => {
  const run = (args, { input, env } = {}) =>
    execFileSync(process.execPath, [script, ...args], {
      input,
      env: { ...process.env, ...env },
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"]
    }).trim();

  it("prints the highest level for a git log piped in, with each title JSON-quoted on stderr", () => {
    const log = "fix: a (#1)\n\0\nfeat(x): b (#2)\n\nBody\n\0\n";
    const result = spawnSync(process.execPath, [script, "level"], { input: log, encoding: "utf8" });
    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), "minor");
    assert.deepEqual(result.stderr.trim().split("\n"), ['"fix: a (#1)"', '"feat(x): b (#2)"']);
  });

  it("points to the manual release when a merged title cannot be read", () => {
    const result = spawnSync(process.execPath, [script, "level"], {
      input: "Merge branch 'x'\n\0\n",
      encoding: "utf8"
    });
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, /not a conventional commit title.*Run the Release workflow by hand/s);
  });

  it("prints the next version and rejects an unknown level", () => {
    assert.equal(run(["next-version", "2.0.75", "major"]), "3.0.0");
    assert.throws(() => run(["next-version", "2.0.75", "prerelease"]), /Unknown release level/);
  });

  it("explains what a valid title releases and fails an invalid one", () => {
    assert.equal(run(["check-title"], { env: { TITLE: "docs: readme" } }), "Merging this releases nothing.");
    assert.equal(run(["check-title"], { env: { TITLE: "feat: slot" } }), "Merging this releases a minor version.");
    assert.throws(
      () => run(["check-title"], { env: { TITLE: "Bump vite" } }),
      (error) => {
        assert.equal(error.status, 1);
        assert.match(error.stderr, /not a conventional commit title/);
        return true;
      }
    );
  });
});
