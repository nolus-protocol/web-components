import { describe, expect, it } from "vitest";

import * as library from "./main";

// Removing or renaming one of these breaks the webapp at install time. Change the list together with a `!` in the
// pull request title so the release is a major.
const PUBLIC_RUNTIME_EXPORTS = [
  "AdvancedFormControl",
  "Alert",
  "AlertType",
  "Asset",
  "AssetItem",
  "Badge",
  "Button",
  "CURRENCY_VIEW_TYPES",
  "Checkbox",
  "Dialog",
  "Dropdown",
  "FormControl",
  "FormControlVariant",
  "HelpText",
  "Input",
  "InputType",
  "Label",
  "Lease",
  "LeaseOpeningBarStatuses",
  "LeasePnlStatus",
  "LeaseStatus",
  "Popover",
  "Proposal",
  "ProposalStatus",
  "ProposalVotingLine",
  "Radio",
  "Size",
  "Slider",
  "Spinner",
  "Stepper",
  "StepperVariant",
  "SvgIcon",
  "Table",
  "TableRow",
  "Toast",
  "ToastType",
  "Toggle",
  "Tooltip",
  "Type",
  "Variant",
  "Widget",
  "iconNames",
  "iconsExternalUrl",
  "presenceLayerStyle"
];

describe("library entry", () => {
  it("exports exactly the public runtime API", () => {
    expect(Object.keys(library).sort()).toEqual([...PUBLIC_RUNTIME_EXPORTS].sort());
  });
});
