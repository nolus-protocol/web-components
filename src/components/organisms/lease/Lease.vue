<template>
  <div class="flex w-full flex-col border-[1px] border-border-color bg-neutral-bg-50 p-6 px-4 lg:rounded-xl lg:px-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-12 font-[600] uppercase text-neutral-400">
        <span :class="title.class">
          {{ title.value }}
        </span>
        <div
          :class="[{ 'cursor-pointer': history?.click }]"
          class="normal-case text-primary-50"
          @click="history?.click && history.click()"
        >
          {{ history?.value }}
        </div>
      </div>
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
    <hr class="my-4 border-border-color" />
    <div class="flex flex-col gap-6 lg:h-[150px] lg:flex-row">
      <div class="order-3 flex flex-row gap-2.5 lg:order-1 lg:flex-col">
        <Button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="[{ 'button-active': selectedTab === index }]"
          v-bind="{
            ...tab.button,
            disabled: tab.button.disabled || status === LeaseStatus.OPENING,
            severity: 'secondary',
            size: 'medium'
          }"
          @click="selectedTab = index"
        />
      </div>
      <div
        :class="[{ 'justify-between': status !== LeaseStatus.PAID }]"
        class="order-1 flex flex-row lg:order-2 lg:flex-col lg:justify-normal lg:gap-3"
      >
        <div
          v-if="pnl"
          class="flex flex-col gap-2"
        >
          <div class="text-12 font-medium text-neutral-400">PnL</div>
          <div
            :class="[
              {
                '!bg-danger-100 !text-white': pnl.status === LeasePnlStatus.NEGATIVE,
                '!bg-success-100 !text-white': pnl.status === LeasePnlStatus.POSITIVE,
                'cursor-pointer': pnl.click
              }
            ]"
            class="flex select-none items-center gap-1.5 rounded bg-neutral-100 p-2 text-12 font-medium text-neutral-400"
            @click="pnl.click && pnl.click()"
          >
            <template v-if="pnl.status === LeasePnlStatus.POSITIVE">
              <ArrowUp />
            </template>
            <template v-if="pnl.status === LeasePnlStatus.NEGATIVE">
              <ArrowDown />
            </template>
            {{ pnl.value }}
            <slot
              v-if="!pnl.value"
              :name="`pnl-slot`"
            />
          </div>
        </div>
        <div
          v-if="status !== LeaseStatus.PAID"
          class="flex flex-col gap-2"
        >
          <template v-if="progressBar?.value.length === 1 && status !== LeaseStatus.OPENING">
            <div class="text-12 font-medium text-neutral-400">{{ progressBar.title }}</div>
            <div class="flex h-full items-center justify-between gap-1">
              <div
                :class="[{ '!bg-danger-100': +progressBar.value > 80 }]"
                class="h-[10px] w-[24px] rounded bg-progress-color lg:w-[35px]"
              ></div>
              <div
                :class="[{ '!bg-warning-100': +progressBar.value > 65 && +progressBar.value <= 80 }]"
                class="h-[10px] w-[24px] rounded bg-progress-color lg:w-[35px]"
              ></div>
              <div
                :class="[{ '!bg-success-100': +progressBar.value <= 65 }]"
                class="h-[10px] w-[24px] rounded bg-progress-color lg:w-[35px]"
              ></div>
            </div>
          </template>
          <template v-if="progressBar && progressBar.value.length > 1 && status === LeaseStatus.OPENING">
            <div class="text-12 font-medium text-neutral-400">{{ progressBar.title }}</div>
            <div class="flex justify-between gap-1">
              <div
                v-for="(val, index) in progressBar.value"
                :key="index"
                :class="[
                  'h-[10px] w-[24px] rounded bg-progress-color lg:w-[35px]',
                  {
                    'pulse !bg-primary-50': val === LeaseOpeningBarStatuses.CURRENT,
                    '!bg-primary-50': val === LeaseOpeningBarStatuses.READY
                  }
                ]"
              ></div>
            </div>
          </template>
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-12 font-medium text-neutral-400">{{ progressDate.title }}</div>
          <div
            :class="[{ pulse: status === LeaseStatus.OPENING }]"
            class="flex h-full items-center text-16 font-medium text-neutral-typography-200"
          >
            <div>{{ progressDate.value }}</div>
          </div>
        </div>
      </div>
      <div class="order-2 h-[1px] w-full bg-border-color lg:order-3 lg:h-full lg:!w-[1px]" />
      <div class="order-4 flex-1">
        <template v-for="(tab, index) in tabs">
          <template v-if="selectedTab === index">
            {{ tab.content }}
            <slot
              v-if="!tab.content"
              :name="`tab-${index}`"
            />
          </template>
        </template>
      </div>
    </div>
    <hr class="my-4 border-border-color" />
    <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
      <div class="flex items-center justify-between lg:justify-normal lg:gap-8">
        <template v-if="debt">
          <div>
            <div class="flex items-center text-12 font-medium text-neutral-400">
              {{ debt.title }}
              <Tooltip
                v-if="debt.tooltip && debt.tooltip.length > 0"
                :content="debt.tooltip"
              />
            </div>
            <div
              :class="[
                'text-16 font-medium text-neutral-typography-200',
                debt?.class,
                { pulse: status === LeaseStatus.OPENING }
              ]"
            >
              {{ debt.value }}
              <slot
                v-if="!debt.value"
                :name="`debt-1`"
              />
            </div>
          </div>
        </template>
        <div
          v-if="interest || interestDue"
          class="flex gap-8 rounded-md border-border-color lg:border-[1px] lg:p-3 dark:border-border-color"
        >
          <template
            v-for="(item, index) in [interest, interestDue]"
            :key="index"
          >
            <div>
              <div class="flex items-center text-12 font-medium text-neutral-400">
                {{ item?.title }}
                <Tooltip
                  v-if="item?.tooltip && item?.tooltip.length > 0"
                  :content="item?.tooltip"
                />
              </div>
              <div
                :class="[
                  'text-16 font-medium text-neutral-typography-200',
                  item?.class,
                  { pulse: status === LeaseStatus.OPENING }
                ]"
              >
                {{ item?.value }}
                <slot
                  v-if="!item?.value"
                  :key="index"
                  :name="`interest-${index}`"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
      <div
        v-if="status !== LeaseStatus.PAID"
        class="flex justify-between gap-3 lg:justify-normal"
      >
        <Button
          class="flex-1 lg:flex-auto"
          v-bind="{
            severity: 'secondary',
            size: 'large',
            disabled: status === LeaseStatus.OPENING,
            ...actionButtons.repay,
            onClick: () => {
              $emit('on-repay', { ...props });
            }
          }"
        />
        <Button
          class="flex-1 lg:flex-auto"
          v-bind="{
            severity: 'secondary',
            size: 'large',
            disabled: status === LeaseStatus.OPENING,
            ...actionButtons.close,
            onClick: () => {
              $emit('on-close', { ...props });
            }
          }"
        />
      </div>
      <Button
        v-if="status === LeaseStatus.PAID"
        v-bind="{
          severity: 'secondary',
          size: 'large',
          ...actionButtons.collect,
          onClick: () => {
            $emit('on-collect', { ...props });
          }
        }"
      />
    </div>
    <div v-if="lease_history.items.length > 0">
      <hr class="my-4 border-border-color" />
      <div class="mt-5 flex justify-center">
        <button
          class="text-primary-300 text-12 font-[500] normal-case"
          @click="showHistory = !showHistory"
        >
          {{ showHistory ? lease_history.hideText : lease_history.showText }}
        </button>
      </div>
      <template v-if="showHistory">
        <div class="mt-2 flex flex-row justify-between text-12">
          <div class="uppercase text-neutral-400">{{ lease_history.actionText }}</div>
          <div class="uppercase text-neutral-400">{{ lease_history.timeText }}</div>
        </div>
        <template v-for="item of lease_history.items">
          <div class="mt-2 flex flex-row justify-between text-12">
            <div class="font-[500] text-neutral-typography-200">{{ item.action }}</div>
            <div class="text-neutral-400">{{ item.time }}</div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Tooltip from "../../atoms/tooltip/Tooltip.vue";
import Button from "../../atoms/button/Button.vue";

import ArrowUp from "@/shared/components/arrow-up.vue";
import ArrowDown from "@/shared/components/arrow-down.vue";

import { type LeaseEmits, LeaseOpeningBarStatuses, LeasePnlStatus, type LeaseProps, LeaseStatus } from "./types";

const selectedTab = ref(0);
const showHistory = ref(false);

onMounted(() => {
  if (props.tabs.length > 0) {
    props.tabs.map((tab, index) => {
      if (tab.active) {
        selectedTab.value = index;
      }
    });
  }
});

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
  @apply h-[10px] w-[24px] rounded bg-progress-color lg:w-[35px];
}
</style>
