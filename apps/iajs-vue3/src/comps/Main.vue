<template>
  <div class="h-full w-full flex flex-col overflow-hidden">
    <header class="border-b border-b-gray-300 p-2 flex justify-between items-center h-14">
      <div class="text-2xl pl-4">xxs3315 iajs vue demo</div>
    </header>
    <div class="flex-1 flex flex-row overflow-hidden">
      <nav class="flex flex-col order-first w-16 sm:w-16 p-0 overflow-y-auto overflow-x-hidden">
        <Left />
      </nav>
      <main class="flex flex-1 flex-col border-l border-r border-gray-300 text-xs p-0 overflow-hidden">
        <div class="flex-none flex justify-between h-8 border-b border-gray-300 p-0 overflow-hidden">
          <TopLeft />
          <TopRight />
        </div>
        <div ref="containerRef" class="grow"></div>
      </main>
      <aside class="flex flex-col w-60 sm:w-64 p-1 overflow-auto">
        <Right />
      </aside>
    </div>
    <footer class="border-t border-gray-300 p-2 flex justify-end">
      <span>xxs3315 by ❤️</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { $iajsStore } from '../store/Iajs'
import { ImageAnnotationWorkspace } from '@xxs3315/iajs'
import { saveAs } from 'file-saver'
import { defineProps, ref, watchEffect } from 'vue'
import { base64ToBlob } from '../utils/image'
import { copyBlobToClipboard } from '../utils/clipboard'
import Left from './left/Left.vue'
import TopLeft from './top/TopLeft.vue'
import TopRight from './top/TopRight.vue'
import Right from './right/Right.vue'

const containerRef = ref($iajsStore.get().containerRef)

const props = defineProps({
  lang: { type: String, required: false },
  image: { type: Object, required: true },
})

watchEffect(() => {
  if (props.image && props.image.base64.length > 0) {
    if (containerRef.value) {
      const targetImg = document.createElement('img')
      targetImg.src = props.image.base64
      if (!$iajsStore.get().iajsAnnotationWorkspaceRef) {
        $iajsStore.get().iajsAnnotationWorkspaceRef = new ImageAnnotationWorkspace()
      }
      if (!$iajsStore.get().iajsAnnotationWorkspaceRef) return

      $iajsStore.get().iajsAnnotationWorkspaceRef!.imageTarget = targetImg
      $iajsStore.get().iajsAnnotationWorkspaceRef!.addEventListener('annotation-create-end', (e: any) => {
        $iajsStore.setKey(
          'continuousCreate',
          true /*(e as any).detail.mode === 'manipulate' && (e as any).detail.manipulateDetail === 'free-draw'*/,
        )
        $iajsStore.setKey('drawAnnotationCount', $iajsStore.get().drawAnnotationCount + 1)
      })
      $iajsStore.get().iajsAnnotationWorkspaceRef!.addEventListener('canvas-zoom-change-end', (e: any) => {
        $iajsStore.setKey('zoom', (e as any).detail.zoom)
      })
      $iajsStore.get().iajsAnnotationWorkspaceRef!.addEventListener('canvas-content-change-end', (e: any) => {
        $iajsStore.setKey('currentObjects', (e as any).detail.currentObjects)
      })
      $iajsStore.get().iajsAnnotationWorkspaceRef!.addEventListener('canvas-to-image-start', (_e) => {
        console.log('start exporting image...')
      })
      $iajsStore.get().iajsAnnotationWorkspaceRef!.addEventListener('canvas-to-image-end', (e: any) => {
        $iajsStore.setKey('imageResult', (e as any).detail.image)
        const b = base64ToBlob($iajsStore.get().imageResult[0].imageBase64)
        if ($iajsStore.get().imageSaveCopy === 'save') {
          saveAs(b, 'imjs-image-' + new Date().getTime() + '.jpeg')
        } else if ($iajsStore.get().imageSaveCopy === 'copy') {
          copyBlobToClipboard(b)
            .then(() => {
              // ElMessage({
              //   message: t('tool.group.info.copy-to-clipboard-success'),
              //   type: 'success',
              // })
            })
            .catch((_e: any) => {
              // ElMessage.error(e: any)
            })
        }
      })
      $iajsStore.get().iajsAnnotationWorkspaceRef!.addEventListener('selection-change-end', (e: any) => {
        $iajsStore.setKey('currentActiveObject', (e as any).detail.selection)
        $iajsStore.setKey('currentActiveObjectIds', (e as any).detail.ids)
        $iajsStore.setKey('currentActiveObjectSTypes', (e as any).detail.sTypes)
        $iajsStore.setKey(
          'currentActiveObjectGeoAttrs',
          (e as any).detail.selection === undefined
            ? undefined
            : {
                x: (e as any).detail.x,
                y: (e as any).detail.y,
                width: (e as any).detail.width,
                height: (e as any).detail.height,
                angle: (e as any).detail.angle,
              },
        )
        $iajsStore.setKey(
          'currentActiveObjectShapeAttrs',
          (e as any).detail.selection === undefined
            ? undefined
            : {
                stokeColor: (e as any).detail.stokeColor,
                strokeWidth: (e as any).detail.strokeWidth,
                fillColor: (e as any).detail.fillColor,
                fillOpacity: (e as any).detail.fillOpacity,
                textColor: (e as any).detail.textColor,
                textFontFamily: (e as any).detail.textFontFamily,
                textFontSize: (e as any).detail.textFontSize,
              },
        )
      })
      containerRef.value.appendChild($iajsStore.get().iajsAnnotationWorkspaceRef!)
    }
  }
})
</script>

<style scoped></style>
