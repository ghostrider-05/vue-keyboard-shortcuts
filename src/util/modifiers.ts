import { useKeyModifier, type UseKeyModifierReturn, type UseModifierOptions } from "@vueuse/core"

import type { KeyBoardModifier } from "../types/modifier"
import { createObj, keyof } from "./shared"

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
