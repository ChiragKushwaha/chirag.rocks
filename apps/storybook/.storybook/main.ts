import type { StorybookConfig } from "@storybook/react-vite";

import { join, dirname, resolve } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("node_modules/@storybook/addon-essentials"),
    getAbsolutePath("node_modules/@storybook/addon-onboarding"),
    getAbsolutePath("node_modules/@chromatic-com/storybook"),
    getAbsolutePath("node_modules/@storybook/experimental-addon-test"),
  ],
  framework: {
    name: getAbsolutePath("node_modules/@storybook/react-vite"),
    options: {},
  },
};
export default config;
