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

    <!--    <Tooltip-->
    <!--      content="150%"-->
    <!--      position="bottom"-->
    <!--    >-->
    <!--      <div>Hover me</div>-->
    <!--    </Tooltip>-->
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
      type="search"
      @input="(e) => {}"
      @on-search-clear=""
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
      @actionButton="(e) => {}"
      :labels="{
        yes_count: `Yes`,
        abstain_count: 'Abstain',
        no_count: 'No',
        no_with_veto_count: 'Veto',
        turnoutLabel: 'turn out',
        quorumLabel: 'quorumLabel',
        votingEndsLabel: 'votingEndsLabel'
      }"
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
          @button-click="() => {}"
        />
      </template>
    </Table>

    <Lease
      v-bind="leaseProps"
      @on-collect="() => {}"
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
          token: { balance: '100', symbol: 'NLS' },
          meta: () => h('div', `Osmosis > Nolus (#ac34aadf) Nolus`)
        },
        {
          label: 'Transfer',
          icon: `${iconsExternalUrl}/osmosis-atom.svg`,
          token: { balance: '100', symbol: 'NLS' }
        },
        { label: 'Transfer', icon: `${iconsExternalUrl}/osmosis-atom.svg`, token: { balance: '100', symbol: 'NLS' } }
      ]"
      :variant="StepperVariant.MEDIUM"
    />

    <Button
      ref="popoverParent"
      class="h-10 w-10 rounded-full !p-0"
      icon="bell"
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

    <Dialog
      ref="dialogRef"
      :tabs="[{ label: '1' }, { label: '2' }, { label: '3' }]"
      title="Test"
      showClose
      :activeTabIndex="Number(0)"
    >
      <template #tab-content-0>
        <p class="text-typography-default">Child Component 1</p>
        <p>
          What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
          has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
          type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
          into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release
          of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum. Why do we use it? It is a long established fact that a
          reader will be distracted by the readable content of a page when looking at its layout. The point of using
          Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here,
          content here', making it look like readable English. Many desktop publishing packages and web page editors now
          use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still
          in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose
          (injected humour and the like). Where does it come from? Contrary to popular belief, Lorem Ipsum is not simply
          random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
          Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
          Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical
          literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de
          Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a
          treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem
          ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since
          the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et
          Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the
          1914 translation by H. Rackham.
        </p>
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
      <template #tab-content-1>
        <p class="text-typography-default">Child Component 2</p>
        <p>
          What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
          has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
          type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
          into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release
          of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum. Why do we use it? It is a long established fact that a
          reader will be distracted by the readable content of a page when looking at its layout. The point of using
          Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here,
          content here', making it look like readable English. Many desktop publishing packages and web page editors now
          use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still
          in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose
          (injected humour and the like). Where does it come from? Contrary to popular belief, Lorem Ipsum is not simply
          random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
          Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
          Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical
          literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de
          Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a
          treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem
          ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since
          the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et
          Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the
          1914 translation by H. Rackham.
        </p>
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
      <template #tab-content-2>
        <p class="text-typography-default">Child Component 3</p>
        <p>
          What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
          has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
          type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
          into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release
          of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum. Why do we use it? It is a long established fact that a
          reader will be distracted by the readable content of a page when looking at its layout. The point of using
          Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here,
          content here', making it look like readable English. Many desktop publishing packages and web page editors now
          use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still
          in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose
          (injected humour and the like). Where does it come from? Contrary to popular belief, Lorem Ipsum is not simply
          random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
          Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
          Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical
          literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de
          Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a
          treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem
          ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since
          the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et
          Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the
          1914 translation by H. Rackham.
        </p>
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

    <Slider
      :min-position="25"
      :max-position="150"
      :positions="5"
      :value="20"
      @on-drag="(p) => console.log(p)"
    />

    <Slider
      :value="20"
      class="mt-10"
      :min-position="0"
      :max-position="100"
      :mid-position="30"
      :label-mid="'$25.00'"
      :label-left="'$0.00'"
      :label-right="'$100.00'"
      @on-drag="(p) => console.log(p)"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  Alert,
  AssetItem,
  Button,
  Dialog,
  Dropdown,
  Input,
  Label,
  Lease,
  Popover,
  Proposal,
  Slider,
  Stepper,
  SvgIcon,
  Table,
  TableRow,
  Toggle
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
import { h, ref } from "vue";
import { iconsExternalUrl } from "@/shared/utils/types";
import type { TableColumnProps, TableRowItemProps } from "@/components/organisms/table/types";

const isOpen = ref(false);
const popoverParent = ref<HTMLElement>();
const dialogRef = ref<typeof Dialog | null>(null);

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
    { button: { icon: "assets" }, content: "Some content 1" },
    { button: { icon: "assets" }, content: "Some content 2" },
    { button: { icon: "assets" }, content: "Some content 3" }
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
