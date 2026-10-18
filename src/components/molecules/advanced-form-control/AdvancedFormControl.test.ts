import { mount, type VueWrapper } from "@vue/test-utils";
import { computeAccessibleName } from "dom-accessibility-api";
import { afterEach, describe, expect, it, vi } from "vitest";
import { h, nextTick, type VNode } from "vue";

import Dropdown from "../../atoms/dropdown/Dropdown.vue";
import SvgIcon from "../../atoms/svg-icon/SvgIcon.vue";
import Tooltip from "../../atoms/tooltip/Tooltip.vue";
import AdvancedFormControl from "./AdvancedFormControl.vue";
import type { AdvancedCurrencyFieldOption } from "./types";

let wrapper: VueWrapper | null = null;

afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
});

function mountWithError(errorMsg: string) {
  wrapper = mount(AdvancedFormControl, {
    props: { id: "amount", currencyOptions: [], placeholder: "0", errorMsg },
    global: { stubs: { transition: false } }
  });
  return wrapper;
}

const message = (text: string) => (span: { text: () => string }) => span.text() === text;

describe("AdvancedFormControl error message", () => {
  it("enters through a CSS transition when the control mounts with an error", async () => {
    const control = mountWithError("Insufficient balance");
    await nextTick();

    expect(control.find(".error-enter-active").text()).toBe("Insufficient balance");
  });

  it("lets the old message leave before the new one enters", async () => {
    const control = mountWithError("Insufficient balance");
    await control.setProps({ errorMsg: "Amount exceeds the limit" });

    expect(control.findAll("span").filter(message("Amount exceeds the limit"))).toHaveLength(0);
    expect(control.find(".error-leave-active").text()).toBe("Insufficient balance");
  });

  it("leaves through a CSS transition when the error clears", async () => {
    const control = mountWithError("Insufficient balance");
    await control.setProps({ errorMsg: "" });

    expect(control.find(".error-leave-active").text()).toBe("Insufficient balance");
  });
});

describe("AdvancedFormControl error row", () => {
  it("draws a 16px warning icon in the error tone on the message's first line", async () => {
    const control = mountWithError("Insufficient balance");
    const row = control.findAll("span").find(message("Insufficient balance"))!.element.parentElement;
    const icon = control.findAllComponents(SvgIcon).find((candidate) => candidate.element.parentNode === row)!;
    const svg = await vi.waitFor(() => icon.get("svg").element);

    expect(icon.props()).toMatchObject({ name: "warning", size: "xs", defaultColor: false });
    expect(svg.getAttribute("width")).toBe("16");
    expect([...svg.classList]).toEqual(expect.arrayContaining(["fill-typography-error", "mt-0.5", "shrink-0"]));
    expect(svg.classList).not.toContain("fill-icon-default");
    expect(svg.parentElement).toBe(row);
  });

  it("aligns the row to its top with 8px between the icon and the message", () => {
    const control = mountWithError("Insufficient balance");
    const row = control.findAll("span").find(message("Insufficient balance"))!.element.parentElement!;

    expect([...row.classList]).toEqual(expect.arrayContaining(["items-start", "gap-2"]));
    expect(row.classList).not.toContain("items-center");
  });

  it("keeps the message a direct child of the only element in the error tone", () => {
    const control = mountWithError("Insufficient balance");
    const toned = control.findAll(".text-typography-error");

    expect(toned).toHaveLength(1);
    expect(toned[0]!.element.tagName).toBe("DIV");
    expect(toned[0]!.findAll(":scope > span").filter(message("Insufficient balance"))).toHaveLength(1);
  });
});

type FieldProps = {
  positive?: boolean;
  value?: string;
  tooltip?: string;
  label?: string;
  labelAdvanced?: boolean;
  balanceLabel?: string;
  hideBalance?: boolean;
  balanceRow?: boolean;
  errorMsg?: string;
  selectedCurrencyOption?: AdvancedCurrencyFieldOption;
};

function mountField(props: FieldProps = {}, slots: Record<string, () => VNode[]> = {}) {
  wrapper = mount(AdvancedFormControl, {
    props: { id: "amount", currencyOptions: [], placeholder: "0", ...props },
    slots,
    attachTo: document.body,
    global: { stubs: { transition: false } }
  });
  return wrapper;
}

function field() {
  return wrapper!.get<HTMLInputElement>("input").element;
}

function emitted() {
  return (wrapper!.emitted("input") ?? []).map(([value]) => value);
}

// Plays what a browser does for an insertion: a cancelable beforeinput, then (unless cancelled) the text lands at the selection and input fires.
async function insert(text: string, inputType = "insertFromPaste", viaDataTransfer = false) {
  const input = field();
  const before = new InputEvent("beforeinput", {
    inputType,
    data: viaDataTransfer ? null : text,
    cancelable: true,
    bubbles: true
  });
  if (viaDataTransfer) {
    Object.defineProperty(before, "dataTransfer", { value: { getData: () => text } });
  }
  input.dispatchEvent(before);
  if (!before.defaultPrevented) {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.value = input.value.slice(0, start) + text + input.value.slice(end);
    input.dispatchEvent(new InputEvent("input", { inputType, data: text, bubbles: true }));
  }
  await nextTick();
}

describe("AdvancedFormControl amount grammar", () => {
  it.each(["1e5", "0x10", "Infinity", "abc", "1,5", "1.2.3", " 1e5 "])("refuses the paste %j whole", async (text) => {
    mountField({ value: "" });
    await insert(text);

    expect(field().value).toBe("");
    expect(emitted()).toEqual([]);
  });

  it("refuses a pasted minus sign when the field is positive", async () => {
    mountField({ positive: true });
    await insert("-3");

    expect(field().value).toBe("");
    expect(emitted()).toEqual([]);
  });

  it("refuses a dropped text read from the data transfer", async () => {
    mountField();
    await insert("1e5", "insertFromDrop", true);

    expect(field().value).toBe("");
    expect(emitted()).toEqual([]);
  });

  it.each([
    ["1,000.50", "1000.50", "1,000.50"],
    [" 5 ", "5", "5"],
    ["12.5", "12.5", "12.5"],
    ["-3", "-3", "-3"]
  ])("accepts the paste %j and emits %j", async (text, value, display) => {
    mountField();
    await insert(text);

    expect(field().value).toBe(display);
    expect(emitted()).toEqual([value]);
  });

  it("replaces the selected text with the paste", async () => {
    mountField({ value: "1000" });
    await nextTick();
    field().setSelectionRange(0, field().value.length);
    await insert("7");

    expect(field().value).toBe("7");
    expect(emitted()).toEqual(["7"]);
  });

  it("refuses typed text that would leave the grammar", async () => {
    mountField({ value: "5" });
    await nextTick();
    field().setSelectionRange(1, 1);
    await insert("-", "insertText");

    expect(field().value).toBe("5");
    expect(emitted()).toEqual([]);
  });

  it("restores the last valid text when an uncancelable insertion leaves the grammar", async () => {
    mountField();
    await insert("12");
    const input = wrapper!.get("input");
    input.element.value = "abc";
    await input.trigger("input");

    expect(field().value).toBe("12");
    expect(emitted()).toEqual(["12"]);
  });

  it("restores the value the consumer wrote last", async () => {
    mountField();
    await wrapper!.setProps({ value: "1234" });
    const input = wrapper!.get("input");
    input.element.value = "abc";
    await input.trigger("input");

    expect(field().value).toBe("1,234");
  });

  it("emits a touch paste that comes without a keyup", async () => {
    mountField();
    const input = wrapper!.get("input");
    input.element.value = "12.5";
    await input.trigger("input");

    expect(emitted()).toEqual(["12.5"]);
  });

  it("blocks the space key", async () => {
    mountField();
    const event = new KeyboardEvent("keydown", { key: " ", code: "Space", cancelable: true, bubbles: true });
    field().dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});

function countInputClicks() {
  let clicks = 0;
  field().addEventListener("click", () => {
    clicks += 1;
  });
  return () => clicks;
}

const helpSlot = () => [h("span", "Stop loss"), h(Tooltip, { content: "Help" }, () => h("span", "help"))];

function textNode(text: string) {
  const node = wrapper!.findAll("span").find((span) => span.text() === text);
  if (!node) {
    throw new Error(`no span reads ${text}`);
  }
  return node;
}

describe("AdvancedFormControl label", () => {
  it("does not activate the input when a Tooltip in the label slot is clicked", async () => {
    mountField({ labelAdvanced: true }, { label: helpSlot });
    const clicks = countInputClicks();
    await textNode("help").trigger("click");

    expect(clicks()).toBe(0);
  });

  it("still activates the input when the label text is clicked", async () => {
    mountField({ labelAdvanced: true }, { label: helpSlot });
    const clicks = countInputClicks();
    await textNode("Stop loss").trigger("click");

    expect(clicks()).toBe(1);
  });

  it("opens the built-in tooltip on a tap without activating the input", async () => {
    mountField({ label: "Amount", tooltip: "Help text" });
    const clicks = countInputClicks();
    const help = textNode("?").element;
    help.parentElement!.dispatchEvent(new MouseEvent("mouseenter"));
    help.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await nextTick();

    expect(clicks()).toBe(0);
    expect(document.body.textContent).toContain("Help text");
  });
});

const collateral = () => [h("span", "Collateral")];

const chips = () => [
  h("div", { role: "group", "aria-label": "Collateral" }, [
    h("button", { type: "button", class: "active", "aria-pressed": "true" }, "USDC"),
    h("button", { type: "button", "aria-pressed": "false" }, "SOL")
  ])
];

const usdc: AdvancedCurrencyFieldOption = {
  value: "usdc",
  label: "USDC",
  balance: { value: "2500", ticker: "USDC" }
};

function fieldLabel() {
  return wrapper!.get("label[for='amount']").element;
}

function chip(text: string) {
  const button = wrapper!.findAll("button").find((node) => node.text() === text);
  if (!button) {
    throw new Error(`no button reads ${text}`);
  }
  return button;
}

describe("AdvancedFormControl label actions", () => {
  it("renders the actions beside the label on the label line, outside the label", () => {
    mountField(
      { labelAdvanced: true, balanceLabel: "Balance", selectedCurrencyOption: usdc },
      { label: collateral, "label-actions": chips }
    );
    const label = fieldLabel();
    const group = wrapper!.get("[role='group']").element;
    const balance = textNode("2500 USDC").element;
    let line = label.parentElement;
    while (line && !line.contains(balance)) {
      line = line.parentElement;
    }

    expect(label.contains(group)).toBe(false);
    expect(label.compareDocumentPosition(group) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(label.nextElementSibling?.contains(group)).toBe(true);
    expect(line?.contains(group)).toBe(true);
    expect(line?.contains(field())).toBe(false);
  });

  it("does not render the actions without labelAdvanced", () => {
    mountField({ label: "Amount" }, { "label-actions": chips });

    expect(wrapper!.find("[role='group']").exists()).toBe(false);
    expect(wrapper!.text()).not.toContain("USDC");
  });

  it("keeps the label text as the input's accessible name", () => {
    mountField({ labelAdvanced: true }, { label: collateral, "label-actions": chips });

    expect(computeAccessibleName(field())).toBe("Collateral");
  });

  it("does not activate the input when the label beside the actions is clicked", async () => {
    mountField({ labelAdvanced: true }, { label: collateral, "label-actions": chips });
    const clicks = countInputClicks();
    await textNode("Collateral").trigger("click");
    await wrapper!.get("label[for='amount']").trigger("click");

    expect(clicks()).toBe(0);
    expect(document.activeElement).not.toBe(field());
    expect(computeAccessibleName(field())).toBe("Collateral");
  });

  it("keeps a click on an action away from the label and the input", async () => {
    mountField({ labelAdvanced: true }, { label: collateral, "label-actions": chips });
    const clicks = countInputClicks();
    let labelClicks = 0;
    fieldLabel().addEventListener("click", () => {
      labelClicks += 1;
    });
    await chip("SOL").trigger("click");

    expect(labelClicks).toBe(0);
    expect(clicks()).toBe(0);
    expect(document.activeElement).not.toBe(field());
  });

  it("keeps the label, its tooltip and the balance of a field without actions", async () => {
    mountField(
      { labelAdvanced: true, tooltip: "Help text", balanceLabel: "Balance", selectedCurrencyOption: usdc },
      { label: collateral }
    );
    const label = fieldLabel();

    expect(label.textContent).toContain("Collateral");
    expect(label.querySelector("[data-tooltip-trigger]")).not.toBeNull();
    expect(computeAccessibleName(field())).toContain("Collateral");

    await textNode("2500 USDC").trigger("click");

    expect(emitted()).toEqual(["2500"]);
    expect(field().value).toBe("2,500");
  });
});

describe("AdvancedFormControl label line without actions", () => {
  it("keeps the label a direct child of the line, between the picker and the balance", () => {
    mountField(
      { labelAdvanced: true, tooltip: "Help text", balanceLabel: "Balance", selectedCurrencyOption: usdc },
      { label: collateral }
    );
    const label = fieldLabel();
    const balance = textNode("2500 USDC").element.parentElement;
    const line = label.parentElement!;

    expect([...line.children]).toEqual([wrapper!.findComponent(Dropdown).element, label, balance]);
    expect(line.lastElementChild).toBe(balance);
    expect(line.lastElementChild?.textContent).toContain("2500 USDC");
  });

  it("keeps the label the line's last child when the balance is hidden", () => {
    mountField({ labelAdvanced: true, hideBalance: true }, { label: collateral });
    const label = fieldLabel();

    expect([...label.parentElement!.children]).toEqual([wrapper!.findComponent(Dropdown).element, label]);
  });

  it.each([undefined, false])(
    "keeps the root to the label line and the amount block with balanceRow %j",
    (balanceRow) => {
      mountField(
        { labelAdvanced: true, balanceRow, balanceLabel: "Balance", selectedCurrencyOption: usdc },
        { label: collateral }
      );

      expect(rootChildren()).toEqual([fieldLabel().parentElement, amountBlock()]);
    }
  );

  it.each([undefined, false])("adds only the error block to the root with balanceRow %j", (balanceRow) => {
    mountField(
      { labelAdvanced: true, balanceRow, balanceLabel: "Balance", selectedCurrencyOption: usdc, errorMsg: "Too much" },
      { label: collateral }
    );
    const error = textNode("Too much").element.parentElement;

    expect(rootChildren()).toEqual([fieldLabel().parentElement, amountBlock(), error]);
  });

  it.each([undefined, false])(
    "keeps the line to the picker, the label group and the balance with actions and balanceRow %j",
    (balanceRow) => {
      mountField(
        { labelAdvanced: true, balanceRow, balanceLabel: "Balance", selectedCurrencyOption: usdc },
        { label: collateral, "label-actions": chips }
      );
      const group = fieldLabel().parentElement!;
      const line = group.parentElement!;
      const balance = textNode("2500 USDC").element.parentElement;

      expect([...line.children]).toEqual([wrapper!.findComponent(Dropdown).element, group, balance]);
      expect(rootChildren()).toEqual([line, amountBlock()]);
    }
  );
});

function rootChildren() {
  return [...wrapper!.element.children];
}

function amountBlock() {
  return field().parentElement;
}

describe("AdvancedFormControl balance row", () => {
  it("moves the balance off the label line to its own row before the amount", () => {
    mountField(
      { labelAdvanced: true, balanceRow: true, balanceLabel: "Balance", selectedCurrencyOption: usdc },
      { label: collateral, "label-actions": chips }
    );
    const label = fieldLabel();
    const group = wrapper!.get("[role='group']").element;
    const line = label.parentElement!.parentElement!;
    const row = line.nextElementSibling!;

    expect(line.contains(label)).toBe(true);
    expect(line.contains(group)).toBe(true);
    expect(line.textContent).not.toContain("Balance");
    expect(line.textContent).not.toContain("2500 USDC");
    expect([...row.children].map((span) => span.textContent?.trim())).toEqual(["Balance", "2500 USDC"]);
    expect(row.nextElementSibling).toBe(amountBlock());
    expect(rootChildren()).toEqual([line, row, amountBlock()]);
  });

  it("fills the field from the amount on the balance row and keeps the label as the input's name", async () => {
    mountField(
      { labelAdvanced: true, balanceRow: true, balanceLabel: "Balance", selectedCurrencyOption: usdc },
      { label: collateral, "label-actions": chips }
    );
    await textNode("2500 USDC").trigger("click");

    expect(emitted()).toEqual(["2500"]);
    expect(field().value).toBe("2,500");
    expect(computeAccessibleName(field())).toBe("Collateral");
  });

  it("drops the label group's trailing margin only on the balance row", () => {
    const groupClasses = (props: FieldProps) => {
      mountField(
        { labelAdvanced: true, selectedCurrencyOption: usdc, ...props },
        { label: collateral, "label-actions": chips }
      );
      const classes = [...fieldLabel().parentElement!.classList];
      wrapper!.unmount();
      wrapper = null;
      return classes;
    };

    expect(groupClasses({ balanceRow: true })).not.toContain("mr-3");
    expect(groupClasses({})).toContain("mr-3");
    expect(groupClasses({ balanceRow: false })).toContain("mr-3");
    expect(groupClasses({ hideBalance: true })).toContain("mr-3");
  });

  it("leaves the picker and the label alone on the line without actions", () => {
    mountField(
      { labelAdvanced: true, balanceRow: true, balanceLabel: "Balance", selectedCurrencyOption: usdc },
      { label: collateral }
    );
    const label = fieldLabel();
    const line = label.parentElement!;
    const row = line.nextElementSibling!;

    expect([...line.children]).toEqual([wrapper!.findComponent(Dropdown).element, label]);
    expect(row.textContent).toContain("Balance");
    expect(row.textContent).toContain("2500 USDC");
    expect(row.nextElementSibling).toBe(amountBlock());
  });

  it("renders no balance anywhere when the balance is hidden", () => {
    mountField(
      {
        labelAdvanced: true,
        balanceRow: true,
        hideBalance: true,
        balanceLabel: "Balance",
        selectedCurrencyOption: usdc
      },
      { label: collateral, "label-actions": chips }
    );

    expect(wrapper!.text()).not.toContain("Balance");
    expect(wrapper!.text()).not.toContain("2500");
    expect(rootChildren()).toEqual([fieldLabel().parentElement!.parentElement, amountBlock()]);
  });

  it("puts the balance row under the picker line outside labelAdvanced", () => {
    mountField({ label: "Amount", balanceRow: true, balanceLabel: "Balance", selectedCurrencyOption: usdc });
    const picker = wrapper!.findComponent(Dropdown).element;
    const line = picker.parentElement!;
    const row = line.nextElementSibling!;

    expect([...line.children]).toEqual([picker]);
    expect([...row.children].map((span) => span.textContent?.trim())).toEqual(["Balance", "2500 USDC"]);
    expect(row.nextElementSibling).toBe(amountBlock());
  });
});
