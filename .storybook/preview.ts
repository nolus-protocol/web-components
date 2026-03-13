import type { Preview } from "@storybook/vue3";
import { withThemeByClassName } from "@storybook/addon-themes";

import "../src/assets/styles/theme.css";
import "../src/assets/styles/index.scss";

const customViewports = {
  iphone14: {
    name: "iPhone 14 (390×844)",
    styles: { width: "390px", height: "844px" },
    type: "mobile"
  },
  pixel7: {
    name: "Pixel 7 (412×915)",
    styles: { width: "412px", height: "915px" },
    type: "mobile"
  },
  ipadMini: {
    name: "iPad mini (768×1024)",
    styles: { width: "768px", height: "1024px" },
    type: "tablet"
  }
};

/* snipped for brevity */
export const decorators = [
  withThemeByClassName({
    themes: {
      light: "light",
      dark: "dark",
      sync: "sync"
    },
    defaultTheme: "light"
  }),
  () => ({
    mounted() {
      document.body.style.margin = "0";
      document.body.style.padding = "0";
    },
    template: `<div style="background: var(--color-background-level-2); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem;"><story /></div>`
  })
];

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    options: {
      storySort: {
        method: "alphabetical",
        order: ["Introduction", "Documentation", "Components"]
      }
    },
    viewport: {
      viewports: {
        ...customViewports
      },
      defaultViewport: "iphone14" // <- start stories in mobile size
    }
  },
  tags: ["autodocs"]
};

export default preview;
