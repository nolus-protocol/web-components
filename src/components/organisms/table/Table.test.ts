import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { h } from "vue";

import Button from "../../atoms/button/Button.vue";
import Table from "./Table.vue";
import TableSettings from "./TableSettings.vue";
import type { TableProps } from "./types";

let wrapper: VueWrapper | null = null;

afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
});

const headerActions = () => [
  h(Button, { label: "Deposit", severity: "primary", size: "large" }),
  h(Button, { label: "Withdraw", severity: "secondary", size: "large" })
];

function mountTable(props: TableProps, slots: Record<string, () => unknown> = {}) {
  wrapper = mount(Table, { props, slots });
  return wrapper;
}

function buttonByText(table: VueWrapper, text: string) {
  const button = table.findAll("button").find((candidate) => candidate.text() === text);
  if (!button) {
    throw new Error(`no button labelled ${text}`);
  }
  return button.element;
}

function actionsOf(table: VueWrapper) {
  const actions = buttonByText(table, "Deposit").parentElement;
  if (!actions?.parentElement) {
    throw new Error("header actions are not inside a header row");
  }
  return { actions, row: actions.parentElement };
}

describe("Table header actions", () => {
  it("renders inside the header row, after the search and before the table settings", () => {
    const table = mountTable(
      { searchable: true, size: "3 assets", toggle: { id: "small", label: "Show small balances", value: true } },
      { "header-actions": headerActions }
    );
    const { actions, row } = actionsOf(table);
    const settings = table.findComponent(TableSettings).findComponent(Button).element;
    const search = table.get('input[type="search"]').element;
    const children = Array.from(row.children);
    const searchGroup = children.findIndex((child) => child.contains(search));

    expect(Array.from(actions.children).map((button) => button.textContent?.trim())).toEqual(["Deposit", "Withdraw"]);
    expect(searchGroup).toBe(0);
    expect(children.indexOf(actions)).toBe(1);
    expect(children.indexOf(settings)).toBe(2);
  });

  it("shows the header when the actions are its only content", () => {
    const table = mountTable({}, { "header-actions": headerActions });

    expect(buttonByText(table, "Deposit")).toBeDefined();
    expect(buttonByText(table, "Withdraw")).toBeDefined();
  });

  it("puts the actions on their own equal-width line on phones and at the right end of the search row from md up, wrapping right-aligned when they do not fit", () => {
    const table = mountTable({ searchable: true }, { "header-actions": headerActions });
    const { actions, row } = actionsOf(table);
    const search = table.get('input[type="search"]').element;
    const searchGroup = Array.from(row.children).find((child) => child.contains(search));

    expect(Array.from(row.classList).sort()).toEqual(
      ["flex", "items-center", "justify-between", "gap-2", "flex-wrap", "gap-y-4", "md:justify-end"].sort()
    );
    expect(Array.from(searchGroup?.classList ?? []).sort()).toEqual(
      ["flex", "flex-1", "items-center", "gap-2", "md:flex-none", "md:mr-auto"].sort()
    );
    expect(Array.from(actions.classList).sort()).toEqual(
      [
        "order-last",
        "grid",
        "w-full",
        "grid-flow-col",
        "auto-cols-fr",
        "gap-2",
        "md:order-none",
        "md:ml-auto",
        "md:flex",
        "md:w-auto"
      ].sort()
    );
  });

  it("keeps the header classes passed by the consumer", () => {
    const table = mountTable({ searchable: true, headerClasses: "px-6" }, { "header-actions": headerActions });

    expect(actionsOf(table).row.classList).toContain("px-6");
  });
});

describe("Table without header actions", () => {
  it("renders the same markup as before the header-actions slot existed", () => {
    wrapper = mount(Table, {
      props: {
        searchable: true,
        size: "3 assets",
        headerClasses: "px-6",
        toggle: { id: "small", label: "Show small balances", value: true },
        hideValues: { text: "Hide values", value: false }
      },
      slots: { header: () => h("span", "Total value") },
      global: { stubs: { Input: true, TableSettings: true } }
    });

    // Markup captured before the slot existed. The <!--v-if--> before the settings is the slot wrapper's
    // v-if placeholder: a comment node, invisible to CSS and layout, and the only node the slot adds.
    expect(wrapper.html()).toBe(`<div class="flex flex-col gap-y-6">
  <div>
    <div class="flex items-center justify-between gap-2 px-6">
      <div class="flex flex-1 items-center gap-2 md:flex-none"><span>Total value</span>
        <input-stub id="dropdown-search" size="medium" type="search" error="false" disabled="false" valid="false" class="w-full md:w-96"></input-stub><span class="hidden text-14 font-normal md:block">3 assets</span>
      </div>
      <!--v-if-->
      <table-settings-stub toggle="[object Object]" hidevalues="[object Object]"></table-settings-stub>
    </div>
  </div>
  <div class="w-full">
    <div class="">
      <div class="scroll-bar overflow-auto">
        <div class="flex flex-col">
          <!--v-if-->
        </div>
      </div>
      <!--v-if-->
    </div>
  </div>
</div>`);
  });

  it("renders no header when nothing would go in it", () => {
    const table = mountTable({});

    expect(table.html()).toBe(`<div class="flex flex-col gap-y-6">
  <!--v-if-->
  <div class="w-full">
    <div class="">
      <div class="scroll-bar overflow-auto">
        <div class="flex flex-col">
          <!--v-if-->
        </div>
      </div>
      <!--v-if-->
    </div>
  </div>
</div>`);
  });
});
