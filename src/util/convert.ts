import type { KeyBoardKeyOption, KeySeperator } from "../types/board"
import type { KeyOptions } from "../types/key"

type ConvertedKey = (
    | Required<Pick<KeyOptions, 'label' | 'width'>> & { type: 'key' }
    | Required<KeySeperator>)
    & { index: number }

export function convertKeyFromOptions (def: KeyBoardKeyOption, index: number): ConvertedKey {
    const defaultWidth = 1

    if (typeof def === 'string') return {
        type: 'key',
        label: def,
        width: defaultWidth,
        index,
    }
    else if ('type' in def && def.type === 'seperator') return {
        type: 'seperator',
        width: def.width ?? defaultWidth,
        index
    }
    else return {
        type: 'key',
        label: def.label,
        width: def.width ?? defaultWidth,
        index
    }
}

// type KeyboardMultiLevelStates<S extends string = string> = Record<string, Record<string, KeyboardMultiLevelStates<S>> | KeyboardOptions<S>['states']>

// function flattenStates<S extends string = string>(states: KeyboardMultiLevelStates<S>, joinChar: string, parents?: string[]): KeyboardOptions<S>['states'] {

// }
