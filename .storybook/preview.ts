import type { Preview } from "@storybook/vue3";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/assets/styles/index.scss";

/* snipped for brevity */
export const decorators = [
  withThemeByClassName({
    themes: {
      light: "light",
      dark: "dark",
      sync: "sync"
    },
    defaultTheme: "light"
  })
];

const preview: Preview = {
  parameters: {
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
    }
  }
};

export default preview;
