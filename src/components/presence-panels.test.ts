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

// What is entering right now, found by the transition classes themselves rather than by markup or styling.
function entering() {
  return Array.from(document.body.querySelectorAll<HTMLElement>("[class*='-enter-active']")).map((element) => ({
    transition: [...element.classList].find((name) => name.endsWith("-enter-active"))?.replace(/-enter-active$/, ""),
    layer: element.style.willChange
  }));
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
    await wrapper.get("[role='combobox']").trigger("click");
    await nextTick();

    expect(entering()).toEqual([{ transition: "presence", layer: OWN_LAYER }]);
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

    expect(entering()).toEqual([{ transition: "presence", layer: OWN_LAYER }]);
  });

  it("enters the dialog and its backdrop through CSS transitions on their own layers", async () => {
    const dialog = mount(Dialog, { ...realTransitions, props: { title: "Title" }, attachTo: document.body });
    wrapper = dialog;
    dialog.vm.show();
    await nextTick();

    expect(entering()).toEqual([
      { transition: "dialog-backdrop", layer: OWN_LAYER },
      { transition: "dialog-panel", layer: OWN_LAYER }
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

    expect(entering()).toEqual([{ transition: "presence-popover", layer: OWN_LAYER }]);
  });

  it("enters the toast through a CSS transition on its own layer when it mounts", async () => {
    wrapper = mount(Toast, { ...realTransitions, props: { type: ToastType.success }, attachTo: document.body });
    await nextTick();

    expect(entering()).toEqual([{ transition: "toast", layer: OWN_LAYER }]);
  });
});
