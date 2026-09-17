import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ProposalVotingLine from "./ProposalVotingLine.vue";
import type { FinalTallyResult } from "./types";

const labels = { yes_count: "Yes", abstain_count: "Abstain", no_count: "No", no_with_veto_count: "Veto" };

function segments(voting: FinalTallyResult) {
  const wrapper = mount(ProposalVotingLine, { props: { voting, labels } });
  return wrapper.findAll(".relative").map((segment) => ({
    label: segment.find("span").text(),
    percent: segment.text().replace(segment.find("span").text(), "").trim(),
    coloured: segment.classes().some((name) => name.startsWith("bg-["))
  }));
}

describe("ProposalVotingLine", () => {
  it("draws one coloured segment per non-zero tally, last tally first", () => {
    expect(segments({ yes_count: "60", abstain_count: "0", no_count: "30", no_with_veto_count: "10" })).toEqual([
      { label: "Veto", percent: "10.00%", coloured: true },
      { label: "No", percent: "30.00%", coloured: true },
      { label: "Yes", percent: "60.00%", coloured: true }
    ]);
  });

  it("skips a tally key it has no colour for instead of failing to render", () => {
    const withUnknownKey = {
      yes_count: "50",
      abstain_count: "0",
      no_count: "50",
      no_with_veto_count: "0",
      spam_count: "10"
    };

    expect(segments(withUnknownKey).map((segment) => segment.label)).toEqual(["No", "Yes"]);
  });
});
