import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import Tooltip from "./Tooltip.vue";
import type { TooltipProps } from "./types";

let wrapper: VueWrapper | null = null;

afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
  document.body.innerHTML = "";
});

async function shownTooltip(props: TooltipProps) {
  wrapper = mount(Tooltip, { props, slots: { default: "<span>i</span>" }, attachTo: document.body });
  await wrapper.get("div").trigger("mouseenter");
  await nextTick();
  const element = document.body.querySelector<HTMLElement>(".tooltip-cursor");
  if (!element) {
    throw new Error("the tooltip did not open");
  }
  return element;
}

describe("Tooltip tilt", () => {
  it("leans by the given degrees through the CSS rotate property", async () => {
    const element = await shownTooltip({ content: "50%", position: "top", tilt: -12 });

    expect(element.style.rotate).toBe("-12deg");
    expect(element.classList.contains("tooltip-tilt")).toBe(true);
  });

  it("pivots on the side facing its target", async () => {
    const element = await shownTooltip({ content: "50%", position: "bottom", tilt: 5 });

    expect([...element.classList].filter((name) => name.startsWith("tooltip-"))).toEqual([
      "tooltip-cursor",
      "tooltip-cursor-bottom",
      "tooltip-tilt"
    ]);
  });

  it("does not rotate a tooltip without a tilt", async () => {
    const element = await shownTooltip({ content: "hint" });

    expect(element.style.rotate).toBe("");
    expect(element.classList.contains("tooltip-tilt")).toBe(false);
  });
});
