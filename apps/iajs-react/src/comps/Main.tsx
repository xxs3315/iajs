import Left from './left/Left'
import { useEffect, useRef } from 'react'
import { ImageAnnotationWorkspace } from '@xxs3315/iajs'
import { base64ToBlob } from '../utils/image'
import { copyBlobToClipboard } from '../utils/clipboard'
import { saveAs } from 'file-saver'
import { $iajsStore } from '../store/Iajs'
import TopLeft from './top/TopLeft'
import TopRight from './top/TopRight'
import Right from './right/Right'

const Main = (props: any) => {
  const containerRef = useRef($iajsStore.get().containerRef)
  //
  useEffect(() => {
    if (props.image && props.image.base64.length > 0) {
      if (containerRef.current) {
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
        containerRef.current.appendChild($iajsStore.get().iajsAnnotationWorkspaceRef!)
      }
    }
  }, [props.image.base64])

  return (
    <>
      <div className="h-full w-full flex flex-col overflow-hidden">
        <header className="border-b border-b-gray-300 p-2 flex justify-between items-center h-14">
          <div className="text-2xl pl-4">xxs3315 iajs react demo</div>
        </header>
        <div className="flex-1 flex flex-row overflow-hidden">
          <nav className="flex flex-col order-first w-16 sm:w-16 p-0 overflow-y-auto overflow-x-hidden">
            <Left />
          </nav>
          <main className="flex flex-1 flex-col border-l border-r border-gray-300 text-xs p-0 overflow-hidden">
            <div className="flex-none flex justify-between h-8 border-b border-gray-300 p-0 overflow-hidden">
              <TopLeft />
              <TopRight />
            </div>
            <div ref={containerRef} className="grow"></div>
          </main>
          <aside className="flex flex-col w-60 sm:w-64 p-1 overflow-auto">
            <Right />
          </aside>
        </div>
        <footer className="border-t border-gray-300 p-2 flex justify-end">
          <span>xxs3315 by ❤️</span>
        </footer>
      </div>
    </>
  )
}

export default Main
