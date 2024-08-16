<template>
  <div
    :class="[
      {
        'flex-col': variant === FormControlVariant.vertical,
        'gap-3': variant === FormControlVariant.horizontal
      }
    ]"
    class="flex gap-1 text-14 font-normal"
  >
    <label
      :class="[
        {
          'h-fit translate-y-[50%]': variant === FormControlVariant.horizontal
        }
      ]"
      >{{ label }}</label
    >
    <div
      :class="[
        {
          'flex flex-wrap': variant === FormControlVariant.horizontal,
          'flex flex-col': variant === FormControlVariant.vertical
        }
      ]"
      class="gap-1"
    >
      <slot />
      <div
        v-if="helperText"
        :class="[
          {
            'text-typography-error': error,
            'flex-1 basis-full': variant === FormControlVariant.horizontal
          }
        ]"
        class=""
      >
        {{ helperText }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { type FormControlProps, FormControlVariant } from "@/components/atoms/form-control/types";

withDefaults(defineProps<FormControlProps>(), {
  variant: FormControlVariant.vertical
});
</script>

<style lang="scss" scoped></style>
