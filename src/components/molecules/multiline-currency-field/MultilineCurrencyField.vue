<template>
  <div class="field-currency-wrapper">
    <div class="flex items-center justify-between">
      <label
        :for="id"
        class="field-currency-label"
      >
        {{ label }}
        <Tooltip
          v-if="tooltip && tooltip.length > 0"
          :content="tooltip"
        />
      </label>
      <div
        v-if="balance"
        class="field-currency-balance"
        @click="setBalance"
      >
        {{ balance.label }} {{ balance.value }} {{ balance.ticker }}
      </div>
    </div>

    <div :class="['field-currency', 'flex', 'flex-col', 'gap-4', classes]">
      <div class="flex items-center justify-between">
        <Dropdown
          :id="`${id}-dropdown-1`"
          :disabled="disabledCurrencyPicker"
          :is-loading="isLoadingPicker"
          :on-select="(option) => onUpdateCurrency(option, 1)"
          :options="currencyOptions"
          :selected="selectedFirstCurrencyOption"
          class="min-w-[135px]"
        />
        <div class="flex flex-col">
          <input
            :id="`${id}-input-1`"
            v-model="firstValue"
            :disabled="disabledInputField"
            :name="name"
            :placeholder="placeholder"
            autocomplete="off"
            class="text-primary bg-transparent text-right text-18 font-medium focus:outline-none"
            @keydown="(e) => inputValue(e, 1)"
            @keyup="() => setValue(1)"
            @paste="onPaste"
          />
          <span class="nls-font-400 text-light-blue block text-right text-14">
            {{ firstCalculatedBalance }}
          </span>
        </div>
      </div>
      <div class="relative">
        <hr class="border-border-color" />
        <button
          :class="[{ '-top-5': swapSvg }]"
          class="button-secondary transform-all ease-bounce ease-bounce absolute -top-[18px] left-1/2 h-9 w-9 -translate-x-1/2 cursor-pointer rounded-md px-2 duration-300 hover:h-10 hover:w-10"
          @click="onSwap"
          @mouseleave="swapSvg = false"
          @mouseover="swapSvg = true"
        >
          <div class="relative flex h-full w-full items-center justify-center">
            <Swap
              :class="[{ 'rotate-180 opacity-100': swapSvg }]"
              class="ease-bounce transform-all absolute stroke-neutral-typography-200 opacity-0 duration-300"
            />
            <DownArrow
              :class="[{ 'rotate-180 opacity-0': swapSvg }]"
              class="ease-bounce transform-all absolute stroke-neutral-typography-200 duration-300"
            />
          </div>
        </button>
      </div>
      <div class="flex items-center justify-between">
        <Dropdown
          :id="`${id}-2`"
          :disabled="disabledCurrencyPicker"
          :is-loading="isLoadingPicker"
          :on-select="(option) => onUpdateCurrency(option, 2)"
          :options="currencyOptions"
          :selected="selectedSecondCurrencyOption"
          class="min-w-[135px]"
        />
        <div class="flex flex-col">
          <input
            :id="`${id}-input-2`"
            v-model="secondValue"
            :disabled="disabledInputField"
            :name="name"
            :placeholder="placeholder"
            autocomplete="off"
            class="text-primary bg-transparent text-right text-18 font-medium focus:outline-none"
            @keydown="(e) => inputValue(e, 2)"
            @keyup="() => setValue(2)"
            @paste="onPaste"
          />
          <span class="nls-font-400 text-light-blue block text-right text-14">
            {{ secondCalculatedBalance }}
          </span>
        </div>
      </div>
    </div>

    <div class="field-currency-error items-start justify-between">
      <span class="msg error"> &nbsp;{{ errorMsg }} </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { Dropdown, Tooltip } from "@/index";
import type { CurrencyFieldEmits, CurrencyFieldOption, CurrencyFieldProps } from "./types";
import DownArrow from "@/shared/components/down-arrow.vue";
import Swap from "@/shared/components/swap.vue";

const emit = defineEmits<CurrencyFieldEmits>();

const dot = ".";
const minus = "-";
const comma = ",";
const allowed = ["Delete", "Backspace", "ArrowLeft", "ArrowRight", "-", ".", "Enter", "Tab", "Control", "End", "Home"];
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const props = defineProps<CurrencyFieldProps>();

const firstValue = ref(props.firstInputValue);
const secondValue = ref(props.secondInputValue);
const firstCurrencyOption = ref(props.selectedFirstCurrencyOption);
const secondCurrencyOption = ref(props.selectedSecondCurrencyOption);
const swapSvg = ref(false);

watch(
  () => props.firstInputValue,
  () => {
    firstValue.value = props.firstInputValue;
    setValue(1);
  }
);

watch(
  () => props.secondInputValue,
  () => {
    secondValue.value = props.secondInputValue;
    setValue(2);
  }
);

const classes = computed(() => ({
  "!border-danger-100": props.isError
}));

const emitOnChange = (value: string, input: number) => {
  const cleanedValue = removeComma(value);

  if (input === 1) {
    emit("on-first-change", { currency: firstCurrencyOption.value, input: { value: cleanedValue, order: input } });
  } else {
    emit("on-second-change", { currency: secondCurrencyOption.value, input: { value: cleanedValue, order: input } });
  }
};

const setValue = (input: number) => {
  const inputVal = input === 1 ? firstValue.value : secondValue.value;
  let value = removeComma(inputVal ?? "");
  let numValue = Number(value);

  if (input === 1) {
    firstValue.value = commify(value.toString());
  } else {
    secondValue.value = commify(value.toString());
  }

  if (isNaN(numValue)) {
    return false;
  }

  emitOnChange(value, input);
};

const setBalance = () => {
  const value = props.balance?.value || "";
  firstValue.value = commify(value);

  emitOnChange(value, 1);
};

const onUpdateCurrency = (currency: CurrencyFieldOption, input: number) => {
  const inputValue = (input === 1 ? firstValue.value : secondValue.value) ?? "";

  if (input === 1) {
    firstCurrencyOption.value = currency;
  } else {
    secondCurrencyOption.value = currency;
  }

  emitOnChange(inputValue, input);
};

const inputValue = (event: KeyboardEvent, input: number) => {
  const charCode = event.key;
  const value = (input === 1 ? firstValue.value : secondValue.value) ?? "";

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

<style lang="" scoped></style>
