<template>
  <div
    class="flex w-full flex-col rounded-xl border-[1px] border-neutral-100 bg-neutral-bg-50 p-6 dark:border-border-color"
  >
    <div class="flex items-center justify-between">
      <div class="text-12 font-[600] uppercase text-neutral-400">{{ title }}</div>
      <Button
        v-if="share"
        v-bind="{ ...share, severity: 'secondary', size: 'small', icon: 'icon-share', iconPosition: 'left' }"
      />
    </div>
    <hr class="my-4 border-neutral-100 dark:border-border-color" />
    <div class="flex flex-col gap-6 lg:h-[150px] lg:flex-row">
      <div class="order-3 flex flex-row gap-2.5 lg:order-1 lg:flex-col">
        <Button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="[{ 'button-active': selectedTab === index }]"
          v-bind="{
            ...tab.button,
            disabled: status === LeaseStatus.OPENING,
            severity: 'secondary',
            size: 'medium'
          }"
          @click="selectedTab = index"
        />
      </div>
      <div class="order-1 flex flex-row justify-between lg:order-2 lg:flex-col lg:justify-normal lg:gap-3">
        <div class="flex flex-col gap-1">
          <div class="bg- text-12 font-medium text-neutral-400">PnL</div>
          <div
            :class="[
              {
                'bg-danger-100 text-white': pnl.status === LeasePnlStatus.NEGATIVE,
                'bg-success-100 text-white': pnl.status === LeasePnlStatus.POSITIVE
              }
            ]"
            class="flex items-center gap-1.5 rounded bg-neutral-100 p-2 text-12 font-medium text-neutral-400"
          >
            <template v-if="pnl.status === LeasePnlStatus.POSITIVE">
              <ArrowUp />
            </template>
            <template v-if="pnl.status === LeasePnlStatus.NEGATIVE">
              <ArrowDown />
            </template>
            {{ pnl.value }}
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-12 font-medium text-neutral-400">{{ progressBarTitle }}</div>
          <div></div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-12 font-medium text-neutral-400">{{ progressDateTitle }}</div>
          <div class="text-16 font-medium text-neutral-typography-200">{{ progressDate }}</div>
        </div>
      </div>
      <div class="order-2 h-[1px] w-full bg-neutral-100 lg:order-3 lg:h-full lg:w-[1px] dark:bg-border-color" />
      <div class="order-4 flex-1">
        <template v-for="(tab, index) in tabs">
          <div
            v-if="selectedTab === index"
            :key="index"
          >
            {{ tab.content }}
          </div>
        </template>
      </div>
    </div>
    <hr class="my-4 border-neutral-100 dark:border-border-color" />
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div></div>
      <div
        v-if="status !== LeaseStatus.COLLECT"
        class="flex justify-between gap-3 lg:justify-normal"
      >
        <Button
          class="flex-1 lg:flex-auto"
          v-bind="{
            ...actionButtons.repay,
            severity: 'secondary',
            size: 'large',
            disabled: status === LeaseStatus.OPENING
          }"
        />
        <Button
          class="flex-1 lg:flex-auto"
          v-bind="{
            ...actionButtons.close,
            severity: 'secondary',
            size: 'large',
            disabled: status === LeaseStatus.OPENING
          }"
        />
      </div>
      <Button
        v-if="status === LeaseStatus.COLLECT"
        v-bind="{ ...actionButtons.collect, severity: 'secondary', size: 'large' }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from "vue";
import { Button } from "@/index";
import ArrowUp from "@/shared/components/arrow-up.vue";
import ArrowDown from "@/shared/components/arrow-down.vue";

import { LeasePnlStatus, type LeaseProps, LeaseStatus } from "./types";

defineProps<LeaseProps>();

const selectedTab = ref(0);
</script>

<style lang="scss" scoped></style>
