<template>
  <Widget class="!gap-0 !p-0">
    <div class="flex flex-col gap-y-6 p-6 pb-4">
      <div class="flex flex-col gap-y-3">
        <div class="text-20 font-semibold text-neutral-bg-inverted-1">&#35;{{ id }} {{ title }}</div>
        <Label
          :variant="variant.type as LabelProps['variant']"
          class="flex items-center gap-1"
        >
          <SvgIcon
            :class="variant.class"
            :name="variant.icon"
            size="xs"
          />
          <span>{{ variant.status }}</span>
        </Label>
      </div>
      <hr class="border-border-color" />
      <div
        v-if="isVotingPeriod"
        class="flex flex-col gap-y-3"
      >
        <div class="flex gap-3">
          <div>
            <span class="block text-14">Turnout</span>
            <span class="text-16 font-semibold text-typography-default">{{ turnout }}</span>
          </div>
          <div>
            <span class="block text-14">Quorum</span>
            <span class="text-16 font-semibold text-typography-default">{{ quorum }}</span>
          </div>
          <div>
            <span class="block text-14">Voting ends</span>
            <span class="text-16 font-semibold text-typography-default">{{ voting_end_time }}</span>
          </div>
        </div>

        <ProposalVotingLine
          v-if="isVotingPeriod && tally && Object.values(tally).filter((res) => !!Number(res)).length > 0"
          :voting="tally"
        />
      </div>
      <div
        v-if="isHtml(summary)"
        class="prose prose-h1:mb-2 prose-h1:text-lg prose-h1:font-medium prose-h2:my-1 prose-h2:text-lg prose-h2:font-medium text-16 font-normal"
        v-html="summary"
      ></div>
      <div
        v-else
        class="prose prose-h1:mb-2 prose-h1:text-lg prose-h1:font-medium prose-h2:my-1 prose-h2:text-lg prose-h2:font-medium text-16 font-normal"
      >
        {{ summary }}
      </div>
    </div>
    <div
      v-if="(summary && summary.length > 156) || isVotingPeriod"
      class="flex justify-center rounded-b-xl border-t border-border-color bg-neutral-bg-1 p-3"
    >
      <Button
        v-if="summary && summary.length > 156 && !isVotingPeriod"
        :label="readMoreButtonText"
        class="w-full"
        severity="tertiary"
        size="medium"
        @click="$emit('actionButton', props)"
      />
      <Button
        v-if="isVotingPeriod"
        :label="voteButtonText"
        class="w-full"
        severity="tertiary"
        size="medium"
        @click="$emit('actionButton', props)"
      />
    </div>
  </Widget>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { type ProposalEmits, ProposalStatus, type ProposalType } from "./types";
import type { LabelProps } from "@/components/atoms/label/types";

import ProposalVotingLine from "./ProposalVotingLine.vue";
import { Button, Label, SvgIcon, Widget } from "@/components";

const props = defineProps<ProposalType>();

const isVotingPeriod = computed(() => {
  return props.status === ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD;
});

const variant = computed(() => {
  let status = ProposalStatus[props.status]?.split("_")[2].toLowerCase();
  status = status.charAt(0).toUpperCase() + status.slice(1);

  switch (props.status) {
    case ProposalStatus.PROPOSAL_STATUS_PASSED:
      return { status, icon: "check", class: "!fill-success-emphasized", type: "success" };
    case ProposalStatus.PROPOSAL_STATUS_REJECTED:
    case ProposalStatus.PROPOSAL_STATUS_FAILED:
      return { status, icon: "close", class: "!fill-error-emphasized", type: "error" };
    case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD:
      return { status, icon: "hourglass", class: "!fill-warning-emphasized", type: "warning" };
    default:
      return { status, icon: "info", class: "!fill-icon-emphasized", type: "info" };
  }
});

const isHtml = (str: string) => {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
};

defineEmits<ProposalEmits>();
</script>

<style lang="" scoped></style>
