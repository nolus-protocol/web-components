import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ProposalVotingLine from "./ProposalVotingLine.vue";
import type { FinalTallyResult } from "./types";

const labels = { yes_count: "Yes", abstain_count: "Abstain", no_count: "No", no_with_veto_count: "Veto" };

const rendered = (voting: FinalTallyResult) =>
  mount(ProposalVotingLine, { props: { voting, labels } }).text().replace(/\s+/g, " ");

describe("ProposalVotingLine", () => {
  it("shows one segment per non-zero tally with its share, last tally first", () => {
    expect(rendered({ yes_count: "60", abstain_count: "0", no_count: "30", no_with_veto_count: "10" })).toBe(
      "Veto 10.00% No 30.00% Yes 60.00%"
    );
  });

  it("skips a tally key it has no colour for instead of failing to render", () => {
    const withUnknownKey = {
      yes_count: "40",
      abstain_count: "0",
      no_count: "40",
      no_with_veto_count: "0",
      spam_count: "20"
    };

    expect(rendered(withUnknownKey)).toBe("No 40.00% Yes 40.00%");
  });
});
