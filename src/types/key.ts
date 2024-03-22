import type { KeyBoardModifier } from "./modifier"

export type KeyWidth =
    | 1
    | 1.2
    | 1.5
    | 1.7
    | 1.9
    | 2
    | 2.525
    | 2.6
    | 3
    | 4
    | 7

export type KeyReactivityOptions = 
    | boolean
    | ('click' | 'type')[]

export interface KeyOptions {
    // color?: string
    // topRightDot?: boolean
    // modifier?: KeyBoardModifier
    width?: KeyWidth
    colors: Record<string, KeyBoardModifier[]>
    label: string
    content?: {
        label: string
        events?: KeyBoardModifier[]
    }[]
    // _modifiersUsedInCurrentState?: KeyBoardModifier[]
    reactive?: KeyReactivityOptions
    board: {
        reactive: KeyReactivityOptions | undefined
        aliasMap: Record<string, string>
    }
}
