export enum ProposalStatus {
  PROPOSAL_STATUS_UNSPECIFIED = "PROPOSAL_STATUS_UNSPECIFIED",
  PROPOSAL_STATUS_DEPOSIT_PERIOD = "PROPOSAL_STATUS_DEPOSIT_PERIOD",
  PROPOSAL_STATUS_VOTING_PERIOD = "PROPOSAL_STATUS_VOTING_PERIOD",
  PROPOSAL_STATUS_PASSED = "PROPOSAL_STATUS_PASSED",
  PROPOSAL_STATUS_REJECTED = "PROPOSAL_STATUS_REJECTED",
  PROPOSAL_STATUS_FAILED = "PROPOSAL_STATUS_FAILED"
}

interface ProposalBase {
  id: string;
  title: string;
  summary: string;
  voted: boolean;
  readMoreButtonText: string;
}

export interface ProposalNotVoted extends ProposalBase {
  status: Exclude<ProposalStatus, ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD>;
  tally?: FinalTallyResult;
  voting_end_time?: string;
  quorum?: string;
  turnout?: string;
  voteButtonText?: string;
}

export interface ProposalVoted extends ProposalBase {
  status: ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD;
  tally: FinalTallyResult;
  voting_end_time: string;
  quorum: string;
  turnout: string;
  voteButtonText: string;
}

export type ProposalType = ProposalNotVoted | ProposalVoted;

export interface FinalTallyResult {
  yes_count: string;
  abstain_count: string;
  no_count: string;
  no_with_veto_count: string;
}

export interface ProposalEmits {
  (e: "vote", data: { id: string }): void;
  (e: "read-more", data: { title: string; summary: string }): void;
}
