import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'
import vue from '@vitejs/plugin-vue'

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: 'dist/cjs/index.js',
        format: "cjs",
        sourcemap: true,
      },
      {
        file: 'dist/esm/index.js',
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      vue({
        css: false,
        compileTemplate: true,
      }),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss()
    ],
    external: ['vue'],

  },
  {
    input: "dist/esm/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.*css$/],
  },
]
