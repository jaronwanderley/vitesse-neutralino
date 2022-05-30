import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'
import generatedRoutes from '~pages'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.globEager('./modules/*.ts')).forEach(i => i.install?.(ctx))
  },
)

declare global {
  interface Window {
    NL_PORT?: Number
    NL_TOKEN?: String
    NL_ARGS?: any
    Neutralino?: any
  }
}

if (import.meta.env.DEV) {
  const { accessToken, port } = await import(`${'/'}.tmp/auth_info.json`) || {}
  window.NL_PORT = port
  window.NL_TOKEN = accessToken
  window.NL_ARGS = []
}
if (typeof window !== 'undefined')
  window.Neutralino.init()

