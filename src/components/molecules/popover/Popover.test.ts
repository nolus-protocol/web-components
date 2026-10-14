import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, inject, nextTick, onMounted } from "vue";

import Popover from "./Popover.vue";
import type { PopoverProps } from "./types";

const PHONE_WIDTH = 390;
const DESKTOP_WIDTH = 1024;

let unmount: (() => void) | null = null;

afterEach(() => {
  unmount?.();
  unmount = null;
  document.body.innerHTML = "";
  document.body.removeAttribute("style");
});

function button(label: string) {
  const element = document.createElement("button");
  element.textContent = label;
  document.body.appendChild(element);
  return element;
}

function mountPopover(props: Partial<PopoverProps> = {}) {
  const trigger = button("Trigger");
  const popover = mount(Popover, {
    global: { stubs: { transition: false } },
    props: { parent: trigger, position: "bottom", ...props },
    slots: { content: "<button>First</button><button>Second</button>" },
    attachTo: document.body
  });
  unmount = () => popover.unmount();
  const panelButton = (label: string) => {
    const found = popover.findAll("button").find((element) => element.text() === label);
    if (!found) {
      throw new Error(`the panel has no ${label} button`);
    }
    return found.element;
  };
  return { popover, trigger, panelButton };
}

function pressEscape() {
  document.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
}

function goBack() {
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function bodyOverflow() {
  return document.body.style.overflow;
}

describe("Popover close while closed", () => {
  it("leaves focus, the body lock and the emits alone on Escape and Back after it closed", async () => {
    const { popover, trigger } = mountPopover();
    trigger.focus();
    popover.vm.show();
    await flushPromises();
    popover.vm.close();
    await flushPromises();
    const elsewhere = button("Elsewhere");
    elsewhere.focus();
    document.body.style.overflow = "hidden";

    pressEscape();
    goBack();
    popover.vm.close();
    await flushPromises();

    expect(document.activeElement).toBe(elsewhere);
    expect(bodyOverflow()).toBe("hidden");
    expect(popover.emitted("close")).toHaveLength(1);
  });
});

describe("Popover body scroll lock", () => {
  it("keeps a lock someone else set when it closes", async () => {
    vi.stubGlobal("innerWidth", PHONE_WIDTH);
    const { popover } = mountPopover();
    document.body.style.overflow = "hidden";
    popover.vm.show();
    await flushPromises();

    popover.vm.close();

    expect(bodyOverflow()).toBe("hidden");
  });

  it("keeps a lock someone else set when it unmounts while open", async () => {
    vi.stubGlobal("innerWidth", PHONE_WIDTH);
    const { popover } = mountPopover();
    document.body.style.overflow = "hidden";
    popover.vm.show();
    await flushPromises();

    popover.unmount();
    unmount = null;

    expect(bodyOverflow()).toBe("hidden");
  });

  it("keeps a lock someone else set when an anchored popover closes", async () => {
    vi.stubGlobal("innerWidth", DESKTOP_WIDTH);
    const { popover } = mountPopover();
    popover.vm.show();
    await flushPromises();
    document.body.style.overflow = "hidden";

    popover.vm.close();

    expect(bodyOverflow()).toBe("hidden");
  });

  it("releases its own lock when it closes", async () => {
    vi.stubGlobal("innerWidth", PHONE_WIDTH);
    const { popover } = mountPopover();
    popover.vm.show();
    await flushPromises();
    expect(bodyOverflow()).toBe("hidden");

    popover.vm.close();

    expect(bodyOverflow()).toBe("");
  });

  it("releases its own lock when it unmounts while open", async () => {
    vi.stubGlobal("innerWidth", PHONE_WIDTH);
    const { popover } = mountPopover();
    popover.vm.show();
    await flushPromises();
    expect(bodyOverflow()).toBe("hidden");

    popover.unmount();
    unmount = null;

    expect(bodyOverflow()).toBe("");
  });

  it("takes the lock on scroll once the one who held it lets go, and releases it on close", async () => {
    vi.stubGlobal("innerWidth", PHONE_WIDTH);
    const { popover } = mountPopover();
    document.body.style.overflow = "hidden";
    popover.vm.show();
    await flushPromises();
    document.body.style.removeProperty("overflow");

    window.dispatchEvent(new Event("scroll"));
    expect(bodyOverflow()).toBe("hidden");

    popover.vm.close();
    expect(bodyOverflow()).toBe("");
  });
});

describe("Popover unmount while open", () => {
  it("removes its focus trap from the document", async () => {
    const { popover } = mountPopover();
    const added = vi.spyOn(document, "addEventListener");
    popover.vm.show();
    await flushPromises();
    const trap = added.mock.calls.find(([type]) => type === "keydown")?.[1];
    expect(trap).toBeTypeOf("function");
    const removed = vi.spyOn(document, "removeEventListener");

    popover.unmount();
    unmount = null;

    expect(removed).toHaveBeenCalledWith("keydown", trap);
  });
});

describe("Popover show", () => {
  it("does nothing when it is already open", async () => {
    const { popover, trigger, panelButton } = mountPopover();
    trigger.focus();
    popover.vm.show();
    await flushPromises();
    expect(document.activeElement).toBe(panelButton("First"));

    popover.vm.show();
    await flushPromises();

    expect(popover.emitted("open")).toHaveLength(1);
    expect((popover.element as HTMLElement).style.visibility).toBe("");
    popover.vm.close();
    expect(document.activeElement).toBe(trigger);
  });
});

describe("Popover focus", () => {
  function recordFocus() {
    const calls: { target: HTMLElement; visibility: string }[] = [];
    const focus = HTMLElement.prototype.focus;
    vi.spyOn(HTMLElement.prototype, "focus").mockImplementation(function (this: HTMLElement, options) {
      calls.push({ target: this, visibility: getComputedStyle(this).visibility });
      focus.call(this, options);
    });
    return calls;
  }

  it("never hides the panel while it positions it", async () => {
    const { popover } = mountPopover();

    popover.vm.show();
    await nextTick();

    expect((popover.element as HTMLElement).style.visibility).toBe("");
  });

  it("focuses the first focusable once the position pass has been committed, without waiting for a frame", async () => {
    const { popover, trigger, panelButton } = mountPopover();
    trigger.focus();
    const calls = recordFocus();

    popover.vm.show();
    await flushPromises();

    expect(calls.map(({ target, visibility }) => ({ target, visibility }))).toEqual([
      { target: panelButton("First"), visibility: "visible" }
    ]);
    expect(document.activeElement).toBe(panelButton("First"));
  });

  it("moves no focus when shown with focus off", async () => {
    const { popover, trigger } = mountPopover();
    trigger.focus();
    const calls = recordFocus();

    popover.vm.show({ focus: false });
    await flushPromises();

    expect(calls).toEqual([]);
    expect(document.activeElement).toBe(trigger);
  });

  it("passes the focus option through toggle", async () => {
    const { popover, trigger } = mountPopover();
    trigger.focus();
    const calls = recordFocus();

    popover.vm.toggle({ focus: false });
    await flushPromises();

    expect(popover.vm.isOpen).toBe(true);
    expect(calls).toEqual([]);
    expect(document.activeElement).toBe(trigger);
  });

  it("moves no focus for a show that a close superseded before its position pass", async () => {
    const { popover, trigger } = mountPopover();
    trigger.focus();
    const calls = recordFocus();

    popover.vm.show();
    popover.vm.close();
    await flushPromises();
    popover.vm.show({ focus: false });
    await flushPromises();

    expect(calls).toEqual([]);
    expect(document.activeElement).toBe(trigger);
  });

  it("focuses nothing in the panel when it closes before focus lands", async () => {
    const { popover, trigger } = mountPopover();
    trigger.focus();
    const calls = recordFocus();

    popover.vm.show();
    await nextTick();
    const opened = popover.element as HTMLElement;
    popover.vm.close();
    await flushPromises();

    expect(calls.filter(({ target }) => opened.contains(target))).toEqual([]);
    expect(document.activeElement).toBe(trigger);
  });
});

describe("Popover close focus", () => {
  it("returns focus to the element focused before it opened when focus is inside", async () => {
    const { popover, trigger, panelButton } = mountPopover();
    trigger.focus();
    popover.vm.show();
    await flushPromises();
    panelButton("Second").focus();

    popover.vm.close();

    expect(document.activeElement).toBe(trigger);
  });

  it("returns focus to the element focused before it opened when focus is in a registered safe element", async () => {
    const SafeList = defineComponent({
      setup() {
        const register = inject<(element: HTMLElement) => void>("registerSafeElement");
        onMounted(() => register?.(button("Option")));
        return () => h("button", "First");
      }
    });
    const trigger = button("Trigger");
    const popover = mount(Popover, {
      global: { stubs: { transition: false } },
      props: { parent: trigger, position: "bottom" },
      slots: { content: SafeList },
      attachTo: document.body
    });
    unmount = () => popover.unmount();
    trigger.focus();
    popover.vm.show();
    await flushPromises();
    const option = Array.from(document.body.querySelectorAll("button")).find(
      (element) => element.textContent === "Option"
    );
    option?.focus();
    expect(document.activeElement).toBe(option);

    goBack();

    expect(document.activeElement).toBe(trigger);
  });

  it("leaves focus where it is when focus is outside the panel", async () => {
    const { popover, trigger } = mountPopover();
    trigger.focus();
    popover.vm.show();
    await flushPromises();
    const elsewhere = button("Elsewhere");
    elsewhere.focus();

    popover.vm.close();

    expect(document.activeElement).toBe(elsewhere);
  });
});

describe("Popover phone sheet height", () => {
  it("caps the sheet's height inline at the viewport below its top", async () => {
    vi.stubGlobal("innerWidth", PHONE_WIDTH);
    const { popover } = mountPopover({ top: 30 });
    popover.vm.show();
    await flushPromises();
    const root = popover.element as HTMLElement;

    expect({ top: root.style.top, maxHeight: root.style.maxHeight }).toEqual({
      top: "30px",
      maxHeight: "calc(100% - 30px)"
    });
  });

  it("keeps the default top of 65", async () => {
    vi.stubGlobal("innerWidth", PHONE_WIDTH);
    const { popover } = mountPopover();
    popover.vm.show();
    await flushPromises();
    const root = popover.element as HTMLElement;

    expect({ top: root.style.top, maxHeight: root.style.maxHeight }).toEqual({
      top: "65px",
      maxHeight: "calc(100% - 65px)"
    });
  });

  it("keeps the class cap from 768 and sets no inline cap on an anchored popover", async () => {
    vi.stubGlobal("innerWidth", DESKTOP_WIDTH);
    const { popover } = mountPopover({ top: 30 });
    popover.vm.show();
    await flushPromises();
    const root = popover.element as HTMLElement;

    expect(root.style.maxHeight).toBe("");
    expect(root.classList.contains("md:max-h-[calc(100%-65px)]")).toBe(true);
    expect(root.classList.contains("max-h-[calc(100%-65px)]")).toBe(false);
  });
});
