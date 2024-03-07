<template>
  <button class="button button-secondary rounded-bl-md px-3.5 py-2 font-medium text-14 flex gap-0.5"
          type="button" @click="onClick">
    <span class="icon icon-wallet text-[25px]" />
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
export interface WalletProps {
  label?: string;
}

const props = withDefaults(defineProps<WalletProps>(), {
  label: 'Connect Wallet'
});

const emit = defineEmits<{
  (e: 'click', id: number): void;
}>()

const onClick = () => {
  emit('click', 1)
}

</script>
