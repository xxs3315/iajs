import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'
import utwm from 'unplugin-tailwindcss-mangle/vite'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'
import generatePackageJson from 'rollup-plugin-generate-package-json'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({ rollupTypes: true, aliasesExclude: ['@xxs3315/iajs'] }),
    utwm({
      classGenerator: {
        classPrefix: 'iajs-plugin-mobile-ui-',
      },
    }),
    cssInjectedByJsPlugin(),
    generatePackageJson({
      baseContents: (pkg) => {
        pkg.scripts = {}
        pkg.devDependencies = {}
        pkg.dependencies = {}
        pkg.comment = ''
        pkg.main = './umd/iajs-plugin-mobile-ui.js'
        pkg.module = './iajs-plugin-mobile-ui.js'
        pkg.types = './iajs-plugin-mobile-ui.d.ts'
        pkg.exports = {
          '.': {
            import: './iajs-plugin-mobile-ui.js',
            require: './umd/iajs-plugin-mobile-ui.js',
          },
        }
        pkg.files = ['iajs-plugin-mobile-ui.d.ts', 'iajs-plugin-mobile-ui.js', 'umd/iajs-plugin-mobile-ui.js']
        return pkg
      },
    }),
    // obfuscatorPlugin({
    //   options: {
    //     compact: true,
    //     debugProtection: true,
    //     controlFlowFlattening: true,
    //     // Your javascript-obfuscator options here
    //     // See what's allowed: https://github.com/javascript-obfuscator/javascript-obfuscator
    //   },
    // }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'iajs-plugin-mobile-ui',
      // the proper extensions will be added
      // fileName: 'iajs-plugin-mobile-ui',
      fileName: (format, entryName) => {
        return format === 'umd'
          ? `umd/iajs-plugin-mobile-ui.js`
          : format === 'es'
            ? `iajs-plugin-mobile-ui.js`
            : `iajs-plugin-mobile-ui.${format}.js`
      },
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['@xxs3315/iajs'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
      },
    },
  },
})
