import { defineStore } from 'pinia'
import { type Ref, computed, ref, toValue, type MaybeRefOrGetter } from 'vue'

import type { KeyboardFilter, KeyboardOptions } from '../types/board'
import { createObj, keyof } from '../util/shared'

export const useKeyboardStateStore = defineStore('keyboardState', () => {
    const currentState = ref<string>('default')
    const states = ref<KeyboardOptions['states']>({})
    const stateCombineChar = ref<string>('_')

    /** @private */
    function splitState (state: MaybeRefOrGetter<string>): string[] {
        return toValue(state).split(stateCombineChar.value)
    }

    function createState (parts: MaybeRefOrGetter<string>[]): string {
        return parts.map(p => toValue(p)).join(stateCombineChar.value)
    }

    function setCurrentState (parts: MaybeRefOrGetter<string>[]): void {
        const newState = createState(parts)
        if (!states.value[newState]) throw new Error('No state with: ' + newState)

        currentState.value = newState
    }

    function setActiveKeyboard (options: KeyboardOptions): void {
        currentState.value = options.state
        states.value = options.states
    }

    /** @deprecated */
    function switchToKeyboard (options: KeyboardOptions): void {
        setActiveKeyboard(options)
    }

    function isValidState (state: string) {
        return keyof(states.value).includes(state)
    }

    /** @deprecated */
    function combineToState (parts: string[]) {
        setCurrentState(parts)
    }

    /** @private */
    const findNewStatePart = (refs: Ref<string>[], index: number) => {
        for (const state of keyof(states.value)) {
            const replacement = state.split(stateCombineChar.value)[index]
            const newState = createState(refs.map((ref, i) => i === index ? replacement : ref))
            if (isValidState(newState)) return replacement
        }

        return undefined
    }

    const findStateFilterParts = (state: MaybeRefOrGetter<string>[], index: number) => {
        const prefixedState = createState(state.slice(0, index))

        return keyof(states.value).filter(stateName => {
            const parts = splitState(stateName).slice(0, index)

            return prefixedState === createState(parts)
        }).map(state => splitState(state)[index])
    }

    const currentStateParts = computed(() => splitState(currentState))

    const modifiersUsed = computed(() => {
        const stateValues = Object.values(states.value)
            .flatMap(s => Object.values(s).flatMap(e => e.flatMap(ev => ev.events ?? [])))

        return [...new Set(stateValues)]
    })

    const keyLabels = computed(() => {
        return Object.values(states.value)
            .flatMap(s => Object.values(s))
            .flatMap(ev => ev.map(e => ({ label: e.label, modifiers: createObj(e.events ?? [], (): true => true) })))
    })

    const currentStateKeyLabels = computed(() => {
        return Object.values(states.value[currentState.value])
            .flatMap(ev => ev.map(e => ({ label: e.label, modifiers: createObj(e.events ?? [], (): true => true) })))
    })

    const stateLabelLength = computed(() => {
        const lengths = [...new Set(keyof(states.value).map(s => s.split(stateCombineChar.value).length))]
        // TODO: handle different lengths
        if (lengths.length > 1) throw new Error('All states must be equal in length!')
        return lengths[0]
    })

    function createLabelRefs (): Ref<string>[] {
        return currentState.value.split(stateCombineChar.value)
            .map(s => ref<string>(s))
    }

    function createRefLabelGetter (refs: Ref<string>[]): KeyboardFilter[] {
        return refs.map((ref, index) => {
            return {
                ref: ref.value,
                index,
                options: index === 0
                    ? [...new Set(keyof(states.value).map(state => splitState(state)[0]))]
                    : findStateFilterParts(refs, index)
            }
        })
    }

    function updateRef (event: Event, refs: Ref<string>[], refIndex: number): void {
        // @ts-expect-error
        const newValue: string = event.target.value

        refs[refIndex].value = newValue

        if (!isValidState(createState(refs))) {
            for (let i = 0; i < refs.length; i++) {
                if (i === refIndex) continue

                const newPart = findNewStatePart(refs, i)
                if (newPart) {
                    refs[i].value = newPart
                    break;
                }
            }
        }
    }

    return {
        currentState,
        currentStateParts,
        currentStateKeyLabels,
        states,
        stateCombineChar,
        modifiersUsed,
        keyLabels,
        stateLabelLength,
        combineToState,
        setActiveKeyboard,
        setCurrentState,
        switchToKeyboard,
        createLabelRefs,
        createRefLabelGetter,
        updateRef,
        isValidState,
    }
})
