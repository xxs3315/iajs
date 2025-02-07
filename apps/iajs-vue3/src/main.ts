import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { IStaticMethods } from 'preline/preline'
import Dropzone from 'dropzone'
import _ from 'lodash'

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods
    Dropzone: typeof Dropzone
    _: typeof _
  }
}

createApp(App).mount('#root')
