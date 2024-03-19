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
    <Dropdown :options="options" />
    <Button severity="secondary" />

    <Input
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
  </div>
</template>

<script lang="ts" setup>
import { Button, Close, Dropdown, Input, NotificationButton } from "./index";
import CurrencyField from "@/components/molecules/currency-field/CurrencyField.vue";

const options = [
  { value: "apple", label: "Apple", icon: "https://nolus.io/currencies/osmosis-osmo.svg", price: "31231312" },
  { value: "banana", label: "Banana", icon: "https://nolus.io/currencies/osmosis-osmo.svg" },
  { value: "orange", label: "Orange", icon: "https://nolus.io/currencies/osmosis-osmo.svg" },
  { value: "grape", label: "Grape", icon: "https://nolus.io/currencies/osmosis-osmo.svg" },
  { value: "strawberry", label: "Strawberry", icon: "https://nolus.io/currencies/osmosis-osmo.svg" },
  { value: "watermelon", label: "Watermelon" }
];

const onSelect = (option: any) => {
  console.info(option);
};
</script>

<style scoped></style>
