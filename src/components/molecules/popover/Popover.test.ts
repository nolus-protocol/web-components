import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Popover from "./Popover.vue";
import type { PopoverProps } from "./types";

const PHONE_WIDTH = 390;
const DESKTOP_WIDTH = 1024;

let unmount: (() => void) | null = null;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] });
});

afterEach(() => {
  unmount?.();
  unmount = null;
  document.body.innerHTML = "";
  document.body.removeAttribute("style");
  vi.useRealTimers();
});

async function settle() {
  await flushPromises();
  vi.advanceTimersToNextFrame();
  vi.advanceTimersToNextFrame();
}

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
    await settle();
    popover.vm.close();
    await settle();
    const elsewhere = button("Elsewhere");
    elsewhere.focus();
    document.body.style.overflow = "hidden";

    pressEscape();
    goBack();
    popover.vm.close();
    await settle();

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
    await settle();

    popover.vm.close();

    expect(bodyOverflow()).toBe("hidden");
  });

  it("keeps a lock someone else set when it unmounts while open", async () => {
    vi.stubGlobal("innerWidth", PHONE_WIDTH);
    const { popover } = mountPopover();
    document.body.style.overflow = "hidden";
    popover.vm.show();
    await settle();

    popover.unmount();
    unmount = null;

    expect(bodyOverflow()).toBe("hidden");
  });

  it("keeps a lock someone else set when an anchored popover closes", async () => {
    vi.stubGlobal("innerWidth", DESKTOP_WIDTH);
    const { popover } = mountPopover();
    popover.vm.show();
    await settle();
    document.body.style.overflow = "hidden";

    popover.vm.close();

    expect(bodyOverflow()).toBe("hidden");
  });

  it("releases its own lock when it closes", async () => {
    vi.stubGlobal("innerWidth", PHONE_WIDTH);
    const { popover } = mountPopover();
    popover.vm.show();
    await settle();
    expect(bodyOverflow()).toBe("hidden");

    popover.vm.close();

    expect(bodyOverflow()).toBe("");
  });

  it("releases its own lock when it unmounts while open", async () => {
    vi.stubGlobal("innerWidth", PHONE_WIDTH);
    const { popover } = mountPopover();
    popover.vm.show();
    await settle();
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
    await settle();
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
    await settle();
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
    await settle();
    expect(document.activeElement).toBe(panelButton("First"));

    popover.vm.show();
    await settle();

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

  it("focuses the first focusable once the panel is visible and a frame has passed", async () => {
    const { popover, trigger, panelButton } = mountPopover();
    trigger.focus();
    const calls = recordFocus();

    popover.vm.show();
    await flushPromises();
    expect(calls).toEqual([]);
    await settle();

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
    await settle();

    expect(calls).toEqual([]);
    expect(document.activeElement).toBe(trigger);
  });

  it("passes the focus option through toggle", async () => {
    const { popover, trigger } = mountPopover();
    trigger.focus();
    const calls = recordFocus();

    popover.vm.toggle({ focus: false });
    await settle();

    expect(popover.vm.isOpen).toBe(true);
    expect(calls).toEqual([]);
    expect(document.activeElement).toBe(trigger);
  });

  it("focuses nothing in the panel when it closes before focus lands", async () => {
    const { popover, trigger } = mountPopover();
    trigger.focus();
    const calls = recordFocus();

    popover.vm.show();
    await flushPromises();
    const opened = popover.element as HTMLElement;
    popover.vm.close();
    await settle();

    expect(calls.filter(({ target }) => opened.contains(target))).toEqual([]);
    expect(document.activeElement).toBe(trigger);
  });
});

describe("Popover close focus", () => {
  it("returns focus to the element focused before it opened when focus is inside", async () => {
    const { popover, trigger, panelButton } = mountPopover();
    trigger.focus();
    popover.vm.show();
    await settle();
    panelButton("Second").focus();

    popover.vm.close();

    expect(document.activeElement).toBe(trigger);
  });

  it("leaves focus where it is when focus is outside the panel", async () => {
    const { popover, trigger } = mountPopover();
    trigger.focus();
    popover.vm.show();
    await settle();
    const elsewhere = button("Elsewhere");
    elsewhere.focus();

    popover.vm.close();

    expect(document.activeElement).toBe(elsewhere);
  });
});
