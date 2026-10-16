import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import SvgIcon from "../../atoms/svg-icon/SvgIcon.vue";
import type { IconNames } from "../../atoms/svg-icon/types";
import Toast from "./Toast.vue";
import { ToastType } from "./types";

let wrapper: VueWrapper | null = null;

afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
});

const MESSAGE = "Transaction rejected by the network";

function mountToast(type: ToastType, icon?: IconNames) {
  wrapper = mount(Toast, { props: { type, icon }, slots: { default: MESSAGE } });
  return wrapper;
}

// The row holding the message text, and the icon drawn in it.
async function messageRow(toast: VueWrapper) {
  const row = toast
    .findAll("div")
    .find((candidate) =>
      [...candidate.element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent === MESSAGE)
    )!.element;
  const icon = toast.findAllComponents(SvgIcon).find((candidate) => candidate.element.parentNode === row)!;
  const svg = await vi.waitFor(() => icon.get("svg").element);
  return { row, icon, svg };
}

describe("Toast message row", () => {
  it.each([
    [ToastType.info, "info"],
    [ToastType.success, "check-solid"],
    [ToastType.error, "warning"]
  ])("draws the %s icon at 16px on the message's first line", async (type, name) => {
    const { icon, svg } = await messageRow(mountToast(type));

    expect(icon.props()).toMatchObject({ name, size: "xs", defaultColor: false });
    expect(svg.getAttribute("width")).toBe("16");
    expect([...svg.classList]).toEqual(expect.arrayContaining(["mt-0.5", "shrink-0"]));
  });

  it("draws a passed icon at the same size", async () => {
    const { icon } = await messageRow(mountToast(ToastType.info, "close"));

    expect(icon.props()).toMatchObject({ name: "close", size: "xs" });
  });

  it("aligns the row to its top with 8px between the icon and the message", async () => {
    const { row } = await messageRow(mountToast(ToastType.error));

    expect([...row.classList]).toEqual(expect.arrayContaining(["items-start", "gap-2"]));
    expect(row.classList).not.toContain("items-center");
  });
});
