import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import Tooltip from "@/components/atoms/tooltip/Tooltip.vue";
import Slider from "./Slider.vue";

const TRACK_WIDTH = 1000;
const HANDLE_WIDTH = 40;

let wrapper: VueWrapper | null = null;
let handleLeft = 480;

function box(left: number, width: number): DOMRect {
  return { left, x: left, width, right: left + width, top: 0, y: 0, height: 40, bottom: 40, toJSON: () => ({}) };
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance", "requestAnimationFrame"] });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    }
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    return this.hasAttribute("draggable") ? box(handleLeft, HANDLE_WIDTH) : box(0, TRACK_WIDTH);
  });
  handleLeft = 480;
  wrapper = mount(Slider, { props: { minPosition: 0, maxPosition: 100, value: 50 }, attachTo: document.body });
});

afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
  vi.useRealTimers();
});

const tilt = () => wrapper?.findComponent(Tooltip).props("tilt");

async function moveTo(clientX: number, afterMs: number) {
  vi.advanceTimersByTime(afterMs);
  window.dispatchEvent(new MouseEvent("mousemove", { clientX }));
  await nextTick();
}

async function grabHandle(clientX: number) {
  await wrapper?.get("button[draggable]").trigger("mousedown", { clientX });
}

describe("Slider tooltip tilt", () => {
  it("leans against the drag in proportion to its speed", async () => {
    await grabHandle(500);
    await moveTo(520, 16);
    await moveTo(540, 16);

    // 20px of a 1000px track in 16ms is 125 % per second, a third of the speed that leans 25 degrees.
    expect(tilt()).toBeCloseTo((-125 / 300) * 25, 5);

    await moveTo(500, 16);
    expect(tilt()).toBeCloseTo((250 / 300) * 25, 5);
  });

  it("clamps the lean at 25 degrees", async () => {
    await grabHandle(500);
    await moveTo(520, 16);
    await moveTo(900, 16);

    expect(tilt()).toBe(-25);
  });

  it("straightens when the handle stops or is released", async () => {
    await grabHandle(500);
    await moveTo(520, 16);
    await moveTo(540, 16);
    expect(tilt()).not.toBe(0);

    vi.advanceTimersByTime(100);
    await nextTick();
    expect(tilt()).toBe(0);

    await moveTo(560, 16);
    await moveTo(580, 16);
    expect(tilt()).not.toBe(0);
    window.dispatchEvent(new MouseEvent("mouseup"));
    await nextTick();
    expect(tilt()).toBe(0);
  });

  it("does not lean when a new press lands right after a release", async () => {
    await grabHandle(500);
    await moveTo(520, 16);
    window.dispatchEvent(new MouseEvent("mouseup"));
    await nextTick();

    vi.advanceTimersByTime(10);
    const track = wrapper?.element.firstElementChild?.firstElementChild;
    track?.dispatchEvent(new MouseEvent("mousedown", { clientX: 950, bubbles: true, cancelable: true }));
    await nextTick();

    expect(tilt()).toBe(0);
  });
});
