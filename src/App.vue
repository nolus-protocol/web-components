<template>
  <Button label="test" @click="() => { console.info('dsadsadasdadsada')}"/>
  <NotificationButton />
</template>

<script lang="ts" setup>
import Button from './components/atoms/button/Button.vue'
import NotificationButton from '@/components/atoms/notification-button/NotificationButton.vue'
</script>

<style scoped>
</style>
