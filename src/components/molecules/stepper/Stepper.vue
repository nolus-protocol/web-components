<template>
  <div v-if="variant === StepperVariant.SMALL">
    <div class="flex items-center">
      <div
        v-for="(step, index) in props.steps"
        :key="index"
        class="flex items-center"
      >
        <div class="z-10 h-4 w-4">
          <img
            :class="[
              { 'outline-warning-emphasized': activeStep === index, 'outline-success-emphasized': activeStep > index }
            ]"
            :src="step.icon"
            :title="step.label"
            class="w-full rounded-full border border-transparent outline outline-1 outline-border-emphasized"
          />
        </div>
        <div
          v-if="index !== props.steps.length - 1"
          :class="[
            {
              'border-border-warning': activeStep === index,
              'border-border-success': activeStep > index,
              relative: step.approval
            }
          ]"
          class="z-[1] w-8 border-b border-dashed border-border-emphasized"
        >
          <ApprovalIcon
            v-if="step.approval"
            class="absolute top-1/2 z-[2] translate-x-1/2 translate-y-[-50%] transform fill-border-warning"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-if="variant === StepperVariant.MEDIUM">
    <div class="flex flex-col">
      <div
        v-for="(step, index) in props.steps as MediumStep[]"
        :key="index"
        :ref="(el: any) => stepContainers.push(el)"
        class="flex gap-x-3"
      >
        <div class="flex flex-col items-center">
          <div class="z-10 h-10 w-10">
            <img
              :class="[
                { 'outline-warning-emphasized': activeStep === index, 'outline-success-emphasized': activeStep > index }
              ]"
              :src="step.icon"
              class="w-full rounded-full border-[2px] border-transparent outline outline-2 outline-border-emphasized"
            />
          </div>
          <div
            v-if="index !== props.steps.length - 1"
            :class="[
              {
                'border-border-warning': activeStep === index,
                'border-border-success': activeStep > index,
                relative: step.approval
              }
            ]"
            :style="{ height: stepContainerHeights[index] - 40 + 'px' }"
            class="z-[1] min-h-10 border-l-[2px] border-dashed border-border-emphasized"
          >
            <ApprovalIcon
              v-if="step.approval"
              class="absolute top-1/2 z-[2] mr-[1px] translate-x-[-53%] translate-y-[-50%] transform fill-border-warning"
            />
          </div>
        </div>
        <div class="flex flex-col pb-4 text-16 text-typography-default">
          <span class="font-semibold">{{ step.label }}</span>
          <span class="font-normal">{{ step.token.balance }} {{ step.token.symbol }}</span>
          <component
            :is="step.meta?.()"
            class="text-14 text-typography-secondary"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script generic="T extends StepperVariant" lang="ts" setup>
import { onMounted, ref } from "vue";
import ApprovalIcon from "@/assets/icons/approval.svg";
import { type BaseStepperProps, type MediumStep, type StepperMap, StepperVariant } from "./types";

const stepContainers = ref<(HTMLDivElement | null)[]>([]);
const stepContainerHeights = ref<number[]>([]);

const props = defineProps<
  BaseStepperProps & {
    variant: T;
    steps: StepperMap[T]["steps"];
  }
>();

onMounted(() => {
  stepContainers.value.forEach((container, index) => {
    if (container) {
      stepContainerHeights.value[index] = container.getBoundingClientRect().height;
    }
  });
});
</script>

<style lang="scss" scoped></style>
