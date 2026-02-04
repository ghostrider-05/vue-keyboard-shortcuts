<script setup lang="ts">
import {
    KeyBoard,
    defineKeyboard,
    type KeyboardOptions,
} from '../../../../src'

import { useData } from 'vitepress'

const { params } = useData()

const props = defineProps<{
    states: KeyboardOptions<string>['states']
}>()

const keyboard = defineKeyboard<string>({
    defaultState: 'Engine_Editor',
    states: props.states,
})
</script>

<template>
    <div class="container">
        <h1>Engine Shortcut mapper</h1>
        <p style="font-style: italic;">Shortcuts used in {{ params?.course }}</p>
        <p style="margin-bottom: 20px;">A visual shortcuts explorer for the applications we use.</p>

        <KeyBoard v-bind="keyboard">
            <template #filters="{ filters, onChange }">
                <div class="options" :style="{ width: `${filters.length * 120}px` }">
                    <select v-for="filter in filters" :value="filter.ref" @change="e => onChange(e, filter)">
                        <option v-for="option in filter.options" :value="option">
                            {{ option }}
                        </option>
                    </select>
                </div>
            </template>
        </KeyBoard>

    </div>
</template>

<style>
:root {
    --vks-keyboard-bg: var(--vp-c-bg-alt);
    --vks-keyboard-border: var(--vp-c-border);

    --vks-key-bg: var(--vp-c-bg-soft);
    --vks-key-text: var(--vp-c-text-1);

    --vks-key-border-outer: var(--vp-c-bg);
    --vks-key-border-inner: var(--vp-c-neutral);
    --vks-key-border-press: var(--vp-c-brand-1);
    --vks-key-border-bottom: var(--vp-c-bg-soft);

    --vtk-key-bg-shift: var(--vp-c-green-1);
    --vtk-key-bg-control: var(--vp-c-purple-1);
    --vtk-key-bg-alt: var(--vp-c-indigo-1);
    --vtk-key-bg-control-shift: var(--vp-c-sponsor);
    --vtk-key-bg-control-alt: var(--vp-c-neutral-inverse);
    --vtk-key-bg-shift-alt: var(--vp-c-yellow-1);
    --vtk-key-bg-control-shift-alt: var(--vp-c-red-1);
}
</style>

<style scoped>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.container h1 {
    margin: 20px;
    font-size: 40px;
    font-weight: bold;
}

.options {
    max-width: 95vw;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-items: center;
}

.options select {
    appearance: auto !important;
    -webkit-appearance: auto !important;
    padding: 8px 10px;
    background-color: var(--vp-c-bg-alt);
    border: 1px solid var(--vp-c-border);
    border-radius: 4px;
}
</style>
