<template>
  <button class="button button-secondary w-[52px] h-[44px] rounded-b-md icon icon-bell text-[25px]"
          type="button" @click="onClick">
  </button>
</template>

<script lang="ts" setup>

const emit = defineEmits<{
  (e: 'click', id: number): void;
}>()

const onClick = () => {
  emit('click', 1)
}

</script>
