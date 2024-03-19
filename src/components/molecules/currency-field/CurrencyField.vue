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

    <div :class="['field-currency', classes]">
      <div class="flex items-center justify-between">
        <Dropdown
          :disabled="disabledCurrencyPicker"
          :is-loading="isLoadingPicker"
          :on-select="onUpdateCurrency"
          :options="currencyOptions"
          :selected="selectedCurrencyOption"
          class="min-w-[135px]"
        />
        <div class="flex flex-col">
          <input
            :id="id"
            v-model="numberValue"
            :disabled="disabledInputField"
            :name="name"
            :placeholder="placeholder"
            autocomplete="off"
            class="text-primary bg-transparent text-right text-18 font-medium focus:outline-none"
            @keydown="inputValue"
            @keyup="setValue"
            @paste="onPaste"
          />
          <span class="nls-font-400 text-light-blue block text-right text-14">
            {{ calculatedBalance }}
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
import { computed, onMounted, ref, watch } from "vue";
import { Dropdown, Tooltip } from "@/index";
import type { DropdownOption } from "@/components";

export interface CurrencyFieldBalance {
  label: string;
  value: string;
  ticker: string;
}

interface CurrencyFieldOption extends DropdownOption {
  price?: string;
}

export interface CurrencyFieldProps {
  id: string;
  value?: string;
  label?: string;
  balance?: CurrencyFieldBalance;
  calculatedBalance?: string;
  tooltip?: string;
  selectedCurrencyOption?: CurrencyFieldOption;
  currencyOptions: CurrencyFieldOption[];
  disabledCurrencyPicker?: boolean;
  disabledInputField?: boolean;
  name?: string;
  errorMsg?: string;
  isError?: boolean;
  numberValue?: string;
  onPaste?: (e: ClipboardEvent) => void;
  positive?: boolean;
  placeholder: string;
  isLoadingPicker?: boolean;
}

const emit = defineEmits<{
  (e: "on-selected-currency", value: CurrencyFieldOption): void;
  (e: "input", value: string): void;
}>();

const dot = ".";
const minus = "-";
const comma = ",";
const allowed = ["Delete", "Backspace", "ArrowLeft", "ArrowRight", "-", ".", "Enter", "Tab", "Control", "End", "Home"];
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const props = defineProps<CurrencyFieldProps>();

const numberValue = ref(props.value);

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

const classes = computed(() => ({
  "!border-danger-100": props.isError
}));

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
  const value = props.balance?.value || "";

  numberValue.value = commify(value);
  emit("input", removeComma(value));
};

const onUpdateCurrency = (value: DropdownOption) => {
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

<style lang="" scoped></style>
