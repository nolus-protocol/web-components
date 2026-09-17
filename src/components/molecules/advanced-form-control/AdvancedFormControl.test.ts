import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

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

const transitionClasses = (element: Element | undefined) =>
  element ? [...element.classList].filter((name) => name.startsWith("error-")) : [];

describe("AdvancedFormControl error message", () => {
  it("enters through a CSS transition when the control mounts with an error", async () => {
    const control = mountWithError("Insufficient balance");
    await nextTick();

    const block = control.find(".text-typography-error");
    expect(block.text()).toBe("Insufficient balance");
    expect(transitionClasses(block.element)).toContain("error-enter-active");
  });

  it("lets the old message leave before the new one enters", async () => {
    const control = mountWithError("Insufficient balance");
    await control.setProps({ errorMsg: "Amount exceeds the limit" });

    const messages = control.findAll(".text-typography-error span").map((span) => span.element);
    expect(messages.map((message) => message.textContent)).toEqual(["Insufficient balance"]);
    expect(transitionClasses(messages[0])).toContain("error-leave-active");
  });

  it("leaves through a CSS transition when the error clears", async () => {
    const control = mountWithError("Insufficient balance");
    await control.setProps({ errorMsg: "" });

    expect(transitionClasses(control.find(".text-typography-error").element)).toContain("error-leave-active");
  });
});
