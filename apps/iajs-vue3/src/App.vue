<template>
  <div style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center">
    <Main :image="img" v-if="img.base64.length > 0" />
    <Uploader @get-base64="getImageBase64" v-if="img.base64.length === 0" />
  </div>
</template>

<script setup lang="ts">
import { reactive, watchEffect } from 'vue'
import Uploader from './comps/Uploader.vue'
import Main from './comps/Main.vue'

const img = reactive({ base64: '', width: 0, height: 0 })

watchEffect(() => {
  const loadPreline = async () => {
    const preline = await import('preline/preline')
    const fileUpload = await import('@preline/file-upload')
    const HSFileUpload = fileUpload.default

    // Import Preline Components here
    const { HSDropdown } = preline

    const dropzoneImport = (await import('dropzone')).default
    const lodashImport = (await import('lodash')).default
    window.Dropzone = dropzoneImport
    window._ = lodashImport

    window.HSStaticMethods.autoInit()
    HSDropdown.autoInit()
    HSFileUpload.autoInit()
  }
  loadPreline()
})

const getImageBase64 = (base64: string) => {
  const image = new Image()
  image.src = base64
  image.onload = () => {
    img.base64 = base64
    img.width = image.width
    img.height = image.height
  }
}
</script>

<style scoped>
#root {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
