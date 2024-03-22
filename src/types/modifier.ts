import type { KeyModifier } from "@vueuse/core";

export type KeyBoardModifier = Exclude<KeyModifier,
    | 'CapsLock'
    | 'Symbol'
    | 'SymbolLock'
    | 'Meta'
    | 'AltGraph'
    | 'Fn'
    | 'FnLock'
    | 'NumLock'
    | 'ScrollLock'
>
