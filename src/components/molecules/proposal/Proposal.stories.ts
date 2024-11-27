import type { Meta, StoryObj } from "@storybook/vue3";

import Proposal from "./Proposal.vue";
import { ProposalStatus } from "./types";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Molecules/Proposal",
  component: Proposal,
  argTypes: {},
  parameters: {},
  args: {
    id: "70",
    title: "Update Oracle Swap Tree (Astroport)",
    summaryTitle: "Summary",
    summary:
      "This proposal aims to introduce several new assets to the Oracle swap tree of the Neutron axlUSDC protocol.swap tree of the Neutron axlUSDC protocol swap tree of the Neutron axlUSDC protocol.swap tree of the Neutron axlUSDC protocol",
    readMoreButtonText: "Read More",
    voteButtonText: "Vote"
  } // default value
} satisfies Meta<typeof Proposal>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Voting: Story = {
  args: {
    status: ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD,
    voted: false,
    tally: {
      yes_count: "500",
      abstain_count: "10",
      no_count: "50",
      no_with_veto_count: "20"
    }
  }
};

export const Passed: Story = {
  args: {
    status: ProposalStatus.PROPOSAL_STATUS_PASSED,
    id: "1",
    title: "Title",
    summary: "summary",
    voted: false,
    readMoreButtonText: "read"
  }
};
