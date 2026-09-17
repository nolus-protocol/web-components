import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import { Dialog, Dropdown, Popover, Toast, Tooltip } from "@/components";
import { ToastType } from "@/components/types";

// Every panel the library shows over the page enters through a Vue <Transition> (CSS, never a script-driven
// animation) and keeps its own compositor layer: nolus-protocol/webapp#617.
const OWN_LAYER = "transform";
const realTransitions = { global: { stubs: { transition: false } } };

let wrapper: VueWrapper | null = null;

afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
  document.body.innerHTML = "";
});

function panelState(element: Element | null | undefined) {
  if (!(element instanceof HTMLElement)) {
    return null;
  }
  return {
    willChange: element.style.willChange,
    entering: Array.from(element.classList).filter((name) => name.endsWith("-enter-active"))
  };
}

describe("presence panels", () => {
  it("enters the dropdown list through a CSS transition on its own layer", async () => {
    wrapper = mount(Dropdown, {
      ...realTransitions,
      props: {
        id: "asset",
        options: [
          { label: "A", value: "a" },
          { label: "B", value: "b" }
        ],
        onSelect: () => undefined
      },
      attachTo: document.body
    });
    await wrapper.get("#dropdown-btn-asset").trigger("click");
    await nextTick();

    const panel = document.getElementById("dropdown-list-asset")?.parentElement;
    expect(panelState(panel)).toEqual({ willChange: OWN_LAYER, entering: ["presence-enter-active"] });
  });

  it("enters the tooltip through a CSS transition on its own layer", async () => {
    wrapper = mount(Tooltip, {
      ...realTransitions,
      props: { content: "hint" },
      slots: { default: "<span>i</span>" },
      attachTo: document.body
    });
    await wrapper.get("div").trigger("mouseenter");
    await nextTick();

    expect(panelState(document.body.querySelector(".tooltip-cursor"))).toEqual({
      willChange: OWN_LAYER,
      entering: ["presence-enter-active"]
    });
  });

  it("enters the dialog and its backdrop through CSS transitions on their own layers", async () => {
    const dialog = mount(Dialog, { ...realTransitions, props: { title: "Title" }, attachTo: document.body });
    wrapper = dialog;
    dialog.vm.show();
    await nextTick();

    const surfaces = Array.from(document.body.querySelectorAll(".fixed.inset-0")).map(panelState);
    expect(surfaces).toEqual([
      { willChange: OWN_LAYER, entering: ["dialog-backdrop-enter-active"] },
      { willChange: OWN_LAYER, entering: ["dialog-panel-enter-active"] }
    ]);
  });

  it("enters the popover through a CSS transition on its own layer", async () => {
    const anchor = document.createElement("button");
    document.body.appendChild(anchor);
    const popover = mount(Popover, {
      ...realTransitions,
      props: { title: "Menu", parent: anchor, position: "bottom" },
      attachTo: document.body
    });
    wrapper = popover;
    popover.vm.show();
    await nextTick();

    expect(panelState(wrapper.find(".fixed").element)).toEqual({
      willChange: OWN_LAYER,
      entering: ["presence-popover-enter-active"]
    });
  });

  it("keeps the toast on its own layer", async () => {
    wrapper = mount(Toast, { ...realTransitions, props: { type: ToastType.success }, attachTo: document.body });
    await nextTick();

    expect(panelState(wrapper.find(".relative").element)?.willChange).toBe(OWN_LAYER);
  });
});
