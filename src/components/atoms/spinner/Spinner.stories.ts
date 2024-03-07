import type { Meta, StoryObj } from '@storybook/vue3'

import Spinner from './Spinner.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Spinner",
  component: Spinner,
  argTypes: {},
  args: {} // default value
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    width: '20',
    height: '20'
  }
}
