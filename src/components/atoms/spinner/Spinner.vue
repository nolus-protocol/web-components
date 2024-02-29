<template>
  <svg
      :class="classes"
      :height="height"
      :style="style"
      :width="width"
       class="animate-spin"
       fill="none"
       viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path class="fill-spinner-color" d="M17.3107 8.41098C17.0236 7.08477 16.3809 5.86175 15.4515 4.87313C14.5221 3.88451 13.3411 3.1676 12.0352 2.79932L12.7168 0.395996C14.4536 0.889442 16.0241 1.8444 17.2615 3.15932C18.5047 4.47696 19.3655 6.10843 19.7513 7.87848L17.3115 8.41014L17.3107 8.41098Z" />
    <path :class="pathTwo" d="M10.0006 20C8.02272 20.0002 6.08921 19.4139 4.4446 18.3151C2.79999 17.2163 1.51816 15.6544 0.761229 13.827C0.004301 11.9996 -0.193722 9.98876 0.192205 8.0488C0.578133 6.10883 1.53067 4.3269 2.92935 2.92838C3.85561 1.9966 4.95759 1.25797 6.17143 0.755296C7.38526 0.252624 8.6868 -0.00408532 10.0006 4.91571e-05C10.9243 -0.000671548 11.8437 0.125793 12.7329 0.375882L12.0505 2.78254C10.4735 2.33654 8.79379 2.41983 7.26867 3.01963C5.74355 3.61944 4.45708 4.7027 3.60633 6.10348C2.75558 7.50426 2.38746 9.14533 2.55835 10.7753C2.72923 12.4053 3.42971 13.9343 4.55248 15.1282C5.67525 16.322 7.1584 17.1149 8.77476 17.3853C10.3911 17.6557 12.0515 17.3888 13.5017 16.6254C14.9519 15.862 16.1119 14.6442 16.8039 13.1586C17.496 11.673 17.682 10.0015 17.3335 8.40003L19.7783 7.8667C19.9276 8.56793 20.0019 9.28307 20 10C20 12.6522 18.9465 15.1957 17.0712 17.0711C15.196 18.9464 12.6526 20 10.0006 20Z"/>
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Type } from '@/utils/types'

export interface SpinnerProps {
  width?: string
  height?: string
  color?: string
  severity?: keyof typeof Type
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  width: '20',
  height: '20',
  severity: 'primary'
});

const classes = computed(() => ({
}));

const pathTwo = computed(() => ({
  'fill-spinner-border-color': props.severity === 'primary',
  'fill-spinner-border-color dark:fill-spinner-border-color': props.severity === 'secondary',
}));

const style = computed(() => ({}));
</script>

<style lang="" scoped>

</style>
