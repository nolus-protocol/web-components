<template>
  <Button label="test" @click="() => { console.info('dsadsadasdadsada')}"/>
  <NotificationButton />
</template>

<script lang="ts" setup>
import { Button, NotificationButton } from './index'
</script>

<style scoped>
</style>
