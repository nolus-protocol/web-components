<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="label && !labelAdvanced"
      :for="id"
      class="flex items-center gap-1 text-16 font-semibold text-typography-default"
    >
      {{ label }}
      <Tooltip
        v-if="tooltip && tooltip.length > 0"
        :content="tooltip"
      >
        <span
          class="mb-1 flex h-4 w-4 items-center justify-center rounded-full bg-icon-default text-10 text-typography-inverted"
          >?</span
        >
      </Tooltip>
    </label>
    <div class="flex items-center justify-between">
      <Dropdown
        :id="id"
        :class="{ hidden: labelAdvanced }"
        :disabled="disabledCurrencyPicker"
        :is-loading="isLoadingPicker"
        :on-select="onUpdateCurrency"
        :options="currencyOptions"
        :selected="selectedCurrencyOption"
        class="min-w-[135px]"
      />
      <label
        v-if="labelAdvanced"
        :for="id"
        class="flex items-center gap-1 text-16 font-semibold text-typography-default"
      >
        <slot name="label"></slot>
        <Tooltip
          v-if="tooltip && tooltip.length > 0"
          :content="tooltip"
        >
          <span
            class="mb-1 flex h-4 w-4 items-center justify-center rounded-full bg-icon-default text-10 text-typography-inverted"
            >?</span
          >
        </Tooltip>
      </label>
      <div
        v-if="!hideBalance"
        class="flex gap-2 text-14 font-normal text-typography-default"
      >
        <span v-if="balanceLabel">{{ balanceLabel }}</span>
        <span
          v-if="selectedToken?.balance"
          class="cursor-pointer text-typography-link"
          @click="setBalance"
          >{{ selectedToken?.balance?.value }} {{ selectedToken?.balance?.ticker }}</span
        >
      </div>
    </div>
    <div class="flex flex-col">
      <input
        :id="id"
        v-model="numberValue"
        :disabled="disabledInputField"
        :name="name"
        :placeholder="placeholder"
        autocomplete="off"
        class="bg-transparent text-right text-32 font-semibold text-typography-default placeholder-typography-default focus:outline-none"
        @keydown="inputValue"
        @keyup="setValue"
        @paste="onPaste"
      />
      <span class="text-right text-14 font-normal text-typography-secondary">
        {{ calculatedBalance }}
      </span>
    </div>
    <div class="items-start justify-between text-14 text-typography-error">
      <span class="msg error"> &nbsp;{{ errorMsg }} </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { Dropdown, Tooltip } from "@/components";
import type { AdvancedCurrencyFieldOption, AdvancedCurrencyFieldProps } from "./types";

const emit = defineEmits<{
  (e: "on-selected-currency", value: AdvancedCurrencyFieldOption): void;
  (e: "input", value: string): void;
}>();

const dot = ".";
const minus = "-";
const comma = ",";
const allowed = ["Delete", "Backspace", "ArrowLeft", "ArrowRight", "-", ".", "Enter", "Tab", "Control", "End", "Home"];
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const props = withDefaults(defineProps<AdvancedCurrencyFieldProps>(), {
  hideBalance: false
});

const numberValue = ref(props.value);
const selectedToken = ref<AdvancedCurrencyFieldOption | undefined>(props.selectedCurrencyOption);

onMounted(() => {
  setValue();
});

watch(
  () => props.value,
  () => {
    numberValue.value = props.value;
    setValue();
  }
);

const setValue = () => {
  let value = removeComma(numberValue.value ?? "");
  let numValue = Number(value);

  numberValue.value = commify(value.toString());

  if (isNaN(numValue)) {
    return false;
  }

  emit("input", value);
};

const setBalance = () => {
  const value = selectedToken?.value?.balance?.value || "";

  numberValue.value = commify(value);
  emit("input", removeComma(value));
};

const onUpdateCurrency = (value: AdvancedCurrencyFieldOption) => {
  selectedToken.value = value;
  numberValue.value = "";
  emit("on-selected-currency", value);
};

const inputValue = (event: KeyboardEvent) => {
  const charCode = event.key;
  const value = numberValue.value ?? "";

  if (event.ctrlKey || event.metaKey) {
    return true;
  }

  if (props.positive) {
    if (event.key == minus) {
      event.preventDefault();
      return false;
    }
  }

  if (charCode == minus && value.includes(minus)) {
    event.preventDefault();
    return false;
  }

  if (charCode == dot && value?.includes(dot)) {
    event.preventDefault();
    return false;
  }

  if (allowed.includes(charCode)) {
    return true;
  }

  const num = Number(charCode);
  if (numbers.includes(num)) {
    return true;
  }

  event.preventDefault();
  return false;
};

const commify = (n: string) => {
  const parts = n.split(".");
  const numberPart = parts[0];
  const decimalPart = parts[1];
  const hasDot = n.includes(dot);
  const thousands = /\B(?=(\d{3})+(?!\d))/g;

  return numberPart.replace(thousands, comma) + (hasDot ? `.${decimalPart}` : "");
};

const removeComma = (n: string) => {
  const re = new RegExp(comma, "g");
  return n.replace(re, "");
};
</script>

<style lang="scss" scoped></style>
