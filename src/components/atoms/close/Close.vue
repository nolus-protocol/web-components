<template>
  <button class="button button-secondary rounded-full w-[50px] h-[50px] p-0 icon icon-close text-[25px]"
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
