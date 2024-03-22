# vue-keyboard-shortcuts

A shortcut visualizer like [Shortcut mapper](https://waldobronchart.github.io/ShortcutMapper/) built with Vue

## API

In your Vue application or component:

```vue
<script setup lang="ts">
import {
    KeyBoard,
    defineKeyboard,
} from 'vue-keyboard-shortcuts'

const keyboard = defineKeyboard<string>({
    defaultState: 'Program_View',
    states: {
        Program_View: {
            // Will indicate that this key can be pressed, but has no special shortcut
            a: [],
            Space: [
                // By default, 'Jump' is the shortcut for the spacebar
                { label: 'Jump' }
            ]
        }
    },
})
</script>

<template>
    <KeyBoard v-bind="keyboard" />
</template>
```

### Slots

- `filters`: exposes states and functions to use for keyboards with multiple states. Read more below.

### Advanced topics

#### Multiple states

To support multiple states combine them into the definition first and define for each state the shortcuts in the options like above.

```ts
const keyboard = defineKeyboard<string>({
    defaultState: 'Program_View',
    states: {
        Program_View: {},
        Program_Explore: {},
        Installer_View: {},
        Installer_Build: {},
        Installer_Compiler: {},
    },
})
```

Then in your keyboard use the `filters` slot that will expose options for select menus:

```vue
<template>
    <KeyBoard v-bind="keyboard">
        <template #filters="{ filters, onChange }">
            <select v-for="filter in filters" :value="filter.ref" @change="e => onChange(e, filter)">
                <option v-for="opt in filter.options" :value="opt">
                    {{ opt }}
                </option>
            </select>
        </template>
    </KeyBoard>
</template>
```

</details>

#### Customizing colors

There are two methods to set the keyboard colors:

1. Set CSS variables

See the names of all [CSS variables](/src/styles/variables.css) for reference.

```css
:root {
    --vks-keyboard-bg: #fff;
    --vks-keyboard-border: #fff;

    --vks-key-bg: #fff;
    --vks-key-text: #fff;

    --vks-key-border-outer: #fff;
    --vks-key-border-inner: #fff;
    --vks-key-border-press: #fff;
    --vks-key-border-bottom: #fff;

    --vtk-key-bg-shift: #fff;
    --vtk-key-bg-control: #fff;
    --vtk-key-bg-alt: #fff;
    --vtk-key-bg-control-shift: #fff;
    --vtk-key-bg-control-alt: #fff;
    --vtk-key-bg-shift-alt: #fff;
    --vtk-key-bg-control-shift-alt: #fff;
}
```

2. Set colors in keyboard options

```ts
const keyModifiers = ['Shift', 'Control', 'Alt']
    .reduce((obj, name) => ({ ...obj, [name]: name }), {})

const keyboard = defineKeyboard<string>({
    defaultState: 'Program_View',
    states: {
        Program_View: {},
        Program_Explore: {},
        Installer_View: {},
        Installer_Build: {},
        Installer_Compiler: {},
    },
    colors: {
        'var(--vtk-key-bg-active)': [],
        'var(--vtk-key-bg-shift)': [keyModifiers.Shift],
        'var(--vtk-key-bg-control)': [keyModifiers.Control],
        'var(--vtk-key-bg-alt)': [keyModifiers.Alt],
        'var(--vtk-key-bg-control-shift)': [keyModifiers.Control, keyModifiers.Shift],
        'var(--vtk-key-bg-control-alt)': [keyModifiers.Control, keyModifiers.Alt],
        'var(--vtk-key-bg-shift-alt)': [keyModifiers.Shift, keyModifiers.Alt],
        'var(--vtk-key-bg-control-shift-alt)': [keyModifiers.Control, keyModifiers.Shift, keyModifiers.Alt],
    }
})
```

#### Reactivity

By default each key is visually pressed if:

- you press that key on your keyboard
- you press that key with the cursor on the screen

In the keyboard options changing the `reactive` option will change this behaviour for all keys. If you define all keys yourself or use a custom keyboard, you can also set `reactive` on each key.

Note that the setting on the key has priority over the board setting. Only if the key is not set, it will look what the board setting is. By default both interaction types are enabled.

Both `reactive` properties can be set to:

- `false`: disables both types of interactions.
- `true`: (default) enables both types of interactions.
- `['click']`: only allows interaction by pressing the key on the keyboard of the device.
- `['press']`: only allows interaction by pressing the key on the keyboard in the application.

#### Define keyboard

In all examples the following configuration is used. For each state we define all labels by their keyboard key.

```ts
const keyboard = defineKeyboard<string>({
    defaultState: 'Program_View',
    states: {
        Program_View: {
            // Will indicate that this key can be pressed, but has no special shortcut
            a: [],
            Space: [
                // By default, 'Jump' is the shortcut for the spacebar
                { label: 'Jump' }
            ]
        }
    },
})
```

You can also define states by labels. Then the following example becomes:

```ts
const keyboard = defineKeyboard<string>({
    defaultState: 'Program_View',
    states: defineKeyboardStatesByFunction({
        Program_View: {
            'Jump': 'space',
        }
    }),
})
```

Note that each key much have a key! The `a` key in the first example will not be possible, because it does not have a function (label).
