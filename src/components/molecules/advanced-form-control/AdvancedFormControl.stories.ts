import type { Meta, StoryObj } from "@storybook/vue3";

import AdvancedFormControl from "./AdvancedFormControl.vue";
import { iconsExternalUrl } from "../../../shared/utils/types";
import type { AssetItemProps } from "../../atoms/asset-list-item/types";
import type { DropdownOption } from "../../atoms/dropdown/types";
import type { AdvancedCurrencyFieldOption } from "./types";
import AssetItem from "../../atoms/asset-list-item/AssetItem.vue";
import Button from "../../atoms/button/Button.vue";
import { h, ref } from "vue";

type AssetOption = AdvancedCurrencyFieldOption & Pick<AssetItemProps, "abbreviation" | "price">;

const currencyOptions: AssetOption[] = [
  {
    value: "osmosis",
    abbreviation: "OSMO",
    label: "Osmosis",
    icon: `${iconsExternalUrl}/osmosis-osmo.svg`,
    balance: { value: "1111.234", ticker: "stOSMO" },
    price: "$123"
  },
  {
    value: "osmosis2",
    abbreviation: "OSMO2",
    label: "Osmosis2",
    icon: `${iconsExternalUrl}/osmosis-osmo.svg`,
    balance: { value: "1111.234", ticker: "stOSMO" },
    price: "$123",
    disabled: true
  }
];

const meta = {
  title: "Components/Molecules/AdvancedFormControl",
  component: AdvancedFormControl,
  argTypes: {},
  args: {
    id: "currency-3",
    label: "Position Size",
    placeholder: "0",
    balanceLabel: "Balance:",
    calculatedBalance: "$0",
    currencyOptions,
    tooltip: "Some tooltip text",
    itemsHeadline: ["Assets", "Your balance"],
    // The template is typed over DropdownOption, so resolve the asset fields from the options it was given.
    itemTemplate: (item?: DropdownOption) => {
      const asset = currencyOptions.find((option) => option.value === item?.value);
      return (
        asset && h<AssetItemProps>(AssetItem, { ...asset, name: asset.label, balance: asset.balance?.value ?? "" })
      );
    }
  } // default value
} satisfies Meta<typeof AdvancedFormControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    class: "w-[400px]"
  }
};

export const WithError: Story = {
  args: {
    class: "w-[400px]",
    isError: true,
    errorMsg: "Some error text"
  }
};

const collaterals = ["USDC", "SOL", "ATOM"];

export const LabelActions: Story = {
  render: (args) => ({
    components: { AdvancedFormControl, Button },
    setup() {
      const picked = ref(collaterals[0]);
      return { args, collaterals, picked };
    },
    template: `
      <AdvancedFormControl v-bind="args">
        <template #label>Collateral</template>
        <template #label-actions>
          <div
            role="group"
            aria-label="Collateral"
            class="flex flex-wrap gap-2"
          >
            <Button
              v-for="ticker in collaterals"
              :key="ticker"
              :label="ticker"
              severity="tertiary"
              size="medium"
              :class="{ active: ticker === picked }"
              :aria-pressed="ticker === picked ? 'true' : 'false'"
              @click="picked = ticker"
            />
          </div>
        </template>
      </AdvancedFormControl>
    `
  }),
  args: {
    class: "w-[400px]",
    labelAdvanced: true,
    label: undefined,
    tooltip: undefined,
    balanceLabel: "Balance",
    selectedCurrencyOption: {
      value: "usdc",
      label: "USDC",
      balance: { value: "2500", ticker: "USDC", customLabel: "2,500.00" }
    }
  }
};
