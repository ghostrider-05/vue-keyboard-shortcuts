import { useKeyModifier, type UseKeyModifierReturn, type UseModifierOptions } from "@vueuse/core"

import type { KeyBoardModifier } from "../types/modifier"
import { keyof } from "./shared"

const createObj = <T extends string, V>(keys: T[], value: (key: T) => V): Record<T, V> => {
    return keys.reduce((obj, key) => ({
        ...obj,
        [key]: value(key),
    }), {} as Record<T, V>)
}

const useModifierOptions: UseModifierOptions<false> = {
    initial: false,
}

export const keyModifiers: Record<KeyBoardModifier, KeyBoardModifier> = {
    Alt: 'Alt',
    Control: 'Control',
    Shift: 'Shift',
}

export const createModifiers = (): Record<KeyBoardModifier, UseKeyModifierReturn<false>> => {
    return createObj(keyof(keyModifiers), (key) => useKeyModifier(key, useModifierOptions))
}
