import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import SvgIcon from "../../atoms/svg-icon/SvgIcon.vue";
import Alert from "./Alert.vue";
import { AlertType } from "./types";

let wrapper: VueWrapper | null = null;

afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
});

function mountAlert(type: AlertType, title?: string) {
  wrapper = mount(Alert, {
    props: { type, title },
    slots: { content: "<span>The position is being opened</span>" }
  });
  return wrapper;
}

async function alertIcon(alert: VueWrapper) {
  const icons = alert.findAllComponents(SvgIcon);
  expect(icons).toHaveLength(1);
  const icon = icons[0]!;
  const svg = await vi.waitFor(() => icon.get("svg").element);
  return { icon, svg, box: svg.parentElement! };
}

const ICONS = [
  [AlertType.error, "circle-x", "fill-icon-error"],
  [AlertType.success, "check-solid", "fill-icon-success"],
  [AlertType.info, "info", "fill-icon-link"],
  [AlertType.warning, "warning", "fill-typography-warning"]
] as const;

describe("Alert icon", () => {
  it.each(ICONS)("draws the %s icon at 20px in a 22px box on the title line", async (type, name, tone) => {
    const alert = mountAlert(type, "Position opening");
    const { icon, svg, box } = await alertIcon(alert);

    expect(icon.props()).toMatchObject({ name, size: "m", defaultColor: false });
    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.classList).toContain(tone);
    expect(svg.classList).not.toContain("fill-icon-default");
    expect([...box.classList]).toEqual(expect.arrayContaining(["h-5.5", "shrink-0", "items-center"]));
    expect(box.parentElement).toBe(alert.element);
  });

  it.each(ICONS)("draws the %s icon at 16px in a 20px box beside untitled copy", async (type, name, tone) => {
    const alert = mountAlert(type);
    const { icon, svg, box } = await alertIcon(alert);

    expect(icon.props()).toMatchObject({ name, size: "xs", defaultColor: false });
    expect(svg.getAttribute("width")).toBe("16");
    expect(svg.classList).toContain(tone);
    expect(svg.classList).not.toContain("fill-icon-default");
    expect([...box.classList]).toEqual(expect.arrayContaining(["h-5", "shrink-0", "items-center"]));
    expect(box.classList).not.toContain("h-5.5");
  });

  it.each([undefined, "Position opening"])("aligns the alert to its top with 8px gaps (title %j)", (title) => {
    const classes = mountAlert(AlertType.info, title).element.classList;

    expect([...classes]).toEqual(expect.arrayContaining(["items-start", "gap-2"]));
    expect(classes).not.toContain("items-center");
  });

  it("draws no icon-font chip", () => {
    for (const [type] of ICONS) {
      expect(mountAlert(type, "Position opening").findAll("i.icon")).toHaveLength(0);
      wrapper?.unmount();
      wrapper = null;
    }
  });
});
