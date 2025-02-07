import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import copy from 'rollup-plugin-copy'
import pkg from './package.json' assert { type: 'json' }
import generatePackageJson from 'rollup-plugin-generate-package-json'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import obfuscator from 'rollup-plugin-obfuscator'

const outputDir = './dist/'

const banner = `/* **********************************
iajs version ${pkg.version}
https://iajs.com

copyright xxs3315
see README.md and LICENSE for details
********************************** */`

export default [
  // types
  {
    input: ['./src/index.ts'],
    output: {
      dir: './dts/',
    },
    plugins: [
      del({ targets: ['dts/*', 'dist/*'] }),
      nodeResolve(),
      typescript({
        declaration: true,
        outDir: './dts/',
        include: ['./src/**/*.ts'],
        exclude: ['./test/**/*', './dts/**/*', './dist/**/*'],
      }),
    ],
  },
  {
    input: './dts/index.d.ts',
    output: [{ file: outputDir + pkg.types, format: 'es' }],
    plugins: [dts()],
  },

  // complete UMD package
  {
    input: ['src/index.ts'],
    output: [
      {
        file: outputDir + pkg.main,
        name: 'iajs-plugin-mobile-gesture',
        format: 'umd',
        sourcemap: false,
        banner,
      },
    ],
    plugins: [typescript(), terser()],
  },

  // complete ESM package
  {
    input: ['src/index.ts'],
    output: [
      {
        file: outputDir + pkg.module,
        format: 'es',
        sourcemap: false,
        banner,
      },
    ],
    plugins: [
      // nodeResolve(),
      typescript(),
      terser(),
      generatePackageJson({
        baseContents: (pkg) => {
          pkg.scripts = {}
          pkg.devDependencies = {}
          pkg.dependencies = {}
          pkg.main = 'umd/iajs-plugin-mobile-gesture.js'
          pkg.module = 'iajs-plugin-mobile-gesture.js'
          pkg.types = 'iajs-plugin-mobile-gesture.d.ts'
          pkg.files = ['iajs-plugin-mobile-gesture.d.ts', 'iajs-plugin-mobile-gesture.js', 'umd']
          return pkg
        },
      }),
      // obfuscator({
      //   options: {
      //     compact: true,
      //     debugProtection: true,
      //     controlFlowFlattening: true,
      //     // Your javascript-obfuscator options here
      //     // See what's allowed: https://github.com/javascript-obfuscator/javascript-obfuscator
      //   },
      // }),
      copy({
        targets: [
          {
            src: 'README.md',
            dest: 'dist',
          },
          {
            src: 'LICENSE',
            dest: 'dist',
          },
        ],
      }),
      // del({ targets: ['dts/*'] }),
    ],
  },
]
