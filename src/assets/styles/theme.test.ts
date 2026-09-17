import { readFileSync } from "node:fs";
import path from "node:path";

import tailwind from "@tailwindcss/postcss";
import postcss, { type AtRule, type Rule } from "postcss";
import { describe, expect, it } from "vitest";

const themePath = path.join(import.meta.dirname, "theme.css");

async function cursorsInBaseLayer() {
  const { root } = await postcss([tailwind()]).process(readFileSync(themePath, "utf8"), { from: themePath });
  const cursors: Record<string, string> = {};
  root.walkAtRules("layer", (layer: AtRule) => {
    if (layer.params !== "base") {
      return;
    }
    layer.walkRules((rule: Rule) => {
      rule.walkDecls("cursor", (declaration) => {
        for (const selector of rule.selectors) {
          cursors[selector] = declaration.value;
        }
      });
    });
  });
  return cursors;
}

describe("theme.css", () => {
  it("gives clickable elements the hand cursor and disabled ones not-allowed, in the base layer", async () => {
    expect(await cursorsInBaseLayer()).toEqual({
      "button:not(:disabled)": "pointer",
      '[role="button"]:not([aria-disabled="true"])': "pointer",
      "button:disabled": "not-allowed",
      '[role="button"][aria-disabled="true"]': "not-allowed"
    });
  });
});
