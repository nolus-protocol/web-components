<template>
  <div class="m-auto mt-20 flex h-full max-w-[400px] flex-col gap-4">
    <Button
      label="test"
      @click="
        () => {
          console.info('dsadsadasdadsada');
        }
      "
    />
    <NotificationButton />
    <Close class="" />
    <Dropdown
      :on-select="onSelect"
      :options="options"
    />
    <Dropdown
      :on-select="
        (option) => {
          console.info(option);
        }
      "
      :options="options"
    />
    <Button severity="secondary" />

    <Input
      id="test-input"
      :on-change="
        (e) => {
          console.info((e.target as HTMLInputElement).value);
        }
      "
      type="text"
    />

    <CurrencyField
      id="test"
      :balance="{ label: 'Test', value: '3123123', ticker: 'USDT' }"
      :calculated-balance="'$0'"
      :currency-options="options"
      label="Test1"
      placeholder="0"
      @input="
        (value) => {
          console.info(value);
        }
      "
      @on-selected-currency="
        (option) => {
          console.info(option);
        }
      "
    />

    <MultilineCurrencyField
      id="multiline"
      :balance="{ label: 'Test', value: '3123123', ticker: 'USDT' }"
      :currency-options="options"
      :on-swap="
        (e) => {
          console.info('swap', e);
        }
      "
      placeholder="0"
      @on-first-change="
        (value) => {
          console.info(value);
        }
      "
      @on-second-change="
        (value) => {
          console.info(value);
        }
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { Button, Close, CurrencyField, Dropdown, Input, MultilineCurrencyField, NotificationButton } from "./index";

const options = [
  {
    value: "apple",
    label: "Apple",
    icon: "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/osmosis-usdc.svg",
    price: "31231312"
  },
  {
    value: "banana",
    label: "Banana",
    icon: "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/osmosis-usdc.svg"
  },
  {
    value: "orange",
    label: "Orange",
    icon: "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/osmosis-usdc.svg"
  },
  {
    value: "grape",
    label: "Grape",
    icon: "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/osmosis-usdc.svg"
  },
  {
    value: "strawberry",
    label: "Strawberry",
    icon: "https://raw.githubusercontent.com/nolus-protocol/webapp/main/src/config/currencies/icons/osmosis-usdc.svg"
  },
  { value: "watermelon", label: "Watermelon" }
];

const onSelect = (option: any) => {
  console.info(option);
};
</script>

<style scoped></style>
