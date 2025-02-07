import { FabricImage, FabricObject, Point, Rect, Textbox, util } from 'fabric'
import NP from 'number-precision'
import { ResizeObserver } from '@juggle/resize-observer'
import { createCore } from './core/utils/createCore'
import { useWorkspace, workspaceInstance } from './core/workspace'
import { getActiveCore } from './core'
import { Workspace } from './core/workspace/Workspace'
import { MainCanvas } from './core/canvas/MainCanvas'
import { WorkspaceService } from './core/service/workspace/WorkspaceService'
import { ICore, WorkspacePlugin } from './core/type'

// to actually have the properties added to the serialized object
FabricObject.customProperties = [
  'name',
  'id',
  'bgt',
  'noEventObjectAdded',
  'evented',
  'selectable',
  '_controlsVisibility',
  'sType',
]

FabricObject.prototype.objectCaching = false
FabricObject.prototype.ownCaching = false

Object.assign(FabricObject.ownDefaults, {
  strokeUniform: true,
  strokeWidth: 0,
  fill: '#CCCCCC',
  cornerSize: 10,
  transparentCorners: false,
  cornerColor: '#FFF',
  borderColor: '#2A82E4',
  cornerStrokeColor: '#2A82E4',
  // controls: createObjectDefaultControls(),
  includeDefaultValues: false,
  snapAngle: 1,
  paintFirst: 'stroke',
} as FabricObject)

export interface ImageAnnotationEventData {
  imageAnnotation: ImageAnnotation
}

export interface ImageAnnotationEventDataZoom extends ImageAnnotationEventData {
  zoom: number
}

export interface ImageAnnotationEventDataSelection extends ImageAnnotationEventData {
  selection: any
  ids: string[] | undefined
  sTypes: string[] | undefined
  x: number | undefined
  y: number | undefined
  width: number | undefined
  height: number | undefined
  angle: number | undefined
  stokeColor: string | undefined
  strokeWidth: number | undefined
  fillColor: string | undefined
  fillOpacity: number | undefined
  textColor: string | undefined
  textFontFamily: string | undefined
  textFontSize: number | undefined
}

export interface ImageAnnotationEventDataContent extends ImageAnnotationEventData {
  currentObjects: any
}

export interface ImageAnnotationEventDataImage extends ImageAnnotationEventData {
  image: any
}

export interface ImageAnnotationEventDataJsonExport extends ImageAnnotationEventData {
  json: any
}

export interface ImageAnnotationEventDataAnnotation extends ImageAnnotationEventData {
  annotation: any
  mode: string
  manipulateDetail: any
}

export interface ImageAnnotationEventDataJsonImport extends ImageAnnotationEventData {}

export interface ImageAnnotationEventMap {
  'annotation-create-end': CustomEvent<ImageAnnotationEventDataAnnotation>
  'canvas-zoom-change-end': CustomEvent<ImageAnnotationEventDataZoom>
  'canvas-content-change-end': CustomEvent<ImageAnnotationEventDataContent>
  'canvas-to-image-start': CustomEvent<ImageAnnotationEventDataImage>
  'canvas-to-image-end': CustomEvent<ImageAnnotationEventDataImage>
  'canvas-to-json-start': CustomEvent<ImageAnnotationEventDataJsonExport>
  'canvas-to-json-end': CustomEvent<ImageAnnotationEventDataJsonExport>
  'json-to-canvas-start': CustomEvent<ImageAnnotationEventDataJsonImport>
  'json-to-canvas-end': CustomEvent<ImageAnnotationEventDataJsonImport>
  'selection-change-end': CustomEvent<ImageAnnotationEventDataSelection>
}

export type ImageAnnotationMode = 'select' | 'manipulate'
export type ImageAnnotationManipulateDetail =
  | 'rectangle'
  | 'ellipse'
  | 'rectangle-outline'
  | 'ellipse-outline'
  | 'line'
  | 'single-arrow'
  | 'double-arrow'
  | 'rectangle-highlight'
  | 'ellipse-highlight'
  | 'text'
  | 'free-draw'

export type AlignMethod =
  | 'horizontalLeft'
  | 'horizontalRight'
  | 'horizontalCenter'
  | 'verticalTop'
  | 'verticalMiddle'
  | 'verticalBottom'

export class ImageAnnotation extends HTMLElement {
  private core: ICore | undefined = undefined
  private _mainContainer: HTMLDivElement | undefined = undefined
  private _canvasContainer: HTMLDivElement | undefined = undefined
  private initResized = false

  private bgImageRect: Rect | undefined = undefined
  private _imageTargetBase64Tiles: any[] | undefined = undefined
  public get imageTargetBase64Tiles(): any[] | undefined {
    return this._imageTargetBase64Tiles
  }
  public set imageTargetBase64Tiles(value: any[] | undefined) {
    this._imageTargetBase64Tiles = value
    if (value !== undefined) {
      this.initMainImage()
    }
  }

  private _imageTarget: HTMLImageElement | undefined = undefined
  public get imageTarget(): HTMLImageElement | undefined {
    return this._imageTarget
  }
  public set imageTarget(value: HTMLImageElement | undefined) {
    this._imageTarget = value
    if (value !== undefined) {
      this.preHandleMainImage()
    }
  }
  private _targetWidth = 1
  public get targetWidth() {
    return this._targetWidth
  }
  public set targetWidth(value) {
    this._targetWidth = value
    this._mainWorkspaceService?.setImageTargetWidth(value)
  }
  private _targetHeight = 1
  public get targetHeight() {
    return this._targetHeight
  }
  public set targetHeight(value) {
    this._targetHeight = value
    this._mainWorkspaceService?.setImageTargetHeight(value)
  }

  private _mainWorkspaceService: WorkspaceService | undefined = undefined
  private _mainFabricCanvas: MainCanvas | undefined = undefined

  public getCurrentObjects() {
    return this._mainWorkspaceService?.getCurrentObjects()
  }

  private ro = new ResizeObserver((_entries: any, _observer: any) => {
    if (this._mainFabricCanvas !== undefined && this._mainWorkspaceService !== undefined) {
      this._mainWorkspaceService.setContainerWidth(this.offsetWidth)
      this._mainWorkspaceService.setContainerHeight(this.offsetHeight)
      this._mainFabricCanvas.setDimensions({
        width: this.offsetWidth,
        height: this.offsetHeight,
      })
      if (!this.initResized) {
        this.zoomFull()
        this.initResized = true
      }
    }
  })

  constructor() {
    super()

    this.connectedCallback = this.connectedCallback.bind(this)
    this.disconnectedCallback = this.disconnectedCallback.bind(this)

    this.setCurrentMode = this.setCurrentMode.bind(this)

    this.initMainLayout = this.initMainLayout.bind(this)
    this.initMainCanvas = this.initMainCanvas.bind(this)
    this.preHandleMainImage = this.preHandleMainImage.bind(this)
    this.initMainImage = this.initMainImage.bind(this)
    this.setMainCanvasSize = this.setMainCanvasSize.bind(this)

    this.handleBgImage = this.handleBgImage.bind(this)
    this.attachEvents = this.attachEvents.bind(this)

    this.zoomFull = this.zoomFull.bind(this)
    this.zoomWidth = this.zoomWidth.bind(this)
    this.zoomHeight = this.zoomHeight.bind(this)
    this.zoomIn = this.zoomIn.bind(this)
    this.zoomOut = this.zoomOut.bind(this)
    this.zoomToScale = this.zoomToScale.bind(this)

    this.onKeydown = this.onKeydown.bind(this)
    this.onKeyup = this.onKeyup.bind(this)

    this.alignHorizontalLeft = this.alignHorizontalLeft.bind(this)
    this.alignHorizontalRight = this.alignHorizontalRight.bind(this)
    this.alignHorizontalCenter = this.alignHorizontalCenter.bind(this)
    this.alignVerticalTop = this.alignVerticalTop.bind(this)
    this.alignVerticalBottom = this.alignVerticalBottom.bind(this)
    this.alignVerticalMiddle = this.alignVerticalMiddle.bind(this)

    this.group = this.group.bind(this)
    this.ungroup = this.ungroup.bind(this)

    this.bringForward = this.bringForward.bind(this)
    this.bringFront = this.bringFront.bind(this)
    this.sendBackwards = this.sendBackwards.bind(this)
    this.sendBack = this.sendBack.bind(this)

    this.setObjectLeft = this.setObjectLeft.bind(this)
    this.setObjectTop = this.setObjectTop.bind(this)
    this.setObjectWidth = this.setObjectWidth.bind(this)
    this.setObjectHeight = this.setObjectHeight.bind(this)
    this.setObjectAngle = this.setObjectAngle.bind(this)
    this.setObjectFlipX = this.setObjectFlipX.bind(this)
    this.setObjectFlipY = this.setObjectFlipY.bind(this)

    this.attachShadow({ mode: 'open' })
  }

  public setObjectLeft(value: number) {
    this.setActiveSelectionAttrs({
      left: value,
    })
  }

  public setObjectTop(value: number) {
    this.setActiveSelectionAttrs({
      top: value,
    })
  }

  public setObjectWidth(value: number) {
    this.setActiveSelectionAttrs({
      width: value,
    })
  }

  public setObjectHeight(value: number) {
    this.setActiveSelectionAttrs({
      height: value,
    })
  }

  public setObjectAngle(value: number) {
    this.setActiveSelectionAttrs({
      angle: value,
    })
  }

  public setObjectFlipX() {
    this._mainFabricCanvas?.setTargetFlipX()
  }

  public setObjectFlipY() {
    this._mainFabricCanvas?.setTargetFlipY()
  }

  public setActiveObjectById(id: string) {
    this._mainFabricCanvas?.setActiveObjectById(id)
  }

  public setActiveSelectionAttrs(attrs: Record<string, any>) {
    this._mainFabricCanvas?.setActiveSelectionAttrs(attrs)
  }

  public setObjectAttr(id: string, key: string, value: any) {
    const attr: any = {}
    attr[key] = value
    this.setObjectAttrs(id, attr)
  }

  public setObjectAttrs(id: string, attrs: Record<string, any>) {
    this._mainFabricCanvas?.setTargetAttrs(id, attrs)
  }

  public exportJsonResult: any = undefined
  public saveState() {
    this.dispatchEvent(
      new CustomEvent<ImageAnnotationEventDataJsonExport>('canvas-to-json-start', {
        detail: {
          imageAnnotation: this,
          json: undefined,
        },
      }),
    )
    this.exportJsonResult = this._mainFabricCanvas?.exportPages(FabricObject.customProperties)
    this.dispatchEvent(
      new CustomEvent<ImageAnnotationEventDataJsonExport>('canvas-to-json-end', {
        detail: {
          imageAnnotation: this,
          json: this.exportJsonResult,
        },
      }),
    )
  }

  public restoreState(json: any) {
    if (this._mainFabricCanvas && this._mainWorkspaceService) {
      this.dispatchEvent(
        new CustomEvent<ImageAnnotationEventDataJsonImport>('json-to-canvas-start', {
          detail: {
            imageAnnotation: this,
          },
        }),
      )
      this._mainFabricCanvas
        .importPages(json)
        .then(() => {
          useWorkspace()?.eventbusService.emit('reloadWorkspaceUndoRedo')
        })
        .then(() => {
          const targets = this._mainFabricCanvas!._objects.filter((obj: FabricObject) => {
            return (obj as any).bgt === 'bg-rect'
          })
          if (targets.length === 1) {
            this._mainWorkspaceService?.setImageTargetWidth(targets[0].width)
            this._mainWorkspaceService?.setImageTargetHeight(targets[0].height)
          }
        })
        .then(() => this._mainFabricCanvas?.calculateCurrentObjects())
        .then(() => {
          this._mainFabricCanvas?.fire('selection:updated')
        })
        // todo calculate new zoom scale
        .finally(() => {
          this.dispatchEvent(
            new CustomEvent<ImageAnnotationEventDataJsonImport>('json-to-canvas-end', {
              detail: {
                imageAnnotation: this,
              },
            }),
          )
        })
    }
  }

  private exportImageTileWidth = 1000
  private exportImageTileHeight = 1000
  private exportImageResult: any = undefined

  public getImage(
    type?: 'single' | 'tile',
    format?: 'jpeg' | 'png',
    quality?: number,
    retina?: boolean,
    tileWidth?: number,
    tileHeight?: number,
  ) {
    if (this._mainFabricCanvas && this._mainWorkspaceService && this.bgImageRect) {
      this.dispatchEvent(
        new CustomEvent<ImageAnnotationEventDataImage>('canvas-to-image-start', {
          detail: {
            imageAnnotation: this,
            image: undefined,
          },
        }),
      )
      // get current bg transform
      const left = this.bgImageRect.aCoords.tl.transform(this._mainFabricCanvas.viewportTransform).x
      const top = this.bgImageRect.aCoords.tl.transform(this._mainFabricCanvas.viewportTransform).y
      const width =
        this.bgImageRect.aCoords.tr.transform(this._mainFabricCanvas.viewportTransform).x -
        this.bgImageRect.aCoords.tl.transform(this._mainFabricCanvas.viewportTransform).x
      const height =
        this.bgImageRect.aCoords.bl.transform(this._mainFabricCanvas.viewportTransform).y -
        this.bgImageRect.aCoords.tl.transform(this._mainFabricCanvas.viewportTransform).y

      const resultImages = []

      if (!type || type === 'single') {
        const tempImage = this._mainFabricCanvas.toDataURL({
          format: format ? format : 'png',
          quality: quality ? quality : 0.8,
          multiplier: 1 / this._mainWorkspaceService!.getCurrentZoomScale(),
          enableRetinaScaling: retina === undefined ? false : retina,
          left: left,
          top: top,
          width: width,
          height: height,
        })
        resultImages.push({
          rows: 1,
          cols: 1,
          row: 1,
          col: 1,
          x: 0,
          y: 0,
          width: this._mainWorkspaceService.getImageTargetWidth(),
          height: this._mainWorkspaceService.getImageTargetHeight(),
          imageBase64: tempImage,
          fw: this._mainWorkspaceService.getImageTargetWidth(),
          fh: this._mainWorkspaceService.getImageTargetHeight(),
        })
      } else {
        // get bg image tiles
        const scrollFullArrangements: any = []
        const yDelta = tileHeight === undefined ? this.exportImageTileHeight : tileHeight
        const xDelta = tileWidth === undefined ? this.exportImageTileWidth : tileWidth
        let yPos = this._mainWorkspaceService.getImageTargetHeight() - yDelta
        let xPos = 0
        const tileColCount = Math.ceil(NP.divide(this._mainWorkspaceService.getImageTargetWidth(), xDelta))
        const tileRowCount = Math.ceil(NP.divide(this._mainWorkspaceService.getImageTargetHeight(), yDelta))
        let row = tileRowCount
        let col = 0
        while (yPos > -yDelta) {
          xPos = 0
          col = 0
          while (xPos < this._mainWorkspaceService.getImageTargetWidth()) {
            col += 1
            scrollFullArrangements.push({
              rows: tileRowCount,
              cols: tileColCount,
              row,
              col,
              x: xPos,
              y: yPos < 0 ? 0 : yPos,
              width:
                xPos + xDelta > this._mainWorkspaceService.getImageTargetWidth()
                  ? this._mainWorkspaceService.getImageTargetWidth() - xPos
                  : xDelta,
              height: yPos < 0 ? yDelta + yPos : yDelta,
            })
            xPos += xDelta
          }
          yPos -= yDelta
          row -= 1
        }
        scrollFullArrangements.reverse()
        if (scrollFullArrangements.length > 0) {
          for (let i = 0; i < scrollFullArrangements.length; i++) {
            const tempImage = this._mainFabricCanvas.toDataURL({
              format: format ? format : 'png',
              quality: quality ? quality : 0.8,
              multiplier: 1 / this._mainWorkspaceService!.getCurrentZoomScale(),
              enableRetinaScaling: retina === undefined ? false : retina,
              left: left + scrollFullArrangements[i].x * this._mainWorkspaceService!.getCurrentZoomScale(),
              top: top + scrollFullArrangements[i].y * this._mainWorkspaceService!.getCurrentZoomScale(),
              width: scrollFullArrangements[i].width * this._mainWorkspaceService!.getCurrentZoomScale(),
              height: scrollFullArrangements[i].height * this._mainWorkspaceService!.getCurrentZoomScale(),
            })
            resultImages.push({
              rows: scrollFullArrangements[i].rows,
              cols: scrollFullArrangements[i].cols,
              row: scrollFullArrangements[i].row,
              col: scrollFullArrangements[i].col,
              x: scrollFullArrangements[i].x,
              y: scrollFullArrangements[i].y,
              width: scrollFullArrangements[i].width,
              height: scrollFullArrangements[i].height,
              imageBase64: tempImage,
              fw: this._mainWorkspaceService.getImageTargetWidth(),
              fh: this._mainWorkspaceService.getImageTargetHeight(),
            })
          }
        }
      }

      this.exportImageResult = resultImages

      this.dispatchEvent(
        new CustomEvent<ImageAnnotationEventDataImage>('canvas-to-image-end', {
          detail: {
            imageAnnotation: this,
            image: this.exportImageResult,
          },
        }),
      )
    }
  }

  public bringForward() {
    this._mainFabricCanvas?.bringForward()
  }

  public bringFront() {
    this._mainFabricCanvas?.bringFront()
  }

  public sendBackwards() {
    this._mainFabricCanvas?.sendBackwards()
  }

  public sendBack() {
    this._mainFabricCanvas?.sendBack()
  }

  public group() {
    this._mainFabricCanvas?.group()
  }

  public ungroup() {
    this._mainFabricCanvas?.ungroup()
  }

  public alignHorizontalLeft() {
    this._mainFabricCanvas?.align('horizontalLeft')
  }

  public alignHorizontalRight() {
    this._mainFabricCanvas?.align('horizontalRight')
  }

  public alignHorizontalCenter() {
    this._mainFabricCanvas?.align('horizontalCenter')
  }

  public alignVerticalTop() {
    this._mainFabricCanvas?.align('verticalTop')
  }

  public alignVerticalBottom() {
    this._mainFabricCanvas?.align('verticalBottom')
  }

  public alignVerticalMiddle() {
    this._mainFabricCanvas?.align('verticalMiddle')
  }

  private connectedCallback() {
    this.core = createCore()
    const { service } = getActiveCore()
    workspaceInstance.workspace = service.createInstance(Workspace)
    workspaceInstance.workspace?.startup()

    this.initMainLayout()
    this.initMainCanvas()
    this.initMainImage()
    this.attachEvents()

    useWorkspace()?.workspaceService.setWorkspaceEl(this)
    useWorkspace()?.workspaceService.setMainContainerEl(this._mainContainer)
  }

  public registerPlugin(plugin: WorkspacePlugin) {
    if (this.core) {
      this.core.use(plugin)
    }
  }

  public undo() {
    useWorkspace()?.undoRedoService.undo()
  }

  public redo() {
    useWorkspace()?.undoRedoService.redo()
  }

  public zoomIn(point?: Point) {
    this._mainFabricCanvas?.zoomIn(point)
  }

  public zoomToScale(scale: number, center?: { x: number; y: number }) {
    this._mainFabricCanvas?.zoomToScale(scale, center)
  }

  public zoomOut(point?: Point) {
    this._mainFabricCanvas?.zoomOut(point)
  }

  public zoomWidth() {
    this._mainFabricCanvas?.zoomWidth()
  }

  public zoomHeight() {
    this._mainFabricCanvas?.zoomHeight()
  }

  public zoomFull() {
    this._mainFabricCanvas?.zoomFull()
  }

  private onKeydown(e: any) {
    if (e.repeat || this._mainFabricCanvas === undefined) {
      return
    }
    const key = e.which || e.keyCode // key detection
    if (key === 17 || key === 91 || key === 92) {
      // handle Ctrl key
      this._mainFabricCanvas.defaultCursor = 'move'
      this._mainFabricCanvas.selection = false
      // handle Ctrl key / Meta key
      this._mainWorkspaceService?.setCtrlKeydown(true)

      // 因为free-draw是连续绘制模式，这里特别处理free-draw
      if (
        this._mainWorkspaceService?.getMode() === 'manipulate' &&
        this._mainWorkspaceService?.getManipulateDetail() === 'free-draw'
      ) {
        this._mainWorkspaceService?.setPrevMode('manipulate')
        this._mainWorkspaceService?.setPrevManipulateDetail('free-draw')
        this.setCurrentMode('select', undefined)
      }
    }
  }

  private onKeyup(e: any) {
    const key = e.which || e.keyCode // key detection
    if (this._mainFabricCanvas && (key === 17 || key === 91 || key === 92)) {
      // handle Ctrl key / Meta key
      this._mainFabricCanvas.defaultCursor = 'default'
      this._mainFabricCanvas.selection = true
      this._mainWorkspaceService?.setCtrlKeydown(false)

      // 因为free-draw是连续绘制模式，这里特别处理free-draw
      if (
        this._mainWorkspaceService?.getPrevMode() === 'manipulate' &&
        this._mainWorkspaceService?.getPrevManipulateDetail() === 'free-draw'
      ) {
        this._mainWorkspaceService?.setPrevMode(undefined)
        this._mainWorkspaceService?.setPrevManipulateDetail(undefined)
        this.setCurrentMode('manipulate', 'free-draw')
      }
    }
  }

  // 兼容老数据，老数据中背景缺少selectable evented
  private handleBgImage() {
    this._mainFabricCanvas?.getObjects().forEach((item: any) => {
      if (item.bgt && item.bgt.startsWith('bg')) {
        item.set('selectable', false)
        item.set('evented', false)
      }
    })
  }

  private attachEvents() {
    if (this._mainFabricCanvas !== undefined) {
      useWorkspace()?.eventbusService.on('canvasZoomChangeEnd', (detail) => {
        this.dispatchEvent(
          new CustomEvent<ImageAnnotationEventDataZoom>('canvas-zoom-change-end', {
            detail: {
              imageAnnotation: this,
              ...detail,
            },
          }),
        )
      })

      useWorkspace()?.eventbusService.on('selectionChangeEnd', (detail) => {
        this.dispatchEvent(
          new CustomEvent<ImageAnnotationEventDataSelection>('selection-change-end', {
            detail: {
              imageAnnotation: this,
              ...detail,
            },
          }),
        )
      })

      useWorkspace()?.eventbusService.on('contentChangeEnd', () => {
        this.dispatchEvent(
          new CustomEvent<ImageAnnotationEventDataContent>('canvas-content-change-end', {
            detail: {
              imageAnnotation: this,
              currentObjects: this.getCurrentObjects(),
            },
          }),
        )
      })

      useWorkspace()?.eventbusService.on('undoRedoStackChange', () => {
        this.dispatchEvent(
          new CustomEvent<ImageAnnotationEventDataContent>('canvas-content-change-end', {
            detail: {
              imageAnnotation: this,
              currentObjects: this.getCurrentObjects(),
            },
          }),
        )
      })

      useWorkspace()?.eventbusService.on('annotationCreateEnd', (detail) => {
        this.dispatchEvent(
          new CustomEvent<ImageAnnotationEventDataAnnotation>('annotation-create-end', {
            detail: {
              imageAnnotation: this,
              ...detail,
            },
          }),
        )
      })

      window.addEventListener('keydown', this.onKeydown)
      window.addEventListener('keyup', this.onKeyup)
      window.addEventListener(
        'mousewheel',
        function (event: any) {
          if (event.ctrlKey === true || event.metaKey) {
            event.preventDefault()
          }
        },
        { passive: false },
      )

      // firefox
      window.addEventListener(
        'DOMMouseScroll',
        function (event: any) {
          if (event.ctrlKey === true || event.metaKey) {
            event.preventDefault()
          }
        },
        { passive: false },
      )
      // + -
      window.onload = function () {
        document.addEventListener(
          'keydown',
          function (event: any) {
            if (
              (event.ctrlKey === true || event.metaKey === true) &&
              (event.which === 61 ||
                event.which === 107 ||
                event.which === 173 ||
                event.which === 109 ||
                event.which === 187 ||
                event.which === 189)
            ) {
              event.preventDefault()
            }
          },
          false,
        )
      }
    }
  }

  private initMainLayout() {
    this.style.display = 'flex'
    this.style.width = this.style.width !== '' ? this.style.width : '100%'
    this.style.height = this.style.height !== '' ? this.style.height : '100%'
    this.style.position = 'relative'
    this.style.overflow = 'hidden'

    this._mainContainer = document.createElement('div')
    this._mainContainer.style.display = 'flex'
    this._mainContainer.style.position = 'relative'
    this._mainContainer.style.flexGrow = '2'
    this._mainContainer.style.flexShrink = '1'
    this._mainContainer.style.overflow = 'hidden'

    this._canvasContainer = document.createElement('div')
    this._canvasContainer.style.touchAction = 'pinch-zoom'
    this._canvasContainer.style.display = 'grid'
    this._canvasContainer.style.gridTemplateColumns = '1fr'
    this._canvasContainer.style.flexGrow = '2'
    this._canvasContainer.style.flexShrink = '2'
    this._canvasContainer.style.justifyItems = 'center'
    this._canvasContainer.style.alignItems = 'center'

    this._mainContainer.appendChild(this._canvasContainer)

    this.shadowRoot?.appendChild(this._mainContainer)

    this._mainWorkspaceService?.setContainerWidth(this.offsetWidth)
    this._mainWorkspaceService?.setContainerHeight(this.offsetHeight)
    this._mainFabricCanvas?.setDimensions({
      width: this.offsetWidth,
      height: this.offsetHeight,
    })

    this.ro.observe(this)
  }

  private initMainCanvas() {
    this._mainFabricCanvas = useWorkspace()?.canvas
    this._mainWorkspaceService = useWorkspace()?.workspaceService
    if (!this._mainFabricCanvas || !this._mainWorkspaceService) return
    this._canvasContainer?.appendChild(this._mainFabricCanvas.wrapperEl)
  }

  private preHandleMainImage() {
    if (this._imageTarget) {
      const img = document.createElement('img')
      img.addEventListener('load', (_e) => {
        this._mainWorkspaceService?.setImageTargetWidth(img.width)
        this._mainWorkspaceService?.setImageTargetHeight(img.height)
        const tile = {
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
        }
        this._imageTargetBase64Tiles = [tile]

        this.initMainImage('single')
      })
      img.src = this._imageTarget.src
    }
  }

  private initMainImage(type?: 'single' | 'tile') {
    if (
      this._imageTargetBase64Tiles !== undefined &&
      this._canvasContainer !== undefined &&
      this._mainFabricCanvas !== undefined
    ) {
      this._mainWorkspaceService?.setImageTargetBase64TilesCount(this._imageTargetBase64Tiles.length)
      this.setMainCanvasSize(type)
    }
  }

  private setMainCanvasSize(type?: 'single' | 'tile') {
    if (
      this._mainFabricCanvas !== undefined &&
      this._mainWorkspaceService !== undefined &&
      this._imageTargetBase64Tiles !== undefined
    ) {
      this._mainFabricCanvas.setDimensions({
        width: this.offsetWidth,
        height: this.offsetHeight,
      })
      const scaleX = this.offsetWidth / this._mainWorkspaceService.getImageTargetWidth()
      const scaleY = this.offsetHeight / this._mainWorkspaceService.getImageTargetHeight()
      this._mainWorkspaceService?.setCurrentZoomScale(Math.min(scaleX, scaleY))
      this.bgImageRect = new Rect({
        left: 0,
        top: 0,
        width: this._mainWorkspaceService.getImageTargetWidth(),
        height: this._mainWorkspaceService.getImageTargetHeight(),
        selectable: false,
        evented: false,
        bgt: 'bg-rect',
        visible: false,
      })

      this._mainFabricCanvas!.add(this.bgImageRect)

      this._imageTargetBase64Tiles.forEach((tile: any) => {
        if (type === 'single') {
          const t = new FabricImage(this._imageTarget!, {
            left: tile.x,
            top: tile.y,
            width: tile.width,
            height: tile.height,
            selectable: false,
            evented: false,
            bgt: 'bg',
          })
          this._mainFabricCanvas!.add(t)
        } else {
          const img = document.createElement('img')
          img.addEventListener('load', (_e) => {
            const t = new FabricImage(img, {
              left: tile.x,
              top: tile.y,
              width: tile.width,
              height: tile.height,
              selectable: false,
              evented: false,
              bgt: 'bg',
            })
            this._mainFabricCanvas!.add(t)
          })
          img.src = tile.v
        }
      })

      setTimeout(() => {
        this.zoomFull()
      }, 0)
    }
  }

  private disconnectedCallback() {
    workspaceInstance.workspace?.dispose()
    workspaceInstance.workspace = undefined
  }

  /**
   * reset all workspace undo redo
   */
  public reset() {
    useWorkspace()?.undoRedoService.reset()
  }

  public deleteAnnotations() {
    this._mainFabricCanvas?.deleteAnnotations()
  }

  /**
   * set workspace mode
   */
  public setCurrentMode(mode: ImageAnnotationMode, detail?: string) {
    this._mainFabricCanvas?.setCurrentMode(mode, detail)
  }

  public invokePluginMethod(invokeMethodName: string) {
    try {
      ;(this as any)[invokeMethodName]?.()
    } catch (e) {
      console.error(e)
    }
  }

  addEventListener<T extends keyof ImageAnnotationEventMap>(
    // the event name, a key of AnnotationAreaEventMap
    type: T,
    // the listener, using a value of AnnotationAreaEventMap
    listener: (this: ImageAnnotation, ev: ImageAnnotationEventMap[T]) => void,
    // any options
    options?: boolean | AddEventListenerOptions,
  ): void
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    super.addEventListener(type, listener, options)
  }

  removeEventListener<T extends keyof ImageAnnotationEventMap>(
    // the event name, a key of AnnotationAreaEventMap
    type: T,
    // the listener, using a value of AnnotationAreaEventMap
    listener: (this: ImageAnnotation, ev: ImageAnnotationEventMap[T]) => void,
    // any options
    options?: boolean | EventListenerOptions,
  ): void
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions | undefined,
  ): void
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions | undefined,
  ): void {
    super.removeEventListener(type, listener, options)
  }
}
