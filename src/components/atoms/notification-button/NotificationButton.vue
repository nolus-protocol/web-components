<template>
  <button class="button button-secondary py-1.5 px-2.5 rounded-b-md"
          type="button" @click="onClick">
    <span class="icon icon-bell text-[20px]" />
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
