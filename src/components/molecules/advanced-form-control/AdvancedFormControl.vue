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
        :searchable="searchable"
        :item-template="itemTemplate"
        :items-headline="itemsHeadline"
        :placeholder="pickerPlacehodler"
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
        class="flex flex-col gap-2 text-14 font-normal text-typography-default md:flex-row"
      >
        <span v-if="balanceLabel">{{ balanceLabel }}</span>
        <span
          v-if="selectedToken?.balance"
          class="cursor-pointer text-typography-link"
          @click="setBalance"
        >
          {{
            selectedToken?.balance?.customLabel ?? `${selectedToken?.balance?.value} ${selectedToken?.balance?.ticker}`
          }}
        </span>
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
        inputmode="text"
        class="bg-transparent text-right text-32 font-semibold text-typography-default placeholder-typography-default focus:outline-none"
        @keydown="inputValue"
        @keyup="setValue()"
        @paste="onPaste"
        :type="type"
      />
      <span class="text-right text-14 font-normal text-typography-secondary">
        {{ calculatedBalance }}
      </span>
    </div>
    <div
      v-if="errorMsg"
      class="items-start justify-between text-14 text-typography-error"
    >
      <span class="msg error"> &nbsp;{{ errorMsg }} </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { Dropdown, Tooltip } from "@/components";
import type { AdvancedCurrencyFieldOption, AdvancedCurrencyFieldProps } from "./types";
import { InputType, type DropdownOption } from "@/components/types";

const emit = defineEmits<{
  (e: "on-selected-currency", value: AdvancedCurrencyFieldOption): void;
  (e: "input", value: string): void;
}>();

const dot = ".";
const minus = "-";
const comma = ",";
const space = "Space";
const allowed = ["Delete", "Backspace", "ArrowLeft", "ArrowRight", "-", ".", "Enter", "Tab", "Control", "End", "Home"];
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const props = withDefaults(defineProps<AdvancedCurrencyFieldProps<DropdownOption>>(), {
  hideBalance: false,
  type: InputType.text
});

const numberValue = ref(props.value);
const selectedToken = ref<AdvancedCurrencyFieldOption | undefined>(props.selectedCurrencyOption);

onMounted(() => {
  setValue(true);
});

watch(
  () => props.value,
  () => {
    numberValue.value = props.value;
    setValue();
  }
);

watch(
  () => props.valueOnly,
  () => {
    numberValue.value = props.valueOnly;
    setValue(true);
  }
);

watch(
  () => props.selectedCurrencyOption,
  () => {
    selectedToken.value = props.selectedCurrencyOption;
  }
);

const setValue = (stopEmit?: boolean) => {
  let value = removeSpace(removeComma(numberValue.value?.toString() ?? ""));
  let numValue = Number(value);
  numberValue.value = commify(value.toString());

  if (isNaN(numValue)) {
    return false;
  }

  if (stopEmit) {
    return false;
  }

  if (value.startsWith(".")) {
    value = `0${value}`;
  }

  emit("input", value);
};

const setBalance = () => {
  if (props.disabledInputField) {
    return;
  }
  const value = selectedToken?.value?.balance?.value || "";
  numberValue.value = removeSpace(commify(value));

  let balance = removeSpace(removeComma(numberValue.value?.toString() ?? ""));

  emit("input", balance);
};

const onUpdateCurrency = (value: AdvancedCurrencyFieldOption) => {
  selectedToken.value = value;
  // numberValue.value = "";
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

  if (charCode == space) {
    event.preventDefault();
    return false;
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

  return numberPart?.replace(thousands, comma) + (hasDot ? `.${decimalPart}` : "");
};

const removeComma = (n: string) => {
  const re = new RegExp(comma, "g");
  return n.replace(re, "");
};

const removeSpace = (n: string) => {
  return n.replace(" ", "");
};
</script>

<style lang="scss" scoped></style>
