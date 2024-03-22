<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import Key from './Key.vue'
import KeySeparator from './KeySeparator.vue';

import { useKeyboardStateStore } from '../composables/'
import { convertKeyFromOptions } from '../util/convert';

import type { KeyboardFilter, KeyboardOptions } from '../types/board';

const props = withDefaults(defineProps<KeyboardOptions>(), {
    reactive: undefined,
    aliasMap: () => ({}),
})

// TODO: why TF are there two stores????
const store = useKeyboardStateStore()
store.setActiveKeyboard(props)

const keyboardState = useKeyboardStateStore()
const refs = keyboardState.createLabelRefs()
const filters = ref<KeyboardFilter[]>([])

watch(refs, () => {
    keyboardState.setCurrentState(refs.map(r => r.value))
    filters.value = keyboardState.createRefLabelGetter(refs)
})

onMounted(() => {
    filters.value = keyboardState.createRefLabelGetter(refs)
})

const onChange = (event: Event, filter: KeyboardFilter) => {
    keyboardState.updateRef(event, refs, filter.index)
}
</script>

<template>
    <div class="container">
        <slot name="filters" :filters="filters" :onChange="onChange" />

        <div class="keyboard-container">
            <div class="keyboard-row" v-for="row, i in keys" :key="i">
                <div class="keyboard-key" v-for="key in row.map(convertKeyFromOptions)" :key="key.index">
                    <KeySeparator v-if="key.type === 'seperator'" :width="key.width" />
                    <Key v-else :label="key.label" :board="{ reactive: $props.reactive, aliasMap: $props.aliasMap! }"
                        :width="key.width" :colors="colors" :content="states[store.currentState][key.label]" />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@import '../styles/variables.css';
</style>

<style scoped>
.keyboard-container {
    border: 1px solid var(--vks-keyboard-border);
    background-color: var(--vks-keyboard-bg);
    padding: 10px 40px;
    margin: 20px;
}

.keyboard-row {
    display: flex;
    align-items: center;
    flex-direction: row;
}
</style>