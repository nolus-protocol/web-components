import type { Meta, StoryObj } from "@storybook/vue3";

import Toast from "./Toast.vue";
import { ToastType } from "./types";
import { Button } from "@/components";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Molecules/Toast",
  component: Toast,
  argTypes: {},
  args: {} // default value
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Toast },
    template: `
     <Toast v-bind="args">
          You will be prompted for a second signature after the first transaction is finalized.
      </Toast>
    `
  }),
  args: {
    type: ToastType.info,
    undoBtnProps: {
      label: "Undo"
    }
  }
};

export const Success: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Toast },
    template: `
      <Toast v-bind="args">
          You will be prompted for a second signature after the first transaction is finalized.
      </Toast>
    `
  }),
  args: {
    type: ToastType.success,
    undoBtnProps: {
      label: "Undo"
    }
  }
};

export const Error: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Toast },
    template: `
      <Toast v-bind="args">
          You will be prompted for a second signature after the first transaction is finalized.
      </Toast>
    `
  }),
  args: {
    type: ToastType.error,
    undoBtnProps: {
      label: "Undo"
    }
  }
};

export const Animated: Story = {
  render: (args) => ({
    data() {
      return { args, show: false, remaining: args.timeout ?? 0, intervalId: null as ReturnType<typeof setInterval> | null };
    },
    components: { Toast, Button },
    methods: {
      trigger() {
        this.remaining = this.args.timeout ?? 0;
        this.show = true;
        this.startCountdown();
      },
      handleClose() {
        this.show = false;
        this.stopCountdown();
      },
      startCountdown() {
        this.stopCountdown();
        this.intervalId = setInterval(() => {
          this.remaining = Math.max(0, this.remaining - 100);
          if (this.remaining === 0) this.stopCountdown();
        }, 100);
      },
      stopCountdown() {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      }
    },
    template: `
      <div class="flex flex-col gap-4">
        <Button label="Show Toast" severity="primary" size="medium" @click="trigger" class="w-40" />
        <span>Timer: {{ remaining }}ms</span>
        <Toast v-if="show" v-bind="args" :on-close="handleClose" icon="check-solid">
          You will be prompted for a second signature after the first transaction is finalized.
        </Toast>
      </div>
    `
  }),
  args: {
    type: ToastType.success,
    timeout: 2000
  }
};
