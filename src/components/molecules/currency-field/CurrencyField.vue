<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center justify-between">
      <label
        :for="id"
        class="field-currency-label"
      >
        {{ label }}
        <Tooltip
          v-if="tooltip?.length > 0"
          :content="tooltip"
        />
      </label>
      <div
        v-if="balance"
        class="field-currency-balance"
        @click="setBalance"
      >
        {{ balance.label }} {{ balance.value }}
      </div>
    </div>

    <div
      :class="{ error: isError }"
      class="field-currency"
    >
      <div class="flex items-center justify-between">
        <Dropdown
          :disabled="disabledCurrencyPicker"
          :on-select="onUpdateCurrency"
          :options="currencyOptions"
          :selected="option"
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
            @keypress.space.prevent
          />
          <span class="nls-font-400 text-light-blue block text-right text-14">
            {{ calculateInputBalance?.() || "$0" }}
          </span>
        </div>
      </div>
    </div>

    <div class="repayment items-start justify-between">
      <span class="msg error"> &nbsp;{{ errorMsg }} </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { Dropdown, Tooltip } from "@/index";
import type { DropdownOption } from "@/components";

export interface CurrencyFieldProps {
  id?: string;
  value?: string;
  label?: string;
  placeholder?: string;
  balance?: {
    label: string;
    value: string;
  };
  tooltip?: string;
  option?: DropdownOption;
  disabledCurrencyPicker?: boolean;
  currencyOptions: DropdownOption[];
  disabledInputField?: boolean;
  name?: string;
  errorMsg?: string;
  isError?: boolean;
  numberValue?: string;
  onPaste?: (e: ClipboardEvent) => void;
  onUpdateCurrency?: (option: DropdownOption) => void;
  // setBalance?: () => void;
  calculateInputBalance?: () => string;
  positive?: boolean;
}

const emit = defineEmits(["update-currency", "update:modelValue", "input"]);

const dot = ".";
const minus = "-";
const comma = ",";
const allowed = ["Delete", "Backspace", "ArrowLeft", "ArrowRight", "-", ".", "Enter", "Tab", "Control", "End", "Home"];
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const props = defineProps<CurrencyFieldProps>();

const numberValue = ref(props.value);
let numberRealValue = Number(props.value);

onMounted(() => {
  setValue();
});

watch(
  () => props.value,
  () => {
    numberValue.value = props.value;
    numberRealValue = Number(props.value);
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

  numberRealValue = Number(value);

  emit("input", value);
  emit("update:modelValue", value);
};

const setBalance = () => {
  // if (props.total) {
  // const currency: ExternalCurrency | any = props.option?.ticker
  //   ? wallet.getCurrencyByTicker(props.option?.ticker)
  //   : wallet.getCurrencyInfo(props.total.denom);
  // const decimals = Number(currency.decimal_digits ?? currency.coinDecimals);
  // const value = new Dec(props.total.amount, decimals);
  // emit("input", value.toString(decimals));
  // emit("update:modelValue", value.toString(decimals));
  // }
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
