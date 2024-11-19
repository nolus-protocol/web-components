<template>
  <div class="m-auto mt-20 flex h-full max-w-[1000px] flex-col gap-4 pb-20">
    <Button
      label="test"
      severity="primary"
      size="large"
      @click="() => {}"
    />
    <Toggle
      id="nolus-toggle"
      @input="(value) => {}"
    />
    <Label
      value="Label"
      variant="secondary"
    />
    <Button
      label="test"
      severity="secondary"
      size="large"
      @click="() => {}"
    />
    <Alert
      :on-close="() => {}"
      :show-close="true"
      :type="AlertType.warning"
    >
      <template v-slot:content>
        <span>Alert content</span>
      </template>
    </Alert>

    <Tooltip
      content="150%"
      position="bottom"
    >
      <div>Hover me</div>
    </Tooltip>
    <Alert
      :on-close="() => {}"
      :show-close="true"
      :type="AlertType.error"
    >
      <template v-slot:content>
        <span>Alert content</span>
      </template>
    </Alert>
    <Dropdown
      :item-template="(item: any) => h<AssetItemProps>(AssetItem, { name: item.label, ...item })"
      :items-headline="['Asset', 'Your balance']"
      :on-select="(data) => {}"
      :options="options2"
      dropdown-label="Select token"
      searchable
    />
    <Button
      label="Secondary button"
      severity="secondary"
      size="large"
    />

    <Input
      id="test-input"
      label="Test Input"
      type="text"
      @input="(e) => {}"
    />

    <CurrencyField
      id="test"
      :balance="{ label: 'Test', value: '3123123', ticker: 'USDT' }"
      :calculated-balance="'$0'"
      :currency-options="options"
      label="Test1"
      placeholder="0"
      @input="(value) => {}"
      @on-selected-currency="(option) => {}"
    />

    <MultilineCurrencyField
      id="multiline"
      :balance="{ label: 'Test', value: '3123123', ticker: 'USDT' }"
      :currency-options="options"
      :on-swap="(e) => {}"
      placeholder="0"
      @on-first-change="(value) => {}"
      @on-second-change="(value) => {}"
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
      @vote="(e) => {}"
    />

    <Table :columns="columns">
      <template v-slot:body>
        <TableRow
          v-for="(row, index) in historyData"
          :key="index"
          :items="row.items"
        />
      </template>
    </Table>

    <Table :columns="assetsColumns">
      <template v-slot:body>
        <TableRow
          v-for="(row, index) in assetsData"
          :key="index"
          :items="row.items"
          :rowButton="row.rowButton"
          @button-click="(data) => {}"
        />
      </template>
    </Table>

    <Lease
      v-bind="leaseProps"
      @on-collect="(data) => {}"
    />

    <Stepper
      :active-step="1"
      :steps="[
        { label: 'Step 1', icon: `${iconsExternalUrl}/osmosis-nls.svg` },
        { label: 'Step 1', icon: `${iconsExternalUrl}/osmosis-nls.svg`, approval: true },
        { label: 'Step 1', icon: `${iconsExternalUrl}/osmosis-nls.svg` }
      ]"
      :variant="StepperVariant.SMALL"
    />
    <Stepper
      :active-step="1"
      :steps="[
        {
          label: 'Transfer',
          icon: `${iconsExternalUrl}/osmosis-nls.svg`,
          token: { balance: 100, symbol: 'NLS' },
          meta: () => h('div', `Osmosis > Nolus (#ac34aadf) Nolus`)
        },
        {
          label: 'Transfer',
          icon: `${iconsExternalUrl}/osmosis-atom.svg`,
          token: { balance: 100, symbol: 'NLS' }
        },
        { label: 'Transfer', icon: `${iconsExternalUrl}/osmosis-atom.svg`, token: { balance: 100, symbol: 'NLS' } }
      ]"
      :variant="StepperVariant.MEDIUM"
    />

    <Button
      ref="popoverParent"
      class="h-10 w-10 rounded-full !p-0"
      icon="icon-bell text-[20px]"
      severity="secondary"
      size="small"
      @click="
        () => {
          isOpen = !isOpen;
        }
      "
    ></Button>

    <Popover
      v-if="isOpen"
      :parent="popoverParent"
      position="top-left"
      title="Test"
      @close="
        () => {
          isOpen = !isOpen;
        }
      "
    >
      <template #footer>
        <Button
          label="Close"
          severity="secondary"
          size="small"
          @click="
            () => {
              isOpen = !isOpen;
            }
          "
        ></Button>
      </template>
    </Popover>

    <Button
      label="Show Dialog"
      severity="secondary"
      size="large"
      @click="
        () => {
          dialogRef?.show();
        }
      "
    ></Button>

    <Dialog ref="dialogRef">
      <template #content>
        <p class="text-typography-default">Child Component</p>
      </template>
      <template #footer>
        <Button
          label="Close"
          severity="secondary"
          size="small"
          @click="
            () => {
              dialogRef?.close();
            }
          "
        ></Button>
      </template>
    </Dialog>

    <SvgIcon
      class="fill-icon-error"
      name="slider"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  Alert,
  AssetItem,
  Button,
  CurrencyField,
  Dialog,
  Dropdown,
  Input,
  Label,
  Lease,
  MultilineCurrencyField,
  Popover,
  Proposal,
  Stepper,
  SvgIcon,
  Table,
  TableRow,
  Toggle,
  Tooltip
} from "@/components";
import {
  AlertType,
  type AssetItemProps,
  type DropdownOption,
  type LabelProps,
  LeasePnlStatus,
  type LeaseProps,
  LeaseStatus,
  ProposalStatus,
  StepperVariant
} from "./components/types";
import { h, onMounted, ref } from "vue";
import { iconsExternalUrl } from "@/shared/utils/types";
import type { TableColumnProps, TableRowItemProps } from "@/components/organisms/table/types";

const isOpen = ref(false);
const popoverParent = ref<HTMLElement>();
const dialogRef = ref<typeof Dialog | null>(null);

onMounted(() => {
  console.info({ popoverParent });
});

const columns: TableColumnProps[] = [
  { label: "Transaction", variant: "left" },
  { label: "Category" },
  { label: "Time" },
  { label: "Status" }
];

const historyData: TableRowItemProps[] = [
  {
    items: [
      {
        value: `Collect tokens from lease position nolus1...kwjklf`,
        url: "https://google.com",
        variant: "left",
        class: "font-semibold"
      },
      { value: `Leases` },
      { value: `15m ago` },
      { component: h<LabelProps>(Label, { value: "Complete", variant: "success" }) }
    ]
  }
];

const assetsColumns: TableColumnProps[] = [
  { label: "Asset", variant: "left" },
  { label: "Price" },
  { label: "Balance" },
  { label: "Yield", tooltip: { position: "top", content: "Yield tooltip" } }
];

const assetsData: TableRowItemProps[] = [
  {
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
    ],
    rowButton: { label: "Deposit" }
  }
];

interface OptionsProps extends DropdownOption {
  abbreviation: string;
  balance: string;
  price: string;
}

const options2: OptionsProps[] = [
  {
    value: "nolus",
    label: "Nolus",
    abbreviation: "NLS",
    icon: `${iconsExternalUrl}/osmosis-nls.svg`,
    balance: "1.234",
    price: "$123"
  },
  {
    value: "osmosis",
    abbreviation: "OSMO",
    label: "Osmosis",
    icon: `${iconsExternalUrl}/osmosis-osmo.svg`,
    balance: "1.234",
    price: "$123"
  },
  {
    value: "cosmos",
    abbreviation: "ATOM",
    label: "Cosmos",
    icon: `${iconsExternalUrl}/osmosis-atom.svg`,
    balance: "1.234",
    price: "$123"
  },
  {
    value: "stOSMO",
    abbreviation: "stOSMO",
    label: "Stride Staked Osmo",
    icon: `${iconsExternalUrl}/osmosis-stosmo.svg`,
    balance: "1.234",
    price: "$123"
  },
  {
    value: "stATOM",
    abbreviation: "stATOM",
    label: "Stride Staked Atom",
    icon: `${iconsExternalUrl}/osmosis-statom.svg`,
    balance: "1.234",
    price: "$123"
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
  { value: "watermelon", label: "Watermelon" },
  { value: "watermelon", label: "Watermelon" },
  { value: "watermelon", label: "Watermelon" },
  { value: "watermelon", label: "Watermelon" }
];

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
