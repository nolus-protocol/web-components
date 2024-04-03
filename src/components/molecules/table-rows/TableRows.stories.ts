import type { Meta, StoryObj } from "@storybook/vue3";

import HistoryTableRowComponent from "./HistoryTableRow.vue";
import AssetsTableRowComponent from "./AssetsTableRow.vue";
import EarningAssetsTableRowComponent from "./EarningAssetsTableRow.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Molecules/TableRows",
  // component: Table,
  argTypes: {
    "onClose-modal": { action: "close" }
  },
  parameters: {},
  args: {} // default value
} satisfies Meta;

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
    components: { HistoryTableRowComponent },
    template: `<HistoryTableRowComponent v-for="(row, index) in args.historyData"
            :key="index"
            :items="row.items" />`
  }),
  args: {
    historyData: Array.from({ length: 1 }).map((n, i) => ({
      items: [
        { value: `0x123-${i}`, url: "https://google.com" },
        { value: `Swap-${i}`, bold: true },
        { value: `0.0001-${i}` },
        { value: `12:00-${i}` }
      ]
    }))
  }
};
export const Assets: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { AssetsTableRowComponent },
    template: `<AssetsTableRowComponent v-for="(row, index) in args.assetsData"
            :id="row.id"
            :key="index"
            :items="row.items"
            @button-click="
              (data) => {
                console.info(data);
              }"
        />`
  }),
  args: {
    assetsData: Array.from({ length: 1 }).map((n, i) => ({
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
    }))
  }
};
export const Earning: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { EarningAssetsTableRowComponent },
    template: `
        <EarningAssetsTableRowComponent v-for="(row, index) in args.assetsData"
            :id="row.id"
            :key="index"
            :items="row.items"
            @button-click="
              (data) => {
                console.info(data);
              }"
        />`
  }),
  args: {
    assetsData: Array.from({ length: 1 }).map((n, i) => ({
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
    }))
  }
};
