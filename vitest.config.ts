import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: 'dotenv/config', // help vitest to get env using process.env.VARIABLE_NAME
  },
})
