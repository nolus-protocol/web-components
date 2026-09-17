// @ts-check
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/** @typedef {"none" | "patch" | "minor" | "major"} ReleaseLevel */
/** @typedef {{ title: string, body?: string | null }} MergedChange */

/** @type {ReadonlyArray<ReleaseLevel>} */
const LEVELS = ["none", "patch", "minor", "major"];

/** @type {Readonly<Record<string, ReleaseLevel>>} */
const LEVEL_BY_TYPE = {
  feat: "minor",
  fix: "patch",
  perf: "patch",
  refactor: "patch",
  revert: "patch",
  build: "patch",
  docs: "none",
  ci: "none",
  test: "none",
  chore: "none",
  style: "none"
};

const TITLE = /^(?<type>[a-z]+)(?:\((?<scope>[a-z0-9][a-z0-9-]*)\))?(?<breaking>!)?: (?<description>\S.*)$/;
const BREAKING_FOOTER = /^BREAKING[ -]CHANGE: \S/m;
const VERSION = /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)$/;

export class TitleError extends Error {}

/**
 * Parses a conventional-commit title such as `feat(table): header slot` or `refactor(animation)!: drop motion`.
 * @param {string} title
 * @returns {{ type: string, scope: string | undefined, breaking: boolean }}
 */
export function parseTitle(title) {
  const groups = TITLE.exec(title)?.groups;
  const type = groups?.type;
  if (!groups || type === undefined) {
    throw new TitleError(
      `"${title}" is not a conventional commit title: expected "<type>(<optional scope>)<optional !>: <description>".`
    );
  }
  if (!Object.hasOwn(LEVEL_BY_TYPE, type)) {
    throw new TitleError(`"${type}" is not a known type; use one of ${Object.keys(LEVEL_BY_TYPE).join(", ")}.`);
  }
  return { type, scope: groups.scope, breaking: groups.breaking === "!" };
}

/**
 * The release a single merged change calls for: a `!` or a BREAKING CHANGE footer is major, feat is minor,
 * code-changing types are patch, and docs/ci/test/chore/style changes release nothing.
 * @param {MergedChange} change
 * @returns {ReleaseLevel}
 */
export function releaseLevel(change) {
  const { type, breaking } = parseTitle(change.title);
  if (breaking || BREAKING_FOOTER.test(change.body ?? "")) {
    return "major";
  }
  const level = LEVEL_BY_TYPE[type];
  if (level === undefined) {
    throw new TitleError(`"${type}" is not a known type.`);
  }
  return level;
}

/**
 * @param {ReadonlyArray<MergedChange>} changes
 * @returns {ReleaseLevel}
 */
export function highestLevel(changes) {
  return changes.map(releaseLevel).reduce((highest, level) => (rank(level) > rank(highest) ? level : highest), "none");
}

/**
 * Splits `git log --format=%B%x00` output into changes: the first line of each message is its title, the rest its body.
 * @param {string} log
 * @returns {MergedChange[]}
 */
export function changesFromGitLog(log) {
  return log
    .split("\0")
    .map((message) => message.replace(/^\n+/, ""))
    .filter((message) => message.trim() !== "")
    .map((message) => {
      const [title = "", ...body] = message.split("\n");
      return { title, body: body.join("\n") };
    });
}

/**
 * @param {string} version
 * @param {ReleaseLevel} level
 * @returns {string}
 */
export function nextVersion(version, level) {
  const groups = VERSION.exec(version)?.groups;
  if (!groups) {
    throw new Error(`"${version}" is not a plain major.minor.patch version.`);
  }
  const major = Number(groups.major);
  const minor = Number(groups.minor);
  const patch = Number(groups.patch);
  switch (level) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    case "none":
      throw new Error("A release level of none has no next version.");
    default: {
      /** @type {never} */
      const unknown = level;
      throw new Error(`Unknown release level "${unknown}".`);
    }
  }
}

/**
 * @param {string} value
 * @returns {value is ReleaseLevel}
 */
export function isReleaseLevel(value) {
  return LEVELS.some((level) => level === value);
}

/** @param {ReleaseLevel} level */
function rank(level) {
  return LEVELS.indexOf(level);
}

/** @param {ReadonlyArray<string>} args */
function main(args) {
  const [command, ...rest] = args;
  switch (command) {
    case "check-title": {
      const level = releaseLevel({ title: process.env.TITLE ?? "", body: process.env.BODY });
      console.log(level === "none" ? "Merging this releases nothing." : `Merging this releases a ${level} version.`);
      return;
    }
    case "level": {
      const changes = changesFromGitLog(readFileSync(0, "utf8"));
      for (const change of changes) {
        // JSON-quoted so a contributor-written title can never be read as a workflow command.
        console.error(JSON.stringify(change.title));
      }
      try {
        console.log(highestLevel(changes));
      } catch (error) {
        if (error instanceof TitleError) {
          throw new TitleError(
            `${error.message} Run the Release workflow by hand with an explicit level to release past this commit.`
          );
        }
        throw error;
      }
      return;
    }
    case "next-version": {
      const [version = "", level = ""] = rest;
      if (!isReleaseLevel(level)) {
        throw new Error(`Unknown release level "${level}".`);
      }
      console.log(nextVersion(version, level));
      return;
    }
    default:
      throw new Error("Usage: release.mjs check-title | level | next-version <version> <level>");
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
