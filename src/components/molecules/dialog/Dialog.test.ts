import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import Dialog from "./Dialog.vue";

let wrapper: VueWrapper | null = null;

afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
  document.body.innerHTML = "";
  document.documentElement.style.overflow = "";
});

const STICKY = ["max-md:sticky", "max-md:bottom-0", "max-md:bg-neutral-bg-2"];

async function openFooter({ stickyFooter }: { stickyFooter?: boolean }) {
  wrapper = mount(Dialog, {
    props: { title: "Export", stickyFooter },
    slots: { content: "<p>Rows</p>", footer: "<button>Download CSV</button>" },
    attachTo: document.body
  });
  (wrapper.vm as unknown as { show: () => void }).show();
  await nextTick();
  const button = [...document.body.querySelectorAll("button")].find((node) => node.textContent === "Download CSV");
  return button!.parentElement!;
}

describe("Dialog footer", () => {
  it("stays at the bottom of the phone sheet, opaque, with stickyFooter", async () => {
    const footer = await openFooter({ stickyFooter: true });

    expect([...footer.classList]).toEqual(expect.arrayContaining(STICKY));
    expect(footer.parentElement!.lastElementChild).toBe(footer);
  });

  it.each([undefined, false])("scrolls with the content when stickyFooter is %j", async (stickyFooter) => {
    const footer = await openFooter({ stickyFooter });

    expect([...footer.classList].filter((name) => STICKY.includes(name))).toEqual([]);
    expect([...footer.classList]).toEqual(["border-t", "border-border-default", "p-6"]);
  });
});
