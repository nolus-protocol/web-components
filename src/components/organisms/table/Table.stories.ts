import type { Meta, StoryObj } from "@storybook/vue3";
import { h } from "vue";

import Table from "./Table.vue";
import TableRow from "./TableRow.vue";
import Button from "../../atoms/button/Button.vue";
import { TableProps, TableRowItemProps } from "./types";
import type { LabelProps } from "../../atoms/label/types";
import { Label } from "../../index";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Organisms/Table",
  component: Table,
  parameters: {},
  args: {
    columns: [
      { label: "Column 1", tooltip: "Column 1 tooltip" },
      { label: "Column 2" },
      { label: "Column 3", tooltip: "Column 3 tooltip" }
    ]
  } // default value
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */

export const History: StoryObj<typeof meta> = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Table, TableRow },
    template: `
      <Table v-bind="args"
          @onSearchClear="
            (data) => {
              console.log(data);
          }"
          @hide-value="
            (data) => {
              console.info(data);
          }"
          @togle-value="
            (data) => {
              console.info(data);
          }"
      >
        <template v-slot:body>
          <TableRow
            v-for="(row, index) in args.historyData"
            :key="index"
            :items="row.items"
          />
        </template>
      </Table>
    `
  }),
  args: {
    columns: [{ label: "Transaction", variant: "left" }, { label: "Category" }, { label: "Time" }, { label: "Status" }],
    columnsClasses: "hidden md:flex",
    searchable: true,
    size: "123 assets",
    hideValues: { text: "Hide values", value: false },
    toggle: {
      label: "Show small balances",
      id: "1",
      value: true
    },
    historyData: Array.from({ length: 10 }).map((n, i) => ({
      items: [
        {
          value: `Collect tokens from lease position nolus1...kwjklf`,
          url: "https://google.com",
          variant: "left",
          bold: true,
          class: ""
        },
        { value: `Leases`, bold: true },
        { value: `15m ago` },
        { component: h<LabelProps>(Label, { value: "Complete", variant: "success" }) }
      ]
    }))
  } as TableProps & { historyData: TableRowItemProps[] }
};

export const Asset: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Table, TableRow, Button },
    template: `
      <Table
        v-bind="args"
        tableClasses="min-w-[1000px]"
      >
      <div>Test data</div>
      <template v-slot:body>
        <TableRow
          v-for="(row, index) in args.assetsData"
          :key="index"
          :items="row.items"
        />
      </template>
      </Table>
    `
  }),
  args: {
    columns: [
      { label: "Asset", variant: "left" },
      { label: "Price" },
      { label: "Balance" },
      { label: "Yield", tooltip: { position: "top", content: "Yield tooltip" } }
    ],
    assetsData: Array.from({ length: 10 }).map((n, i) => ({
      items: [
        {
          value: "Cosmos",
          subValue: "ATOM",
          image:
            "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/neutron-usdc.svg",
          variant: "left"
        },
        { value: "$43.23" },
        { value: "5.123", subValue: "$42.32" },
        { value: "5.96%", subValue: "+15.00% NLS", class: "text-typography-success" }
      ]
    })),
    searchable: true,
    size: "123 assets",
    toggle: {
      label: "Show small balances"
    }
  } as TableProps & { assetsData: TableRowItemProps[] }
};

export const EarningAssets: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Table, TableRow, Button },
    template: `
      <Table
        v-bind="args"
        @onSearchClear="
            (data) => {
              console.info(data);
          }"
      >
      <template v-slot:body>
        <TableRow
          v-for="(row, index) in args.assetsData"
          :key="index"
          :items="row.items"
          :rowButton="row.rowButton"
          @button-click="
            (data) => {
              console.info(data);
            }
          "
        />
      </template>
      </Table>
    `
  }),
  args: {
    searchable: true,
    size: "123 assets",
    columns: [
      { label: "Asset", variant: "left" },
      { label: "Deposit", tooltip: { content: "Deposit tooltip" } },
      { label: "Yield", tooltip: { content: "Deposit tooltip" } },
      { label: "Availability", tooltip: { content: "Deposit tooltip" } }
    ],
    assetsData: Array.from({ length: 10 }).map((n, i) => ({
      items: [
        {
          value: "Stride Stacked ATOM",
          subValue: "stATOM",
          image:
            "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/neutron-usdc.svg",
          variant: "left"
        },
        { value: "25", subValue: "$111.24" },
        {
          value: "0.10%",
          subValue: "+4.00% NLS",
          class: "text-typography-success"
        },
        {
          component: h<LabelProps>(Label, { value: "Complete", variant: "success" })
        }
      ],
      rowButton: { label: "Supply / Withdraw" }
    })),
    title: "Assets"
  } as TableProps & { assetsData: TableRowItemProps[] }
};
