<template>
  <button :class="classes" :style="style" class="bg-primary-50 text-white" type="button" @click="onClick">{{ label }} </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string,
  size?: 'small' | 'medium' | 'large',
}>(), {
  size: 'medium',
});

const emit = defineEmits<{
  (e: 'click', id: number): void;
}>();

const classes = computed(() => ({
  '': props.size
}));

const style = computed(() => ({
}));

const onClick = () => {
  emit("click", 1)
};

</script>
