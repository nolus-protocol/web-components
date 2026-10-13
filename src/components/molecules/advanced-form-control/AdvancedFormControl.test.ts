import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { h, nextTick, type VNode } from "vue";

import Tooltip from "../../atoms/tooltip/Tooltip.vue";
import AdvancedFormControl from "./AdvancedFormControl.vue";

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

type FieldProps = { positive?: boolean; value?: string; tooltip?: string; label?: string; labelAdvanced?: boolean };

function mountField(props: FieldProps = {}, slots: Record<string, () => VNode[]> = {}) {
  wrapper = mount(AdvancedFormControl, {
    props: { id: "amount", currencyOptions: [], placeholder: "0", ...props },
    slots,
    attachTo: document.body
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
