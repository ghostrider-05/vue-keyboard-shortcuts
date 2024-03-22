import { keyModifiers } from './modifiers'
import { createKeyList, keyof } from './shared'

import type { KeyboardOptions } from "../types/board"
import type { KeyBoardModifier } from '../types/modifier'

export const defaultKeyboardKeys: KeyboardOptions['keys'] = [
    [
        'Esc',
        { type: 'seperator', width: 1.15 },
        'F1', 'F2', 'F3', 'F4',
        { type: 'seperator', width: 0.35 },
        'F5', 'F6', 'F7', 'F8',
        { type: 'seperator', width: 0.35 },
        'F9', 'F10', 'F11', 'F12',
        { type: 'seperator', width: 0.35 },
        // 'Print Screen', 'Scroll Lock', 'Pause Break',
    ],
    [
        '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
        { label: 'Backspace', width: 1.7 },
    ],
    [  
        { label: 'Tab', width: 1.5 },
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
        { label: '\\', width: 1.2 },
    ],
    [
        { label: 'Caps Lock', width: 1.9 },
        'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'",
        { label: 'Enter', width: 2 },
    ],
    [
        { label: 'Shift', width: 2.525 },
        'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
        { label: 'Shift', width: 2.525 },
    ],
    [
        { label: 'Ctrl', width: 1.2 },
        { label: 'OS', width: 1.2 },
        { label: 'Alt', width: 1.2 },
        { label: 'Space', width: 7 },
        { label: 'Alt', width: 1.2 },
        { label: 'OS', width: 1.2 },
        '',
        { label: 'Ctrl', width: 1.7 },
    ],
]

export type KeyboardDefineOptions<S extends string = string> =
    & Required<Pick<KeyboardOptions<S>, 'states'>>
    & Partial<Omit<KeyboardOptions<S>, 'state'>>
    & { defaultState: S }

// TODO: use NoInfer type for defaultState that comes in ts 5.4.2
export function defineKeyboard<S extends string = string>(options: KeyboardDefineOptions<S>): KeyboardOptions<S> {
    return {
        state: options.defaultState,
        states: options.states,
        colors: options.colors ?? {
            'var(--vtk-key-bg-active)': [],
            'var(--vtk-key-bg-shift)': [keyModifiers.Shift],
            'var(--vtk-key-bg-control)': [keyModifiers.Control],
            'var(--vtk-key-bg-alt)': [keyModifiers.Alt],
            'var(--vtk-key-bg-control-shift)': [keyModifiers.Control, keyModifiers.Shift],
            'var(--vtk-key-bg-control-alt)': [keyModifiers.Control, keyModifiers.Alt],
            'var(--vtk-key-bg-shift-alt)': [keyModifiers.Shift, keyModifiers.Alt],
            'var(--vtk-key-bg-control-shift-alt)': [keyModifiers.Control, keyModifiers.Shift, keyModifiers.Alt],
        },
        keys: options.keys ?? defaultKeyboardKeys,
    }
}

type KeyboardFunctionState = {
    [label: string]: string | [string] | [string, Partial<Record<KeyBoardModifier, true>>]
}

type KeyBoardByFunctionStates<S extends string = string> = {
    [State in S]: KeyboardFunctionState
}

export type KeyboardDefineByFunctionOptions<S extends string = string> = {
    [State in S]: KeyboardFunctionState
}

export function defineKeyboardStatesByFunction <S extends string = string>(states: KeyboardDefineByFunctionOptions<S>) {
    function convertState (state: KeyBoardByFunctionStates<S>[S]) {
        return Object.keys(state).reduce((options, label) => {
            const value = state[label]
            const key = typeof value === 'string' ? <[string]>[value] : value
            const keyValue = key[0], modifiers = key[1]
            
            options[keyValue] ??= []
            options[keyValue].push({
                label,
                events: createKeyList(modifiers ?? {}, (_, value) => !!value)
            })

            return options
        }, {} as KeyboardOptions['states'][string])
    }

    return keyof(states).reduce((obj, state) => ({
        ...obj,
        [state]: convertState(states[state])
    }), {} as Record<S, KeyboardOptions<S>['states'][S]>)
}
