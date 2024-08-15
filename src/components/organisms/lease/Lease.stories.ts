import type { Meta, StoryObj } from "@storybook/vue3";

import Lease from "./Lease.vue";
import { LeaseOpeningBarStatuses, LeasePnlStatus, LeaseStatus } from "@/components/organisms/lease/types";

const meta = {
  title: "Components/Organisms/Lease",
  component: Lease,
  argTypes: {},
  parameters: {},
  args: {
    history: {
      value: "#dsaj3252"
    },
    title: { value: "Buy position" },
    pnl: {
      value: "$00.00",
      status: LeasePnlStatus.NEUTRAL
    },
    tabs: [
      { button: { icon: "icon-stats" }, content: "Some content 1" },
      { button: { icon: "icon-lease-1" }, content: "Some content 2" }
    ]
  } // default value
} satisfies Meta<typeof Lease>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Opening: Story = {
  args: {
    status: LeaseStatus.OPENING,
    progressBar: {
      title: "Opening",
      value: [LeaseOpeningBarStatuses.READY, LeaseOpeningBarStatuses.CURRENT, ""]
    },
    progressDate: {
      value: "Opening...",
      title: "Opened on"
    },
    debt: {
      title: "Debt",
      class: "mt-1 h-5 bg-neutral-100 rounded-md text-transparent"
    },
    interest: {
      title: "Interest",
      class: "mt-1 h-5 bg-neutral-100 rounded-md text-transparent"
    },
    interestDue: {
      title: "Due",
      class: "mt-1 h-5 bg-neutral-100 rounded-md text-transparent"
    },
    actionButtons: {
      repay: { label: "Repay" },
      close: { label: "Close" }
    }
  }
};
export const Opened: Story = {
  args: {
    share: {
      label: "Share Position"
    },
    status: LeaseStatus.OPENED,
    progressBar: {
      title: "Health",
      value: ["62"]
    },
    progressDate: {
      value: "FEB. 8, 2024",
      title: "Opened on"
    },
    pnl: {
      value: "+$20.00",
      status: LeasePnlStatus.POSITIVE
    },
    debt: {
      title: "Debt",
      value: "$00.00"
    },
    interest: {
      title: "Interest",
      value: "2.02%"
    },
    interestDue: {
      title: "Due",
      value: "$00.00",
      class: "text-warning-100"
    },
    actionButtons: {
      repay: { label: "Repay" },
      close: { label: "Close" }
    }
  }
};
export const Paid: Story = {
  args: {
    share: {
      label: "Share Position"
    },
    status: LeaseStatus.PAID,
    progressDate: {
      value: "FEB. 8, 2024",
      title: "Opened on"
    },
    pnl: {
      value: "-$20.00",
      status: LeasePnlStatus.POSITIVE
    },
    tabs: [
      { button: { icon: "icon-stats", disabled: true } },
      { button: { icon: "icon-lease-1" }, content: "Some content 2", active: true }
    ],
    actionButtons: {
      collect: { label: "Collect" }
    }
  }
};
