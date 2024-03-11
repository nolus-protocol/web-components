<template>
  <div class="flex flex-col gap-4 max-w-[400px] mt-20 m-auto h-full">
    <Button label="test" @click="() => { console.info('dsadsadasdadsada')}" />
    <NotificationButton />
    <Close class="" />
    <Dropdown id="1" :options="options" />
    <Dropdown id="2" :options="options" />
    <Button severity="secondary" />
  </div>
</template>

<script lang="ts" setup>
import { Button, Close, Dropdown, NotificationButton } from './index'

const options = [
  { value: 'apple', label: 'Apple', icon: 'https://nolus.io/currencies/osmosis-osmo.svg' },
  { value: 'banana', label: 'Banana', icon: 'https://nolus.io/currencies/osmosis-osmo.svg' },
  { value: 'orange', label: 'Orange', icon: 'https://nolus.io/currencies/osmosis-osmo.svg' },
  { value: 'grape', label: 'Grape', icon: 'https://nolus.io/currencies/osmosis-osmo.svg' },
  { value: 'strawberry', label: 'Strawberry', icon: 'https://nolus.io/currencies/osmosis-osmo.svg' },
  { value: 'watermelon', label: 'Watermelon' }]
</script>

<style scoped>
</style>
