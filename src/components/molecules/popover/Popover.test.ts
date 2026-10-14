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
