<template>
  <div class="shadow-lg flex w-full flex-col justify-between gap-y-5 overflow-clip rounded-xl bg-neutral-bg-50">
    <div class="flex items-start justify-between p-5 pb-0">
      <div
        class="basis-4/5 overflow-hidden break-words text-xl font-medium tracking-tight text-neutral-900 md:text-2xl dark:text-white"
      >
        &#35;{{ id }} {{ title }}
      </div>
      <div
        :class="{ [color.bg_parent]: color }"
        class="flex items-center gap-2 rounded-md px-3 py-1"
      >
        <div
          :class="{ [color.bg]: color }"
          class="h-2.5 w-2.5 rounded-full"
        />
        <div
          :class="{ [color.text]: color }"
          class="text-sm font-medium"
        >
          {{ ProposalStatus[status].split("_")[2] }}
        </div>
      </div>
    </div>
    <div
      v-if="isVotingPeriod"
      class="flex flex-col gap-y-4 border-b border-t px-5 py-4"
    >
      <div class="flex flex-col items-center justify-between gap-2 md:flex-row md:gap-0 dark:text-white">
        <div class="flex gap-4">
          <div>
            <span class="block text-sm">Turnout:</span> <span class="text-base font-medium">{{ turnout }}</span>
          </div>
          <div>
            <span class="block text-sm">Quorum:</span> <span class="text-base font-medium">{{ quorum }}</span>
          </div>
          <div>
            <span class="block text-sm">Voting ends:</span>
            <span class="text-base font-medium">{{ voting_end_time }}</span>
          </div>
        </div>
      </div>

      <ProposalVotingLine
        v-if="isVotingPeriod && tally && Object.values(tally).filter((res) => !!Number(res)).length > 0"
        :voting="tally"
      />
    </div>
    <div
      v-if="summary"
      class="px-5 text-neutral-900 dark:text-white"
    >
      <div
        class="prose prose-h1:mb-2 prose-h1:text-lg prose-h1:font-medium prose-h2:my-1 prose-h2:text-lg prose-h2:font-medium"
      >
        {{ summary }}
      </div>
    </div>
    <div class="border-t">
      <button
        v-if="summary && summary.length > 156"
        class="flex w-full items-center justify-center bg-neutral-50 p-3 text-sm font-medium transition-colors hover:bg-neutral-100 hover:text-neutral-800"
        @click="$emit('read-more', { title, summary })"
      >
        {{ readMoreButtonText }}
        <!-- <ChevronRightSmallIcon
          aria-hidden="true"
          class="h-5 w-5"
        /> -->
      </button>
      <button
        v-if="isVotingPeriod"
        class="flex w-full items-center justify-center bg-primary-50 p-3 text-sm font-medium text-white hover:bg-primary-100 active:bg-primary-200"
        @click="$emit('vote', { id })"
      >
        {{ voteButtonText }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { type ProposalEmits, ProposalStatus, type ProposalType } from "./types";

import ProposalVotingLine from "./ProposalVotingLine.vue";
import ChevronRightSmallIcon from "@/assets/icons/chevron-right-small.svg";

const props = defineProps<ProposalType>();

const color = computed(() => {
  switch (props.status) {
    case ProposalStatus.PROPOSAL_STATUS_PASSED:
      return { bg_parent: "bg-green-500/15", bg: "bg-green-500", text: "text-green-500" };
    case ProposalStatus.PROPOSAL_STATUS_REJECTED || ProposalStatus.PROPOSAL_STATUS_FAILED:
      return { bg_parent: "bg-blue-500/15", bg: "bg-blue-500", text: "text-blue-500" };
    case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD: {
      if (props.voted) {
        return { bg_parent: "", bg: "bg-dark-500", text: "text-dark-500" };
      }
      return { bg_parent: "bg-orange-400/15", bg: "bg-orange-400", text: "text-orange-400" };
    }
    default:
      return { bg_parent: "bg-neutral-500/15", bg: "bg-neutral-800", text: "text-neutral-800" };
  }
});

const isVotingPeriod = computed(() => {
  return props.status === ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD;
});

defineEmits<ProposalEmits>();
</script>

<style lang="" scoped></style>
