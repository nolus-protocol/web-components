<template>
  <div class="m-auto mt-20 flex h-full max-w-[1000px] flex-col gap-4 pb-20">
    <Button
      label="test"
      severity="primary"
      size="large"
      @click="
        () => {
          console.info('dsadsadasdadsada');
        }
      "
    />
    <NotificationButton />
    <Close class="" />
    <Dropdown
      :on-select="onSelect"
      :options="options"
    />
    <Dropdown
      :on-select="
        (option) => {
          console.info(option);
        }
      "
      :options="options"
    />
    <Button
      label="Secondary button"
      severity="secondary"
      size="large"
    />

    <Input
      id="test-input"
      :on-change="
        (e) => {
          console.info((e.target as HTMLInputElement).value);
        }
      "
      type="text"
    />

    <CurrencyField
      id="test"
      :balance="{ label: 'Test', value: '3123123', ticker: 'USDT' }"
      :calculated-balance="'$0'"
      :currency-options="options"
      label="Test1"
      placeholder="0"
      @input="
        (value) => {
          console.info(value);
        }
      "
      @on-selected-currency="
        (option) => {
          console.info(option);
        }
      "
    />

    <MultilineCurrencyField
      id="multiline"
      :balance="{ label: 'Test', value: '3123123', ticker: 'USDT' }"
      :currency-options="options"
      :on-swap="
        (e) => {
          console.info('swap', e);
        }
      "
      placeholder="0"
      @on-first-change="
        (value) => {
          console.info(value);
        }
      "
      @on-second-change="
        (value) => {
          console.info(value);
        }
      "
    />
    <Proposal
      id="12"
      :status="ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD"
      :tally="{ yes_count: '100', abstain_count: '50', no_count: '25', no_with_veto_count: '10' }"
      :voted="false"
      quorum="60%"
      read-more-button-text="Read more"
      summary="This proposal aims to introduce several new assets to the Oracle swap tree of the Neutron axlUSDC protocol. Neutron axlUSDC protocol. Neutron axlUSDC protoc..."
      title="Test"
      turnout="75%"
      voteButtonText="Vote now"
      voting_end_time="24-05-2024"
      @vote="
        (e) => {
          console.info(e);
        }
      "
    />

    <Table
      :columns="columns"
      class="p-4 md:p-6"
      columnsClasses="hidden md:flex"
      title="History"
    >
      <template v-slot:body>
        <HistoryTableRow
          v-for="(row, index) in historyData"
          :key="index"
          :items="row.items"
        />
      </template>
    </Table>

    <Table
      :columns="assetsColumns"
      class="p-4 md:p-6"
      footerClasses="flex justify-center"
      title="Assets"
    >
      <template v-slot:header>Search or button</template>
      <template v-slot:body>
        <EarningAssetsTableRow
          v-for="(row, index) in assetsData"
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

    <Lease
      v-bind="leaseProps"
      @on-collect="
        (data) => {
          console.info(data);
        }
      "
    />
  </div>
</template>

<script lang="ts" setup>
import {
  Button,
  Close,
  CurrencyField,
  Dropdown,
  EarningAssetsTableRow,
  HistoryTableRow,
  Input,
  Lease,
  MultilineCurrencyField,
  NotificationButton,
  Proposal,
  Table
} from "@/components";
import {
  type EarningAssetsTableRowItemProps,
  type HistoryTableRowItemProps,
  LeasePnlStatus,
  type LeaseProps,
  LeaseStatus,
  ProposalStatus
} from "./components/types";

const columns = [
  { label: "Tx hash" },
  { label: "Action", tooltip: "Action tooltip" },
  { label: "Fee" },
  { label: "Time" }
];

const assetsColumns = [
  { label: "Asset" },
  { label: "balance", class: "hidden md:flex" },
  { label: "yield", tooltip: "Yield tooltip" },
  { label: "lease up to", tooltip: "Lease up to tooltip" },
  { label: "receive/send", class: "hidden md:flex" }
];

const historyData: HistoryTableRowItemProps[] = [
  {
    items: [
      { value: "0x123", url: "https://google.com" },
      { value: "Swap", bold: true },
      { value: "0.0001" },
      { value: "12:00" }
    ]
  }
];

const assetsData: EarningAssetsTableRowItemProps[] = [
  {
    items: [
      {
        value: "BTC",
        subValue: "$29,836.42",
        image:
          "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/neutron-usdc.svg"
      },
      { value: "32,430.22", subValue: "$222,000.00", class: "hidden md:flex" },
      { value: "-" },
      { value: "32,430.22" },
      { value: "" }
    ],
    rowButton: { label: "Deposit" }
  }
];

const options = [
  {
    value: "apple",
    label: "Apple",
    icon: "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/osmosis-usdc.svg",
    price: "31231312"
  },
  {
    value: "banana",
    label: "Banana",
    icon: "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/osmosis-usdc.svg"
  },
  {
    value: "orange",
    label: "Orange",
    icon: "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/osmosis-usdc.svg"
  },
  {
    value: "grape",
    label: "Grape",
    icon: "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/osmosis-usdc.svg"
  },
  {
    value: "strawberry",
    label: "Strawberry",
    icon: "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/osmosis-usdc.svg"
  },
  { value: "watermelon", label: "Watermelon" }
];

const onSelect = (option: any) => {
  console.info(option);
};

const leaseProps: LeaseProps = {
  history: {
    click() {
      console.info("clicked");
    },
    value: "#daeqw21e"
  },
  title: "Buy position",
  share: {
    label: "Share Position"
  },
  status: LeaseStatus.PAID,
  tabs: [
    { button: { icon: "icon-assets" }, content: "Some content 1" },
    { button: { icon: "icon-assets" }, content: "Some content 2" },
    { button: { icon: "icon-assets" }, content: "Some content 3" }
  ],
  actionButtons: {
    repay: { label: "Repay" },
    close: { label: "Close" },
    collect: { label: "Collect" }
  },
  progressBar: {
    title: "Health",
    value: ["66"]
  },
  progressDate: {
    title: "Opened on",
    value: "FEB. 8, 2024"
  },
  pnl: {
    click() {
      console.info("clicked");
    },
    value: "-$20.00",
    status: LeasePnlStatus.POSITIVE
  }
};
</script>

<style scoped></style>
