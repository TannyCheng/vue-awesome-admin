import { defineBuildConfig } from 'unbuild'

defineBuildConfig({
  clean: true,
  entries: ['src/index.ts'],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
