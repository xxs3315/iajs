import typescript from '@rollup/plugin-typescript'
import htmlTemplate from 'rollup-plugin-generate-html-template'
import dev from 'rollup-plugin-dev'
import livereload from 'rollup-plugin-livereload'
import copy from 'rollup-plugin-copy'
import resolve from '@rollup/plugin-node-resolve'
import css from 'rollup-plugin-import-css'

export default {
  preserveSymlinks: false,
  input: ['src/index.ts'],
  output: {
    dir: 'dev-build',
    format: 'umd',
    sourcemap: true,
    name: 'iajs',
  },
  plugins: [
    resolve(),
    typescript({
      include: ['./src/**/*.ts'],
    }),
    css(),
    htmlTemplate({
      template: 'src/template.html',
      target: 'index.html',
    }),
    copy({
      targets: [
        {
          src: 'src/images/**/*',
          dest: 'dev-build/images',
        },
      ],
      copyOnce: true,
    }),
    copy({
      targets: [
        {
          src: 'src/lib/dexie/*',
          dest: 'dev-build/lib/dexie',
        },
      ],
      copyOnce: true,
    }),
    dev({ host: '0.0.0.0', dirs: ['dev-build'], port: 5179 }),
    livereload('dev-build'),
  ],
}
