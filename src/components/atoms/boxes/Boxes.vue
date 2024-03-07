<template>
  <button class="button button-secondary rounded-lg px-6 py-4 font-medium text-14 flex gap-3"
          type="button" @click="onClick">
    <span v-if="icon" :class="[icon]" class="icon text-[32px]" />
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
export interface WalletProps {
  label?: string;
  icon?: string;
}

const props = withDefaults(defineProps<WalletProps>(), {
  label: 'Connect Wallet',
  icon: 'icon-google'
});

const emit = defineEmits<{
  (e: 'click', id: number): void;
}>()

const onClick = () => {
  emit('click', 1)
}

</script>
