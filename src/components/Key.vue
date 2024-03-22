<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMagicKeys, useMousePressed } from '@vueuse/core';

import { useKeyboardStateStore } from '../composables/'
import { createModifiers, keyModifiers } from '../util/modifiers';

import type { KeyOptions, KeyReactivityOptions } from '../types/key';
import { createKeyList, createObj } from '../util/shared';

const modifiers = createModifiers()
const { modifiersUsed } = useKeyboardStateStore()

interface KeyProps extends KeyOptions {
    board: {
        reactive: KeyReactivityOptions | undefined
        aliasMap: Record<string, string>
    }
}

const props = withDefaults(defineProps<KeyProps>(), {
    width: 1,
    content: () => [],
    reactive: undefined,
})
const el = ref(null)

function isReactive (k: 'click' | 'type'): boolean {
    const board = props.board.reactive, key = props.reactive

    return key != undefined
        ? typeof key === 'boolean'
            ? key 
            : key.includes(k)
        : board != undefined
            ? typeof board === 'boolean'
                ? board
                : board.includes(k)
            : true
}

const reactiveOptions = createObj(['click', 'type'], isReactive)

const activeContent = computed(() => {
    const activeModifiers = createKeyList(keyModifiers, (k) => modifiers[k].value)
    const active = props.content?.filter(c => c.events?.every(e => modifiers[e].value) ?? true)
    const mostEvents = Math.max(...active?.map(c => c.events?.length ?? 0) ?? [0])

    return active?.find(a => {
        const events = (a.events?.length ?? 0) 
        return events === mostEvents && events === activeModifiers.length
    })
})

const color = computed(() => {
    return Object.entries(props.colors)
        .find(([, events]) => activeContent.value?.events ? activeContent.value.events.length === events.length && activeContent.value.events.every(e => events.includes(e)) : false)?.[0] ?? 'var(--vks-key-bg)'
})

const isModifier = Object.keys(keyModifiers).concat('Ctrl').includes(props.label)
const isModifierName = (label: string) => label === props.label || (props.label === 'Ctrl' && label === 'Control')

const modifierColor = computed(() => {
    return isModifier && modifiersUsed?.some(isModifierName)
        && (Object.entries(props.colors).find(([, events]) => events.length === 1 && isModifierName(events[0]))
            ?.[0] ?? 'green')
        || undefined
})

const modifierBorderColor = computed(() => modifierColor.value ?? 'green')

const { pressed } = useMousePressed({
    target: el,
    initialValue: false,
})

const { current } = useMagicKeys({ reactive: true, aliasMap: { ctrl: 'control' } })
</script>

<template>
    <div :class="{
        'key-container': true,
        'active': (reactiveOptions.click ? pressed : false) || (reactiveOptions.type ? current.has(props.label.toLowerCase()) : false),
        'modifier': isModifier,
        'disabled': !isModifier ? content == undefined : modifierColor == undefined,
    }" ref="el">
        <div class="key-container-top">
            <div class="key-container-top-label">
                {{ label }}
            </div>
            <div class="key-container-top-dot" v-if="activeContent != undefined">
                <span class="key-dot">
                </span>
            </div>
        </div>
        <div :class="'key-container-bottom'" >
            {{ activeContent?.label }}
        </div>
    </div>
</template>

<style scoped>
.key-container {
    height: var(--vks-key-height);
    line-height: normal !important;
    width: calc(v-bind(width) * 50px);
    margin: 4px;
    background-color: v-bind(color);
    color: var(--vks-key-text);
    padding: 2px;
    font-size: var(--vks-key-font-size);
    border-radius: var(--vks-border-radius);
    display: block;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    opacity: var(--vks-key-opacity-enabled);
    box-shadow: inset 0px 0px 0px 1px var(--vks-key-border-outer),
        inset 0px 0px 0px 2px var(--vks-key-border-inner),
        0px 2px 0px 0px var(--vks-key-border-press),
        0px 3px 0px 0px var(--vks-key-border-bottom),
        0px 3px 3px 0px rgba(0, 0, 0, 0.5);
}

.key-container.disabled {
    opacity: var(--vks-key-opacity-disabled);
}

.key-container.modifier {
    box-shadow: inset 0px 0px 0px 1px v-bind(modifierBorderColor),
        inset 0px 0px 0px 2px var(--vks-key-border-inner),
        0px 2px 0px 0px var(--vks-key-border-press),
        0px 3px 0px 0px var(--vks-key-border-bottom),
        0px 3px 3px 0px rgba(0, 0, 0, 0.5);
}

.key-container.modifier.active {
    background-color: v-bind(modifierColor);
}

.key-container.active {
    transform: translateY(2px);
    box-shadow: inset 0px 0px 0px 1px var(--vks-key-border-outer),
        inset 0px 0px 0px 2px var(--vks-key-border-inner),
        0px 0px 0px 0px var(--vks-key-border-press),
        0px 1px 0px 0px var(--vks-key-border-bottom),
        0px 1px 3px 0px rgba(0, 0, 0, 0.5);
}

.key-container-top {
    display: block;
    width: 100%;
    position: absolute;
    top: 4px;
    left: 4px;
}

.key-container-bottom {
    display: block;
    width: 100%;
    position: absolute;
    left: 0px;
    bottom: 4px;
    text-align: center;
}
</style>
