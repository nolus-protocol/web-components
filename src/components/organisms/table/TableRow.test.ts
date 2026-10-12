import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";

import TableRow from "./TableRow.vue";
import type { TableRowItem } from "./types";

let wrapper: VueWrapper | null = null;

afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
});

function mountRow(item: TableRowItem) {
  wrapper = mount(TableRow, { props: { items: [{ value: "Cosmos", subValue: "ATOM", ...item }] } });
  return wrapper;
}

function subValueOf(row: VueWrapper) {
  const subValue = row.findAll("div").find((candidate) => candidate.text() === "ATOM");
  if (!subValue) {
    throw new Error("no sub-value rendered");
  }
  return subValue.element.classList;
}

describe("TableRow", () => {
  it("marks its root as a body row and puts 24px between its cells", () => {
    const classes = mountRow({}).element.classList;

    expect(classes).toContain("table-body-row");
    expect(classes).toContain("gap-x-6");
  });

  it("renders the sub-value at 14px in the secondary colour by default", () => {
    const classes = subValueOf(mountRow({}));

    expect(classes).toContain("text-14");
    expect(classes).not.toContain("text-12");
    expect(classes).toContain("text-typography-secondary");
  });

  it("uses a passed sub-value class instead of the secondary colour", () => {
    const classes = subValueOf(mountRow({ subValueClass: "text-typography-success" }));

    expect(classes).toContain("text-typography-success");
    expect(classes).not.toContain("text-typography-secondary");
  });

  it("falls back to the secondary colour when the passed sub-value class is empty", () => {
    expect(subValueOf(mountRow({ subValueClass: "" }))).toContain("text-typography-secondary");
  });
});
