<template>
  <div
    class="flex w-full flex-col rounded-xl border-[1px] border-neutral-100 bg-neutral-bg-50 p-6 dark:border-border-color"
  >
    <div class="flex items-center justify-between">
      <div class="text-12 font-[600] uppercase text-neutral-400">{{ title }}</div>
      <Button
        v-if="share"
        v-bind="{
          ...(share ?? {}),
          severity: 'secondary',
          size: 'small',
          icon: 'icon-share',
          iconPosition: 'left',
          onClick: () => {
            $emit('on-share', { ...props });
          }
        }"
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
        <div class="flex flex-col gap-2">
          <div class="bg- text-12 font-medium text-neutral-400">PnL</div>
          <div
            :class="[
              {
                '!bg-danger-100 !text-white': pnl.status === LeasePnlStatus.NEGATIVE,
                '!bg-success-100 !text-white': pnl.status === LeasePnlStatus.POSITIVE
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
        <div class="flex flex-col gap-2">
          <div class="text-12 font-medium text-neutral-400">{{ progressBarTitle }}</div>
          <div class="flex justify-between gap-1">
            <template v-if="margin && status !== LeaseStatus.OPENING">
              <div
                :class="[{ '!bg-danger-100': margin > 80 }]"
                class="h-[10px] w-[24px] rounded bg-neutral-100 lg:w-[35px]"
              ></div>
              <div
                :class="[{ '!bg-warning-100': margin > 65 && margin <= 80 }]"
                class="h-[10px] w-[24px] rounded bg-neutral-100 lg:w-[35px]"
              ></div>
              <div
                :class="[{ '!bg-success-100': margin <= 65 }]"
                class="h-[10px] w-[24px] rounded bg-neutral-100 lg:w-[35px]"
              ></div>
            </template>
            <template v-if="status === LeaseStatus.OPENING">
              <div class="box box1"></div>
              <div class="box box2"></div>
              <div class="box box3"></div>
            </template>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-12 font-medium text-neutral-400">{{ progressDateTitle }}</div>
          <div
            :class="[{ pulse: status === LeaseStatus.OPENING }]"
            class="text-16 font-medium text-neutral-typography-200"
          >
            {{ progressDate }}
          </div>
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
    <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
      <div class="flex items-center justify-between lg:justify-normal lg:gap-8">
        <template v-if="debt">
          <div>
            <div class="text-12 font-medium text-neutral-400">
              {{ debt.title }}
              <Tooltip
                v-if="debt.tooltip && debt.tooltip.length > 0"
                :content="debt.tooltip"
              />
            </div>
            <div :class="['text-16 font-medium text-neutral-typography-200', debt?.class]">{{ debt.value }}</div>
          </div>
        </template>
        <div
          v-if="interest || interestDue"
          class="flex gap-8 rounded-md border-[1px] border-neutral-100 p-3 dark:border-border-color"
        >
          <template
            v-for="(item, index) in [interest, interestDue]"
            :key="index"
          >
            <div>
              <div class="text-12 font-medium text-neutral-400">
                {{ item?.title }}
                <Tooltip
                  v-if="item?.tooltip && item?.tooltip.length > 0"
                  :content="item?.tooltip"
                />
              </div>
              <div :class="['text-16 font-medium text-neutral-typography-200', item?.class]">{{ item?.value }}</div>
            </div>
          </template>
        </div>
      </div>
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
            disabled: status === LeaseStatus.OPENING,
            onClick: () => {
              $emit('on-repay', { ...props });
            }
          }"
        />
        <Button
          class="flex-1 lg:flex-auto"
          v-bind="{
            ...actionButtons.close,
            severity: 'secondary',
            size: 'large',
            disabled: status === LeaseStatus.OPENING,
            onClick: () => {
              $emit('on-close', { ...props });
            }
          }"
        />
      </div>
      <Button
        v-if="status === LeaseStatus.COLLECT"
        v-bind="{
          ...actionButtons.collect,
          severity: 'secondary',
          size: 'large',
          onClick: () => {
            $emit('on-collect', { ...props });
          }
        }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from "vue";
import { Button, Tooltip } from "@/components";
import ArrowUp from "@/shared/components/arrow-up.vue";
import ArrowDown from "@/shared/components/arrow-down.vue";

import { type LeaseEmits, LeasePnlStatus, type LeaseProps, LeaseStatus } from "./types";

const selectedTab = ref(0);

const props = defineProps<LeaseProps>();

defineEmits<LeaseEmits>();
</script>

<style lang="scss" scoped>
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.pulse {
  animation: pulse 1s infinite;
}

.box {
  @apply h-[10px] w-[24px] rounded bg-neutral-100 lg:w-[35px];
  animation: changeColor 2s steps(1, end) infinite;
}

.box1 {
  animation-delay: 0s;
}

.box2 {
  animation-delay: 0.66s;
}

.box3 {
  animation-delay: 1.33s;
}

@keyframes changeColor {
  0%,
  33% {
    @apply bg-primary-50;
  }
  34%,
  100% {
    @apply bg-neutral-100;
  }
}
</style>
