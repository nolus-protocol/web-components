import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

function shapeFills(file: string) {
  const markup = readFileSync(path.join(import.meta.dirname, file), "utf8");
  const svg = new DOMParser().parseFromString(markup, "image/svg+xml").documentElement;
  return [...svg.querySelectorAll("*")].map((node) => node.getAttribute("fill")).filter((fill) => fill !== null);
}

describe("information-triangle.svg", () => {
  it("leaves its colour to the fill class on the svg", () => {
    expect(shapeFills("information-triangle.svg")).toEqual([]);
  });
});
