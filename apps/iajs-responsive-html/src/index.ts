import { ImageAnnotationWorkspace } from '@xxs3315/iajs'
import mobileGesturePlugin from '@xxs3315/iajs-plugin-mobile-gesture'
import mobileUIPlugin from '@xxs3315/iajs-plugin-mobile-ui'
import cropPlugin from '@xxs3315/iajs-plugin-crop'
import { invokeMethodName as invokeCrop } from '@xxs3315/iajs-plugin-crop'
import {
  ColorRgb8,
  decodeJpg,
  decodePng,
  Draw,
  encodeJpg,
  encodePng,
  MemoryImage,
  Rectangle,
  Transform,
} from './lib/images-tool'
import { Md5 } from './lib/md5-tool'
import { state } from './data/state'

export * from '../src/index'

export class Dev {
  imageAnnotationWorkspace: ImageAnnotationWorkspace | undefined = undefined

  private imageTileWidth = 1000
  private imageTileHeight = 1000

  private async urlToBlob(url: string): Promise<Blob> {
    const response = await fetch(url) // 获取文件内容
    const blob = await response.blob() // 转成 blob
    return blob
  }

  private blobToBase64(blob: Blob): Promise<string> {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result as any)
      }
    })
  }

  private base64ToBlob(base64: string) {
    const type = base64.split(',')![0]!.match(/:(.*?);/)![1] //提取base64头的type如 'image/png'
    const bytes = window.atob(base64.split(',')[1]) //去掉url的头，并转换为byte (atob:编码 btoa:解码)

    const ia = new Uint8Array(bytes.length)
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i)
    }
    const blob = new Blob([ia], { type: type })
    return blob
  }

  private blobToBuffer(blob: Blob): Promise<any> {
    const reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result as any)
      }
    })
  }

  private attachEvents() {
    this.imageAnnotationWorkspace?.addEventListener('annotation-create-end', (e) => {
      // console.log('annotation-create-end', e)
    })

    this.imageAnnotationWorkspace?.addEventListener('canvas-zoom-change-end', (e) => {
      // console.log('canvas-zoom-change-end', e)
    })

    this.imageAnnotationWorkspace?.addEventListener('canvas-content-change-end', (e) => {
      // console.log('canvas-content-change-end', e)
    })

    this.imageAnnotationWorkspace?.addEventListener('selection-change-end', (e) => {
      // console.log('selection-change-end', e)
    })

    this.imageAnnotationWorkspace?.addEventListener('canvas-to-json-start', (e) => {
      // console.log('canvas-to-json-start', e)
    })

    this.imageAnnotationWorkspace?.addEventListener('canvas-to-json-end', (e) => {
      // console.log('canvas-to-json-end', e)
      // console.log(JSON.stringify(e.detail.imageAnnotation.exportJsonResult))
    })

    this.imageAnnotationWorkspace?.addEventListener('json-to-canvas-start', (e) => {
      // console.log('json-to-canvas-start', e)
    })

    this.imageAnnotationWorkspace?.addEventListener('json-to-canvas-end', (e) => {
      // console.log('json-to-canvas-end', e)
    })

    this.imageAnnotationWorkspace?.addEventListener('canvas-to-image-start', (e) => {
      // console.log('canvas-to-image-start', e)
    })

    this.imageAnnotationWorkspace?.addEventListener('canvas-to-image-end', async (e) => {
      // console.log('canvas-to-image-end', e)
      const tiles = (e as any).detail.imageAnnotation.exportImageResult
      if (tiles.length > 1) {
        // tiles
        const fw = tiles[0].fw
        const fh = tiles[0].fh

        const targetImage = new MemoryImage({
          width: fw,
          height: fh,
          backgroundColor: new ColorRgb8(255, 255, 255),
        })

        let resultBase64 = ''
        let targetImageClone = targetImage.clone()
        for (const tile of tiles) {
          const b = this.base64ToBlob(tile.imageBase64)
          const buffer = await this.blobToBuffer(b)
          let image = decodeJpg({
            data: buffer,
          })
          if (image) {
            image = image.convert({
              numChannels: 4,
            })
            for (const p of image) {
              if (p.r === 0 && p.g === 0 && p.b === 0) {
                p.a = 0
              }
            }
            targetImageClone = targetImageClone.clone()
            Draw.compositeImage({
              dst: targetImageClone,
              src: image,
              dstX: tile.x,
              dstY: tile.y,
            })

            const output = encodeJpg({
              image: targetImageClone,
            })
            const blob = new Blob([output])
            resultBase64 = await this.blobToBase64(blob)
          }
        }
        console.log(resultBase64)
      } else if (tiles.length === 1) {
        // just one tile, just single image
        console.log(tiles[0].imageBase64)
      }
    })
  }

  public setup(db: any, type: 'single' | 'tile') {
    if (type === 'single') {
      // just a single image
      const imageTarget = document.createElement('img')
      imageTarget.src = './images/zhu.png'
      // this.imageAnnotationWorkspace = new ImageAnnotationWorkspace()
      this.imageAnnotationWorkspace = document.getElementById('imageMarkerDevWorkspace') as ImageAnnotationWorkspace
      // document.getElementById('imageMarkerDevWorkspace')?.appendChild(this.imageAnnotationWorkspace)
      this.imageAnnotationWorkspace.imageTarget = imageTarget

      this.attachEvents()
      this.imageAnnotationWorkspace.registerPlugin(mobileGesturePlugin)
      this.imageAnnotationWorkspace.registerPlugin(mobileUIPlugin)
      this.imageAnnotationWorkspace.registerPlugin(cropPlugin)
    } else {
      // image tiles
      this.urlToBlob('./images/zhu.png').then((blob) => {
        this.blobToBase64(blob).then((base64: string) => {
          const storageKey = Md5.hashStr(base64)
          db.data
            .where('id')
            .equals(storageKey)
            .toArray()
            .then((results: any) => {
              if (results.length > 0) {
                const tiles = results[0].value
                const width = results[0].w
                const height = results[0].h

                this.imageAnnotationWorkspace = document.getElementById(
                  'imageMarkerDevWorkspace',
                ) as ImageAnnotationWorkspace

                this.imageAnnotationWorkspace.targetWidth = width
                this.imageAnnotationWorkspace.targetHeight = height
                this.imageAnnotationWorkspace.imageTargetBase64Tiles = tiles

                this.attachEvents()
                this.imageAnnotationWorkspace.registerPlugin(mobileGesturePlugin)
                this.imageAnnotationWorkspace.registerPlugin(mobileUIPlugin)
                this.imageAnnotationWorkspace.registerPlugin(cropPlugin)
              } else {
                this.blobToBuffer(blob).then((buffer: any) => {
                  const imageTarget = document.createElement('img')
                  imageTarget.addEventListener('load', async (_ev: Event) => {
                    // get bg image tiles
                    const scrollFullArrangements: any = []
                    const yDelta = this.imageTileHeight
                    const xDelta = this.imageTileWidth
                    let yPos = imageTarget.height - this.imageTileHeight
                    let xPos = 0
                    while (yPos > -yDelta) {
                      xPos = 0
                      while (xPos < imageTarget.width) {
                        scrollFullArrangements.push({
                          x: xPos,
                          y: yPos < 0 ? 0 : yPos,
                          width: xPos + xDelta > imageTarget.width ? imageTarget.width - xPos : xDelta,
                          height: yPos < 0 ? yDelta + yPos : yDelta,
                        })
                        xPos += xDelta
                      }
                      yPos -= yDelta
                    }
                    scrollFullArrangements.reverse()

                    let image = decodePng({
                      data: buffer,
                    })
                    console.assert(image !== undefined)
                    if (image === undefined) return
                    // Ensuring the presence of an alpha channel
                    image = image.convert({
                      numChannels: 4,
                    })

                    const tileBlobs: any = []
                    const storageItems: any = []

                    scrollFullArrangements.forEach((aTile: any) => {
                      const o = encodePng({
                        image: Transform.copyCrop({
                          rect: new Rectangle(aTile.x, aTile.y, aTile.x + aTile.width, aTile.y + aTile.height),
                          image: image!,
                        }),
                      })
                      const b = new Blob([o])
                      tileBlobs.push({
                        x: aTile.x,
                        y: aTile.y,
                        w: aTile.width,
                        h: aTile.height,
                        v: b,
                      })
                    })

                    for (let i = 0; i < tileBlobs.length; i++) {
                      const tileBase64 = await this.blobToBase64(tileBlobs[i].v)
                      tileBlobs[i].v = tileBase64
                      storageItems.push(tileBlobs[i])
                    }
                    db.data
                      .put({ id: storageKey, value: storageItems, w: imageTarget.width, h: imageTarget.height })
                      .then(() => {
                        db.data
                          .where('id')
                          .equals(storageKey)
                          .toArray()
                          .then((results: any) => {
                            if (results.length > 0) {
                              const tiles = results[0].value
                              const width = results[0].w
                              const height = results[0].h

                              this.imageAnnotationWorkspace = document.getElementById(
                                'imageMarkerDevWorkspace',
                              ) as ImageAnnotationWorkspace

                              this.imageAnnotationWorkspace.targetWidth = width
                              this.imageAnnotationWorkspace.targetHeight = height
                              this.imageAnnotationWorkspace.imageTargetBase64Tiles = tiles

                              this.attachEvents()
                              this.imageAnnotationWorkspace.registerPlugin(mobileGesturePlugin)
                              this.imageAnnotationWorkspace.registerPlugin(mobileUIPlugin)
                              this.imageAnnotationWorkspace.registerPlugin(cropPlugin)
                            }
                          })
                      })
                      .catch((e: any) => {
                        console.error(`Oops : ${e}`)
                      })
                  })

                  imageTarget.src = base64
                })
              }
            })
        })
      })
    }
  }

  public setCurrentMode(mode: any, detail?: string) {
    this.imageAnnotationWorkspace?.setCurrentMode(mode, detail)
  }

  public deleteMarkers() {
    this.imageAnnotationWorkspace?.deleteAnnotations()
  }

  public undo() {
    this.imageAnnotationWorkspace?.undo()
  }

  public redo() {
    this.imageAnnotationWorkspace?.redo()
  }

  public reset() {
    this.imageAnnotationWorkspace?.reset()
  }

  public zoomWidth() {
    this.imageAnnotationWorkspace?.zoomWidth()
  }

  public zoomHeight() {
    this.imageAnnotationWorkspace?.zoomHeight()
  }

  public zoomFull() {
    this.imageAnnotationWorkspace?.zoomFull()
  }

  public zoomIn() {
    this.imageAnnotationWorkspace?.zoomIn()
  }

  public zoomOut() {
    this.imageAnnotationWorkspace?.zoomOut()
  }

  public zoomToScale(scale: number) {
    this.imageAnnotationWorkspace?.zoomToScale(scale)
  }

  public alignHorizontalLeft() {
    this.imageAnnotationWorkspace?.alignHorizontalLeft()
  }

  public alignHorizontalRight() {
    this.imageAnnotationWorkspace?.alignHorizontalRight()
  }

  public alignHorizontalCenter() {
    this.imageAnnotationWorkspace?.alignHorizontalCenter()
  }

  public alignVerticalTop() {
    this.imageAnnotationWorkspace?.alignVerticalTop()
  }

  public alignVerticalBottom() {
    this.imageAnnotationWorkspace?.alignVerticalBottom()
  }

  public alignVerticalMiddle() {
    this.imageAnnotationWorkspace?.alignVerticalMiddle()
  }

  public group() {
    this.imageAnnotationWorkspace?.group()
  }

  public ungroup() {
    this.imageAnnotationWorkspace?.ungroup()
  }

  public bringForward() {
    this.imageAnnotationWorkspace?.bringForward()
  }

  public sendBackwards() {
    this.imageAnnotationWorkspace?.sendBackwards()
  }

  public bringFront() {
    this.imageAnnotationWorkspace?.bringFront()
  }

  public sendBack() {
    this.imageAnnotationWorkspace?.sendBack()
  }

  public saveState() {
    this.imageAnnotationWorkspace?.saveState()
  }

  public restoreState() {
    this.imageAnnotationWorkspace?.restoreState(state)
  }

  public getImageSingle() {
    this.imageAnnotationWorkspace?.getImage('single', 'jpeg', 1)
  }

  public getImageTiles() {
    // or export image tiles
    this.imageAnnotationWorkspace?.getImage('tile', 'jpeg', 1, false, 1200, 1200)
  }

  public setActiveObjectById() {
    this.imageAnnotationWorkspace?.setActiveObjectById('uzDMYUZlDfQX')
  }

  public setActiveSelectionAttrs() {
    this.imageAnnotationWorkspace?.setActiveSelectionAttrs({
      width: 100,
      angle: 1008,
    })
  }

  public setObjectAttr() {
    this.imageAnnotationWorkspace?.setObjectAttr('u35L7wsJ2ERV', 'stroke', 'blue')
  }

  public setObjectLeft(value: number) {
    this.imageAnnotationWorkspace?.setObjectLeft(value)
  }

  public setObjectAngle(value: number) {
    this.imageAnnotationWorkspace?.setObjectAngle(value)
  }

  public setObjectAttrs() {
    this.imageAnnotationWorkspace?.setObjectAttrs('u35L7wsJ2ERV', {
      stroke: 'green',
      strokeWidth: 8,
      selectable: false,
      evented: false,
      hasControls: false,
    })
  }

  public crop() {
    this.imageAnnotationWorkspace?.invokePluginMethod(invokeCrop)
  }

  public setObjectFlipX() {
    this.imageAnnotationWorkspace?.setObjectFlipX()
  }
  public setObjectFlipY() {
    this.imageAnnotationWorkspace?.setObjectFlipY()
  }
}
