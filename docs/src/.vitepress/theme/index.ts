import DefaultTheme from 'vitepress/theme'
import { createPinia } from 'pinia'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        const pinia = createPinia()
        app.use(pinia)
    }
}