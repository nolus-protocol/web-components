<template>
  <Button label="test" @click="() => { console.info('dsadsadasdadsada')}"/>
  <NotificationButton />
  <Close class="" />
</template>

<script lang="ts" setup>
import { Button, Close, NotificationButton } from './index'
</script>

<style scoped>
</style>
