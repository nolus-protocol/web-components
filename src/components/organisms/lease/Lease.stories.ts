import type { Meta, StoryObj } from "@storybook/vue3";

import Lease from "./Lease.vue";
import { LeasePnlStatus, LeaseStatus } from "@/components/organisms/lease/types";

const meta = {
  title: "Components/Organisms/Lease",
  component: Lease,
  argTypes: {},
  parameters: {},
  args: {
    title: "Buy position",
    pnl: {
      value: "$00.00",
      status: LeasePnlStatus.NEUTRAL
    },
    share: {
      label: "Share Position"
    },
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
    progressBarTitle: "Opening",
    progressDateTitle: "Opened on",
    progressDate: "Opening...",
    debt: {
      title: "Debt",
      value: "$00.00",
      class: "bg-neutral-100 rounded-md text-transparent"
    },
    interest: {
      title: "Interest",
      value: "2.02%"
    },
    interestDue: {
      title: "Due",
      value: "$00.00",
      class: "text-warning-100"
    }
  } // default value
} satisfies Meta<typeof Lease>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Opening: Story = {
  args: {
    status: LeaseStatus.OPENING,
    debt: {
      title: "Debt",
      value: "$00.00",
      class: "bg-neutral-100 rounded-md text-transparent"
    },
    interest: {
      title: "Interest",
      value: "2.02%",
      class: "line-through"
    },
    interestDue: {
      title: "Due",
      value: "$00.00",
      class: "bg-neutral-100 rounded-md text-transparent"
    }
  }
};
export const Opened: Story = {
  args: {
    status: LeaseStatus.OPENED,
    progressBarTitle: "Health",
    progressDate: "FEB. 8, 2024",
    margin: 81,
    pnl: {
      value: "+$20.00",
      status: LeasePnlStatus.POSITIVE
    }
  }
};
export const Collect: Story = {
  args: {
    status: LeaseStatus.COLLECT,
    progressBarTitle: "Health",
    progressDate: "FEB. 8, 2024",
    margin: 66,
    pnl: {
      value: "-$20.00",
      status: LeasePnlStatus.POSITIVE
    }
  }
};
