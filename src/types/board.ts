import type { KeyOptions, KeyReactivityOptions } from "./key"
import type { KeyBoardModifier } from "./modifier"

export interface KeySeperator {
    type: 'seperator'
    width?: number
}

export type KeyBoardKeyOption = 
    | Pick<KeyOptions, 'label' | 'width'> & { type?: 'key' }
    | KeySeperator
    | string

export type KeyboardRowOptions = KeyBoardKeyOption[]

export type KeyBoardStates<States extends string = string> = Record<States, Record<string, NonNullable<KeyOptions['content']>>>

export interface KeyboardOptions<States extends string = string> {
    colors: Record<string, KeyBoardModifier[]>
    aliasMap?: Record<string, string>
    reactive?: KeyReactivityOptions
    keys: KeyboardRowOptions[]
    states: KeyBoardStates<States>
    state: States
}

export interface KeyboardFilter {
    ref: string
    index: number
    options: string[]
}
