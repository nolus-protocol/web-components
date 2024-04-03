import type { Meta, StoryObj } from "@storybook/vue3";

import Table from "./Table.vue";
import HistoryTableRow from "../../molecules/table-rows/HistoryTableRow.vue";
import AssetsTableRow from "../../molecules/table-rows/AssetsTableRow.vue";
import EarningAssetsTableRow from "../../molecules/table-rows/EarningAssetsTableRow.vue";
import Button from "../../atoms/button/Button.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Organisms/Table",
  component: Table,
  argTypes: {
    "onClose-modal": { action: "close" }
  },
  parameters: {},
  args: {
    title: "Table title",
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
export const History: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Table, HistoryTableRow },
    template: `
      <Table
        v-bind="args"
      >
        <template v-slot:body>
          <HistoryTableRow
            v-for="(row, index) in args.historyData"
            :key="index"
            :items="row.items"
          />
        </template>
      </Table>
    `
  }),
  args: {
    title: "History",
    columns: [
      { label: "Tx hash" },
      { label: "Action", tooltip: "Action tooltip" },
      { label: "Fee" },
      { label: "Time" }
    ],
    historyData: Array.from({ length: 10 }).map((n, i) => ({
      items: [
        { value: `0x123-${i}`, url: "https://google.com" },
        { value: `Swap-${i}`, bold: true },
        { value: `0.0001-${i}` },
        { value: `12:00-${i}` }
      ]
    })),
    class: "p-4 md:p-6",
    columnsClasses: "hidden md:flex"
  }
};

export const Asset: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Table, AssetsTableRow, Button },
    template: `
      <Table
        v-bind="args"
      >
      <template v-slot:header>Search or button</template>
      <template v-slot:body>
        <AssetsTableRow
          v-for="(row, index) in args.assetsData"
          :id="row.id"
          :key="index"
          :items="row.items"
          @button-click="
            (data) => {
              console.info(data);
            }
          "
        />
      </template>

      <template v-slot:footer
        ><Button
          label="Show Small Balances"
          severity="secondary"
          size="medium"
          @click="
            () => {
              console.info('dsadsadasdadsada');
            }
          "
      /></template>
      </Table>
    `
  }),
  args: {
    columns: [
      { label: "Asset" },
      { label: "balance" },
      { label: "yield", tooltip: "Yield tooltip", class: "hidden md:flex" },
      { label: "lease up to", tooltip: "Lease up to tooltip", class: "hidden md:flex" },
      { label: "receive/send" }
    ],
    assetsData: Array.from({ length: 10 }).map((n, i) => ({
      id: i,
      items: [
        {
          value: "BTC",
          subValue: "$29,836.42",
          image:
            "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/neutron-usdc.svg"
        },
        { value: "32,430.22", subValue: "$222,000.00" },
        { value: "-", class: "hidden md:flex" },
        { value: "32,430.22", class: "hidden md:flex" },
        { value: "", button: true }
      ]
    })),
    class: "p-4 md:p-6",
    footerClasses: "flex justify-center",
    title: "Assets"
  }
};

export const EarningAssets: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Table, EarningAssetsTableRow, Button },
    template: `
      <Table
        v-bind="args"
      >
      <template v-slot:body>
        <EarningAssetsTableRow
          v-for="(row, index) in args.assetsData"
          :id="row.id"
          :key="index"
          :items="row.items"
          @button-click="
            (data) => {
              console.info(data);
            }
          "
        />
      </template>

      <template v-slot:footer
        ><Button
          label="Show Small Balances"
          severity="secondary"
          size="medium"
          @click="
            () => {
              console.info('dsadsadasdadsada');
            }
          "
      /></template>
      </Table>
    `
  }),
  args: {
    columns: [
      { label: "Asset" },
      { label: "Deposit", tooltip: "Deposit tooltip", class: "hidden md:flex" },
      { label: "yield" }
    ],
    assetsData: Array.from({ length: 10 }).map((n, i) => ({
      id: i,
      items: [
        {
          value: "BTC",
          valueInfo: "compounding",
          image:
            "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/neutron-usdc.svg"
        },
        { value: "32,430.22", subValue: "$222,000.00", class: "hidden md:flex" },
        { value: "16.24%", subValue: "+15.00% NLS", class: "text-success-100", button: { label: "Supply / Withdraw" } }
      ]
    })),
    class: "p-4 md:p-6",
    footerClasses: "flex justify-center",
    title: "Assets"
  }
};
