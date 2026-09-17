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
