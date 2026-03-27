<template>
  <Button
    ref="popoverParent"
    severity="tertiary"
    icon="table-options"
    size="medium"
    :class="tableSettingsPopoverRef?.isOpen ? 'active' : ''"
    @click="tableSettingsPopoverRef?.toggle()"
  />
  <Popover
    ref="tableSettingsPopoverRef"
    position="bottom-right"
    :parent="popoverParent"
    class="md:w-[17rem]"
    :fullscreen-on-mobile="false"
  >
    <template #content>
        <div class="flex flex-col gap-2 p-4">
            <Toggle
            v-if="toggle"
            v-bind="toggle"
            v-model="toggle.value"
            @input="onSmallBalancesChange"
            />
            <Toggle 
            v-if="hideValues"
            v-bind="hideValues"
            :label="hideValues.text"
            v-model="hideValues.value"
            @input="onHideValuesChange"
            />
        </div>
    </template>
  </Popover>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Button, Popover, Toggle, SvgIcon } from "@/components";
import { type TableSettingsProps } from "./types";

enum Subscription {
  subscribed = "subscribed",
  unsubscribed = "unsubscribed"
}

const tableSettingsPopoverRef = ref<InstanceType<typeof Popover> | null>(null);
const props = defineProps<TableSettingsProps>();
const emit = defineEmits<{
    (e: "togle-value", value: boolean): void;
    (e: "hide-value", value: boolean): void;
}>();

const popoverParent = ref();

function onHideValuesChange() {
    props.hideValues!.value = !props.hideValues!.value;
    emit("hide-value", props.hideValues!.value);
}

function onSmallBalancesChange(data: boolean) {
    emit("togle-value", data);
}

</script>

<style scoped lang=""></style>
