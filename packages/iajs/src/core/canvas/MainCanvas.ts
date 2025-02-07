import {
  ActiveSelection,
  Canvas,
  FabricObject,
  Group,
  PencilBrush,
  Point,
  TFiller,
  TMat2D,
  TValidToObjectMethod,
  util,
} from 'fabric'
import { EventbusService, IEventbusService } from '../service/eventbus/EventbusService'
import { IWorkspace, IWorkspaceService, WorkspaceService } from '../service/workspace/WorkspaceService'
import { createDecorator } from '../instantiation'
import { AlignMethod, ImageAnnotationMode } from '../../ImageAnnotation'
import { clampAngle, toFixed } from '../../utils/math'
import NP from 'number-precision'
import { randomText } from '../../utils/string'
import { isCollection } from '../../utils/fabric/fabric'
import { SvgGroup, SvgPath, SvgText } from '../../utils/svg'
import { omit, pick } from 'lodash-es'

export const IMainCanvas = createDecorator<MainCanvas>('mainCanvas')

export class MainCanvas extends Canvas {
  private canvasEvents
  private uniqueIds = new Map<string, number>() //Group
  // 限制一下当前activeSelection的可修改属性
  private exposedActiveSelectionAttrs = ['left', 'top', 'width', 'height', 'angle']
  // 计数器 背景加载完成之后，将object:added监听取消，同时更新一下history
  private bgTilesAddedCount = 0
  /***
   * 当前页面ID
   */
  public pageId: string

  constructor(
    @IWorkspaceService private readonly workspace: WorkspaceService,
    @IEventbusService private readonly eventbus: EventbusService,
  ) {
    const createMainCanvasElement = () => document.createElement('canvas')
    super(createMainCanvasElement())

    this.wrapperEl.style.gridColumnStart = '1'
    this.wrapperEl.style.gridRowStart = '1'
    this.wrapperEl.style.pointerEvents = 'auto'
    this.wrapperEl.style.position = 'absolute'
    this.wrapperEl.style.left = '0px'
    this.wrapperEl.style.top = '0px'
    this.preserveObjectStacking = true
    this.selectionBorderColor = 'rgba(60,126,255,0.8)'
    this.selectionColor = 'rgba(60,126,255,0.2)'

    this.pageId = this.workspace.getId()
    // 初始化工作区
    this.initWorkspace()

    this.canvasEvents = {
      'selection:created': this.selectionCreated.bind(this),
      'selection:cleared': this.selectionCleared.bind(this),
      'selection:updated': this.selectionUpdated.bind(this),
      'object:added': this.onCanvasObjectAdded.bind(this),
    }
    this.on(this.canvasEvents)
  }

  private initWorkspace() {
    this.workspace.all().forEach((workspace) => {})
  }

  private selectionCreated(e: any) {
    const x = this._activeObject
      ? this._activeObject?.parent
        ? toFixed(this.getTargetLeftTop(this._activeObject).x)
        : toFixed(this._activeObject.left)
      : undefined
    const y = this._activeObject
      ? this._activeObject?.parent
        ? toFixed(this.getTargetLeftTop(this._activeObject).y)
        : toFixed(this._activeObject.top)
      : undefined
    const width = this._activeObject ? toFixed(this.getTargetWidthHeight(this._activeObject).x) : undefined
    const height = this._activeObject ? toFixed(this.getTargetWidthHeight(this._activeObject).y) : undefined
    const angle = this._activeObject
      ? this._activeObject.angle
        ? toFixed(clampAngle(this._activeObject?.angle))
        : 0
      : undefined
    const selectObjects = this.getActiveObjects()
    let ids: string[] | undefined = undefined
    let sTypes: string[] | undefined = undefined
    if (selectObjects.length > 0) {
      ids = []
      sTypes = []
      selectObjects.forEach((obj) => {
        if ((obj as any).id) ids!.push((obj as any).id)
        if ((obj as any).sType) sTypes!.push((obj as any).sType)
      })

      const attrs =
        ids.length > 1 || ids.length === 0
          ? {
              stokeColor: undefined,
              strokeWidth: undefined,
              fillColor: undefined,
              fillOpacity: undefined,
              textColor: undefined,
              textFontFamily: undefined,
              textFontSize: undefined,
            }
          : this.getAttributesBySType(sTypes[0])
      this.eventbus.emit('selectionChangeEnd', {
        selection: this._activeObject,
        ids,
        sTypes,
        x,
        y,
        width,
        height,
        angle,
        ...attrs,
      })
    }
  }

  private getAttributesBySType(sType: string): any {
    const result = {
      stokeColor: undefined,
      strokeWidth: undefined,
      fillColor: undefined,
      fillOpacity: undefined,
      textColor: undefined,
      textFontFamily: undefined,
      textFontSize: undefined,
    }
    switch (sType) {
      case 'line':
      case 'single-arrow':
      case 'double-arrow':
        result.stokeColor = this._activeObject?.stroke as any
        result.strokeWidth = this._activeObject?.strokeWidth as any
        result.fillColor = this._activeObject?.fill as any
        break
      case 'rectangle':
      case 'rectangle-outline':
      case 'ellipse':
      case 'ellipse-outline':
        result.stokeColor = this._activeObject?.stroke as any
        result.strokeWidth = this._activeObject?.strokeWidth as any
        result.fillColor = this._activeObject?.fill as any
        break
      case 'rectangle-highlight':
      case 'ellipse-highlight':
        result.stokeColor = this._activeObject?.stroke as any
        result.strokeWidth = this._activeObject?.strokeWidth as any
        result.fillColor = this._activeObject?.fill as any
        result.fillOpacity = this._activeObject?.opacity as any
        break
      case 'free-draw':
        result.stokeColor = this._activeObject?.stroke as any
        result.strokeWidth = this._activeObject?.strokeWidth as any
        break
      case 'text':
        result.textColor = this._activeObject?.fill as any
        result.textFontFamily = (this._activeObject as any)?.fontFamily as any
        result.textFontSize = (this._activeObject as any)?.fontSize as any
        break
    }
    return result
  }

  private selectionCleared(e: any) {
    this.eventbus.emit('selectionChangeEnd', {
      selection: this._activeObject,
      ids: undefined,
      sTypes: undefined,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      angle: undefined,
      stokeColor: undefined,
      strokeWidth: undefined,
      fillColor: undefined,
      fillOpacity: undefined,
      textColor: undefined,
      textFontFamily: undefined,
      textFontSize: undefined,
    })
  }

  private selectionUpdated(e: any) {
    const x = this._activeObject
      ? this._activeObject.parent
        ? toFixed(this.getTargetLeftTop(this._activeObject).x)
        : toFixed(this._activeObject.left)
      : undefined
    const y = this._activeObject
      ? this._activeObject.parent
        ? toFixed(this.getTargetLeftTop(this._activeObject).y)
        : toFixed(this._activeObject.top)
      : undefined
    const width = this._activeObject ? toFixed(this.getTargetWidthHeight(this._activeObject).x) : undefined
    const height = this._activeObject ? toFixed(this.getTargetWidthHeight(this._activeObject).y) : undefined
    const angle = this._activeObject
      ? this._activeObject.angle
        ? toFixed(clampAngle(this._activeObject?.angle))
        : 0
      : undefined
    const selectObjects = this.getActiveObjects()
    let ids: string[] | undefined = undefined
    let sTypes: string[] | undefined = undefined
    if (selectObjects.length > 0) {
      ids = []
      sTypes = []
      selectObjects.forEach((obj) => {
        if ((obj as any).id) ids!.push((obj as any).id)
        if ((obj as any).sType) sTypes!.push((obj as any).sType)
      })

      const attrs =
        ids.length > 1 || ids.length === 0
          ? {
              stokeColor: undefined,
              strokeWidth: undefined,
              fillColor: undefined,
              fillOpacity: undefined,
              textColor: undefined,
              textFontFamily: undefined,
              textFontSize: undefined,
            }
          : this.getAttributesBySType(sTypes[0])
      this.eventbus.emit('selectionChangeEnd', {
        selection: this._activeObject,
        ids,
        sTypes,
        x,
        y,
        width,
        height,
        angle,
        ...attrs,
      })
    }
  }

  public getTargetWidthHeight(target: FabricObject, noFixed = false) {
    const objScale = target.getObjectScaling()
    const point = target._getTransformedDimensions({
      scaleX: objScale.x,
      scaleY: objScale.y,
    })
    if (!noFixed) {
      point.setX(toFixed(point.x))
      point.setY(toFixed(point.y))
    }
    return point
  }
  public setTargetHeight(target: FabricObject, value: number) {
    value = Math.max(value, target.strokeWidth, 0.5)
    const height = NP.divide(NP.minus(this.getTargetWidthHeight(target, true).y, target.strokeWidth), target.scaleY)
    const newScale = NP.divide(NP.minus(value, target.strokeWidth), height)
    if (newScale === Infinity || Number.isNaN(newScale)) return
    target.set('scaleY', newScale || 0.00001)
    target.fire('scaling')
    target.setCoords()
  }
  public setTargetWidth(target: FabricObject, value: number) {
    value = Math.max(value, target.strokeWidth, 0.5)
    const width = NP.divide(NP.minus(this.getTargetWidthHeight(target, true).x, target.strokeWidth), target.scaleX)
    const newScale = NP.divide(NP.minus(value, target.strokeWidth), width)
    if (newScale === Infinity || Number.isNaN(newScale)) return
    target.set('scaleX', newScale || 0.00001)
    target.fire('scaling')
    target.setCoords()
  }
  public setTargetAngle(target: FabricObject, value: number) {
    target.rotate(toFixed(clampAngle(value)))
    target.setCoords()
  }
  public getTargetLeftTop(target: FabricObject) {
    const relativePosition = target.getRelativeXY()
    if (!target.group) {
      return relativePosition
    }
    const transformMatrix = target.group.calcTransformMatrix()
    return relativePosition.transform(transformMatrix)
  }
  public setTargetLeftTop(target: FabricObject, point: Point) {
    if (target.group) {
      point = point.transform(util.invertTransform(target.group.calcTransformMatrix()))
    }
    target.setRelativeXY(point)
    target.setCoords()
  }
  public setTargetLeft(target: FabricObject, value: number) {
    this.setTargetLeftTop(target, this.getTargetLeftTop(target).setX(value))
  }
  public setTargetTop(target: FabricObject, value: number) {
    this.setTargetLeftTop(target, this.getTargetLeftTop(target).setY(value))
  }

  public zoomIn(point?: Point) {
    this.workspace.setCurrentZoomScale(this.workspace.getCurrentZoomScale() + 0.05)
    if (!point) {
      this.zoomToPoint(this.getCenterPoint(), this.workspace.getCurrentZoomScale())
    } else {
      this.zoomToPoint(point, this.workspace.getCurrentZoomScale())
    }
    this.eventbus.emit('canvasZoomChangeEnd', {
      zoom: this.workspace.getCurrentZoomScale(),
    })
  }

  public zoomOut(point?: Point) {
    this.workspace.setCurrentZoomScale(this.workspace.getCurrentZoomScale() - 0.05)
    if (!point) {
      this.zoomToPoint(this.getCenterPoint(), this.workspace.getCurrentZoomScale())
    } else {
      this.zoomToPoint(point, this.workspace.getCurrentZoomScale())
    }
    this.eventbus.emit('canvasZoomChangeEnd', {
      zoom: this.workspace.getCurrentZoomScale(),
    })
  }

  public zoomToScale(scale: number, center?: { x: number; y: number }) {
    this.workspace.setCurrentZoomScale(scale)
    this.zoomToPoint(
      center ? new Point(center.x, center.y) : this.getCenterPoint(),
      this.workspace.getCurrentZoomScale(),
    )
    this.eventbus.emit('canvasZoomChangeEnd', {
      zoom: this.workspace.getCurrentZoomScale(),
    })
  }

  public zoomWidth() {
    const scaleX = this.workspace.getContainerWidth() / this.workspace.getImageTargetWidth()
    this.workspace.setCurrentZoomScale(scaleX)
    this.setZoom(1)
    this.absolutePan(new Point({ x: 0, y: 0 }))
    this.relativePan(
      new Point(
        (this.width / this.workspace.getCurrentZoomScale() - this.workspace.getImageTargetWidth()) / 2,
        (this.height / this.workspace.getCurrentZoomScale() - this.workspace.getImageTargetHeight()) / 2,
      ),
    )
    this.setZoom(this.workspace.getCurrentZoomScale())
    this.eventbus.emit('canvasZoomChangeEnd', {
      zoom: this.workspace.getCurrentZoomScale(),
    })
  }

  public zoomHeight() {
    const scaleY = this.workspace.getContainerHeight() / this.workspace.getImageTargetHeight()
    this.workspace.setCurrentZoomScale(scaleY)
    this.setZoom(1)
    this.absolutePan(new Point({ x: 0, y: 0 }))
    this.relativePan(
      new Point(
        (this.width / this.workspace.getCurrentZoomScale() - this.workspace.getImageTargetWidth()) / 2,
        (this.height / this.workspace.getCurrentZoomScale() - this.workspace.getImageTargetHeight()) / 2,
      ),
    )
    this.setZoom(this.workspace.getCurrentZoomScale())
    this.eventbus.emit('canvasZoomChangeEnd', {
      zoom: this.workspace.getCurrentZoomScale(),
    })
  }

  public zoomFull() {
    const scaleX = this.workspace.getContainerWidth() / this.workspace.getImageTargetWidth()
    const scaleY = this.workspace.getContainerHeight() / this.workspace.getImageTargetHeight()
    this.workspace.setCurrentZoomScale(Math.min(scaleX, scaleY))
    this.setZoom(1)
    this.absolutePan(new Point({ x: 0, y: 0 }))
    this.relativePan(
      new Point(
        (this.width / this.workspace.getCurrentZoomScale() - this.workspace.getImageTargetWidth()) / 2,
        (this.height / this.workspace.getCurrentZoomScale() - this.workspace.getImageTargetHeight()) / 2,
      ),
    )
    this.setZoom(this.workspace.getCurrentZoomScale())
    this.eventbus.emit('canvasZoomChangeEnd', {
      zoom: this.workspace.getCurrentZoomScale(),
    })
  }

  /**
   * exportPages
   * @param propertiesToInclude
   * @param methodName
   */
  public exportPages(propertiesToInclude: string[] = [], methodName: TValidToObjectMethod = 'toObject') {
    const clipPath = this.clipPath
    const clipPathData =
      clipPath && !clipPath.excludeFromExport
        ? this._toObject(clipPath as FabricObject, methodName, propertiesToInclude)
        : null

    let page: {
      id: string
      viewportTransform: TMat2D
      objects: FabricObject[]
      background: TFiller | string
    } = {} as any
    this.workspace.all().forEach((workspace) => {
      const viewportTransform = this.viewportTransform
      const background = this.backgroundColor
      page = {
        id: workspace.id,
        viewportTransform,
        objects: this.getObjects()
          .filter((object) => !object.excludeFromExport)
          .map((instance) => this._toObject(instance, methodName, propertiesToInclude)) as FabricObject[],
        background,
      }
    })

    return {
      ...pick(this, propertiesToInclude as (keyof this)[]),
      workspace: this.workspace.all().length === 1 ? { name: 'Workspace' } : omit(this.workspace.all()[0], 'id'),
      page,
      ...(clipPathData ? { clipPath: clipPathData } : null),
    }
  }

  /**
   * importPages
   * @param json
   */
  public async importPages(json: any) {
    if (!json) {
      return Promise.reject(new Error('`json` is undefined'))
    }

    const serialized = typeof json === 'string' ? JSON.parse(json) : json

    const {
      workspace,
      page,
    }: {
      workspace: IWorkspace
      page: {
        id: string
        objects: FabricObject[]
      }
    } = serialized

    if (!workspace || !page) {
      return Promise.reject(new Error('`json` is not valid'))
    }

    this.workspace.clear()
    // this.pages.clear()

    const { name, id } = workspace
    this.workspace.init(name, id)

    this.workspace.setId(page.id)

    await this.loadFromJSON(omit(page, 'id'))

    // set import zoom scale
    this.workspace.setCurrentZoomScale(this.viewportTransform[0])
    this.eventbus.emit('canvasZoomChangeEnd', {
      zoom: this.workspace.getCurrentZoomScale(),
    })

    this.renderAll()
  }

  /**
   * set workspace mode
   */
  public setCurrentMode(mode: ImageAnnotationMode, detail?: string) {
    this.workspace.setMode(mode)
    // this.perPixelTargetFind = true
    if (this.workspace.getMode() === 'select') {
      this.selection = true
      this.isDrawingMode = false
      this.freeDrawingBrush = undefined
      this.workspace.setManipulateDetail(undefined)
    } else if (this.workspace.getMode() === 'manipulate') {
      this.selection = true
      this.freeDrawingBrush = undefined
      this.isDrawingMode = false
      if (detail === 'rectangle') {
        this.workspace.setManipulateDetail('rectangle')
      }
      if (detail === 'rectangle-outline') {
        this.workspace.setManipulateDetail('rectangle-outline')
      }
      if (detail === 'rectangle-highlight') {
        this.workspace.setManipulateDetail('rectangle-highlight')
      }
      if (detail === 'ellipse') {
        this.workspace.setManipulateDetail('ellipse')
      }
      if (detail === 'ellipse-outline') {
        this.workspace.setManipulateDetail('ellipse-outline')
      }
      if (detail === 'ellipse-highlight') {
        this.workspace.setManipulateDetail('ellipse-highlight')
      }
      if (detail === 'line') {
        this.workspace.setManipulateDetail('line')
      }
      if (detail === 'double-arrow') {
        this.workspace.setManipulateDetail('double-arrow')
      }
      if (detail === 'single-arrow') {
        this.workspace.setManipulateDetail('single-arrow')
      }
      if (detail === 'text') {
        this.workspace.setManipulateDetail('text')
      }
      if (detail === 'free-draw') {
        this.workspace.setManipulateDetail('free-draw')
      }
    }
  }

  public align(method: AlignMethod) {
    let activeObject = this.getActiveObject()
    const selectObjects = this.getActiveObjects()
    if (!activeObject || !(activeObject instanceof ActiveSelection)) return
    const currentTransformMatrix = activeObject.calcTransformMatrix()
    if (!currentTransformMatrix) return
    if (
      currentTransformMatrix[0] !== 1 ||
      currentTransformMatrix[1] !== 0 ||
      currentTransformMatrix[2] !== 0 ||
      currentTransformMatrix[3] !== 1
    ) {
      // 当前选择变化了，即已经transformed，这里重新选一下，要不然align要出问题了
      const activeSelection = new ActiveSelection(selectObjects)
      this._hoveredTarget = activeSelection
      this._hoveredTargets = [...selectObjects]
      this.setActiveObject(activeSelection)
      this._fireSelectionEvents([activeSelection])
      this.renderAll()
      activeObject = this.getActiveObject()
    }
    if (!activeObject || !(activeObject instanceof ActiveSelection)) return
    const { left, top, width, height } = activeObject
    const needUpdateGroups = new Set<Group>()
    selectObjects.forEach((obj) => {
      const bounding = obj.getBoundingRect()
      switch (method) {
        case 'horizontalLeft':
          obj.setPositionByOrigin(
            new Point(-width / 2 + bounding.width / 2, -height / 2 + bounding.height / 2 - (top - bounding.top)),
            'center',
            'center',
          )
          obj.setCoords()
          break
        case 'horizontalRight':
          obj.setPositionByOrigin(
            new Point(width / 2 - bounding.width / 2, -height / 2 + bounding.height / 2 - (top - bounding.top)),
            'center',
            'center',
          )
          obj.setCoords()
          break
        case 'horizontalCenter':
          obj.setPositionByOrigin(
            new Point(0, -height / 2 + bounding.height / 2 - (top - bounding.top)),
            'center',
            'center',
          )
          obj.setCoords()
          break
        case 'verticalTop':
          obj.setPositionByOrigin(
            new Point(-width / 2 + bounding.width / 2 - (left - bounding.left), -height / 2 + bounding.height / 2),
            'center',
            'center',
          )
          obj.setCoords()
          break
        case 'verticalBottom':
          obj.setPositionByOrigin(
            new Point(-width / 2 + bounding.width / 2 - (left - bounding.left), height / 2 - bounding.height / 2),
            'center',
            'center',
          )
          obj.setCoords()
          break
        case 'verticalMiddle':
          obj.setPositionByOrigin(
            new Point(-width / 2 + bounding.width / 2 - (left - bounding.left), 0),
            'center',
            'center',
          )
          obj.setCoords()
          break
      }
      const group = obj.parent
      group && needUpdateGroups.add(group)
    })
    needUpdateGroups.forEach((group) => {
      group.triggerLayout()
      group.dirty = true
    })
    this.renderAll()
    this.eventbus.emit('recordToUndoRedo')
    this.calculateCurrentObjects()
  }

  public setTargetFlipX() {
    const activeObjects = this.getActiveObjects()
    if (activeObjects.length === 0) return
    activeObjects.forEach((obj) => {
      obj.flipX = !obj.flipX
    })
    this.requestRenderAll()
    this.eventbus.emit('recordToUndoRedo')
    this.calculateCurrentObjects()
    this.fire('selection:updated')
  }

  public setTargetFlipY() {
    const activeObjects = this.getActiveObjects()
    if (activeObjects.length === 0) return
    activeObjects.forEach((obj) => {
      obj.flipY = !obj.flipY
    })
    this.requestRenderAll()
    this.eventbus.emit('recordToUndoRedo')
    this.calculateCurrentObjects()
    this.fire('selection:updated')
  }

  private deleteLayer(objects: FabricObject[]): FabricObject[] {
    const removed = objects.flatMap((obj) => (obj.parent ? obj.parent! : this!).remove(obj)) as FabricObject[]
    return removed
  }

  public group() {
    const activeObjects = this.getActiveObjects()
    if (activeObjects.length > 0) {
      const insertGroup = activeObjects[0].parent ? activeObjects[0].parent! : this
      const index = insertGroup._objects.indexOf(activeObjects[0])
      this.discardActiveObject()
      // 创建组
      const id = randomText()
      const count = this.uniqueIds.get('Group') || 1
      const name = `Group ${count}`
      const group = new Group(
        this.deleteLayer(
          activeObjects.filter((obj, index, array) => {
            // 如果元素的组也在objects里，则排除该元素
            const parent = obj.parent
            return !parent || !array.includes(parent)
          }) /*.reverse()*/,
        ),
        {
          id: id,
          name: name,
          activeOn: 'up',
        } as any,
      )
      this.uniqueIds.set('Group', count + 1)
      insertGroup.insertAt(index, group)
      // 设置激活对象
      this.setActiveObject(group)
      this.renderAll()
      this.eventbus.emit('recordToUndoRedo')
      this.calculateCurrentObjects()
    }
  }

  public ungroup() {
    const object = this.getActiveObject()
    const os = this.getActiveObjects()
    if (!object || !(object instanceof Group && os.length === 1)) return
    const parentGroup = object.parent ? object.parent! : this
    const index = parentGroup._objects.indexOf(object)
    const objects = object.removeAll() as FabricObject[]
    parentGroup.insertAt(index, ...objects)
    parentGroup.remove(object)
    this.setActiveObjects(objects.reverse())
    this.eventbus.emit('recordToUndoRedo')
    this.calculateCurrentObjects()
  }

  private setActiveObjects(objects: FabricObject[]) {
    if (objects.length === 0) {
      this.discardActiveObject()
      this.renderAll()
      return
    }
    if (objects.length === 1) {
      this.discardActiveObject()
      this.setActiveObject(objects[0])
      this.renderAll()
      return
    }
    const activeSelection = new ActiveSelection(objects)
    this._hoveredTarget = activeSelection
    this._hoveredTargets = [...objects]
    this.setActiveObject(activeSelection)
    this._fireSelectionEvents([activeSelection])
    this.renderAll()
  }

  public setActiveObjectById(id: string) {
    const targets: FabricObject[] = []
    this.forEachObject(function add(obj) {
      if (isCollection(obj)) {
        obj.forEachObject(add)
      }
      // 此处限制，该对象不应在组中，group的调整存在许多问题，先禁用掉
      if (id === (obj as any).id && !obj.parent) {
        targets.unshift(obj)
      }
    })

    if (targets.length) {
      this.setActiveObjects(targets)
    } else {
      this.discardActiveObject()
    }
    this.renderAll()
  }

  public bringForward() {
    if (this) {
      const activeObject = this.getActiveObject()
      if (activeObject) {
        this.objForEach((obj) => {
          const group = obj.parent ? obj.parent! : this!
          if (
            activeObject instanceof ActiveSelection &&
            group._objects.indexOf(obj) + activeObject._objects.length ===
              activeObject._objects.indexOf(obj) + group._objects.length
          ) {
            return
          }
          group.bringObjectForward(obj)
        })
        // 背景图层永远在bottom
        this.sendAllBgTilesBack()
        this.renderAll()
        this.eventbus.emit('recordToUndoRedo')
        this.calculateCurrentObjects()
      }
    }
  }

  public bringFront() {
    if (this) {
      const activeObject = this.getActiveObject()
      if (activeObject) {
        this.objForEach((obj) => {
          const group = obj.parent ? obj.parent! : this!
          group.bringObjectToFront(obj)
        })
        // 背景图层永远在bottom
        this.sendAllBgTilesBack()
        this.renderAll()
        this.eventbus.emit('recordToUndoRedo')
        this.calculateCurrentObjects()
      }
    }
  }

  public sendBackwards() {
    if (this) {
      const activeObject = this.getActiveObject()
      if (activeObject) {
        this.objForEach((obj) => {
          const group = obj.parent ? obj.parent! : this!
          if (
            activeObject instanceof ActiveSelection &&
            group._objects.indexOf(obj) === activeObject._objects.indexOf(obj)
          ) {
            return
          }
          group.sendObjectBackwards(obj)
        })
        // 背景图层永远在bottom
        this.sendAllBgTilesBack()
        this.renderAll()
        this.eventbus.emit('recordToUndoRedo')
        this.calculateCurrentObjects()
      }
    }
  }

  public sendBack() {
    if (this) {
      const activeObject = this.getActiveObject()
      if (activeObject) {
        this.objForEach((obj) => {
          const group = obj.parent ? obj.parent! : this!
          group.sendObjectToBack(obj)
        })
        // 背景图层永远在bottom
        this.sendAllBgTilesBack()
        this.renderAll()
        this.eventbus.emit('recordToUndoRedo')
        this.calculateCurrentObjects()
      }
    }
  }

  private sendAllBgTilesBack() {
    this.getObjects().forEach((item: any) => {
      if (item.bgt && item.bgt.startsWith('bg')) {
        this.sendObjectToBack(item)
      }
    })
  }

  private objForEach(fn: (obj: FabricObject) => void, reverse = false) {
    const objects = this.getActiveObjects()
    if (reverse) {
      objects.reverse()
    }
    const length = objects.length - 1
    for (let i = length; i >= 0; i--) {
      fn(objects[length - i])
    }
  }

  private calculateChildren(obj: any, lvl: number) {
    lvl++
    const result: any = []
    ;(<Group>obj)._objects.forEach((item: any) => {
      const t: any = {
        id: item.id,
        name: item.name,
        type: item.name?.substring(0, item.name?.lastIndexOf(' ')),
        v: item.visible,
        evt: item.evented,
        svg: this.getSvg(item),
        lvl,
      }
      if (item instanceof Group) {
        t.children = this.calculateChildren(item, lvl)
      }
      result.push(t)
    })

    return result
  }

  private getSvg(o: FabricObject) {
    if (o.isType('Text', 'IText')) {
      return SvgText
    } else if (o.isType('Group')) {
      return SvgGroup
    } else if (o.isType('Path')) {
      return SvgPath
    }
    const tlTemp = new Point({
      x: 0,
      y: 0,
    })
    const trTemp = new Point({
      x: 0,
      y: 0,
    })
    const brTemp = new Point({
      x: 0,
      y: 0,
    })
    const blTemp = new Point({
      x: 0,
      y: 0,
    })
    const { tl, tr, br, bl } = o.calcACoords()
    tlTemp.x = tl.x
    tlTemp.y = tl.y
    trTemp.x = tr.x
    trTemp.y = tr.y
    brTemp.x = br.x
    brTemp.y = br.y
    blTemp.x = bl.x
    blTemp.y = bl.y

    // eslint-disable-next-line prefer-const
    let { left, top, height, width } = util.makeBoundingBoxFromPoints([tlTemp, trTemp, brTemp, blTemp])
    const size = Math.max(height, width)
    if (width > height) {
      top += (height - size) / 2
    } else {
      left += (width - size) / 2
    }
    const shape = o._createBaseSVGMarkup(o._toSVG(), {
      noStyle: true,
    })
    const viewBox = `${left - 4} ${top - 4} ${size + 8} ${size + 8}`
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"  style="width:12px;height:12px" viewBox="${viewBox}" fill="transparent" stroke="#6b7280">${shape}</svg>`
    // svgCacheMap.set(object.id, svg) // TODO add cache
    return svg
  }

  public calculateCurrentObjects() {
    if (this) {
      this.workspace.setCurrentObjects([])
      this.getObjects().forEach((o: any) => {
        if (!o.bgt || !o.bgt.startsWith('bg')) {
          const target: any = {
            id: o.id,
            name: o.name,
            type: o.name?.substring(0, o.name?.lastIndexOf(' ')),
            v: o.visible,
            evt: o.evented,
            svg: this.getSvg(o),
            lvl: 0,
          }
          if (o instanceof Group) {
            target.children = this.calculateChildren(o, 0)
          }
          this.workspace.getCurrentObjects().push(target)
        }
      })
      this.eventbus.emit('contentChangeEnd')
    }
  }

  public deleteAnnotations() {
    this.remove(...this.getActiveObjects())
    this.discardActiveObject()
    this.renderAll()
    this.eventbus.emit('recordToUndoRedo')
    this.calculateCurrentObjects()
  }

  public setTargetAttrs(id: string, attrs: Record<string, any>) {
    // 根据id获取对象
    const targets: FabricObject[] = []
    this.forEachObject(function add(obj) {
      if (isCollection(obj)) {
        obj.forEachObject(add)
      }
      if (id === (obj as any).id) {
        targets.unshift(obj)
      }
    })
    if (targets.length === 1) {
      Object.keys(attrs).map((key) => {
        targets[0].set(key, attrs[key])
      })
      this.discardActiveObject() // 先取消
      this.setActiveObject(targets[0]) // 再选中
      this.renderAll()
      this.eventbus.emit('recordToUndoRedo')
      this.calculateCurrentObjects()
    }
  }

  public setActiveSelectionAttrs(attrs: Record<string, any>) {
    const target = this.getActiveObject()
    if (!target) return
    let hasAttrToUpdate = false
    Object.keys(attrs).map((key) => {
      if (this.exposedActiveSelectionAttrs.indexOf(key.toLowerCase()) >= 0) {
        hasAttrToUpdate = true
        if (key === 'top') {
          this?.setTargetTop(target, attrs[key])
        }
        if (key === 'left') {
          this?.setTargetLeft(target, attrs[key])
        }
        if (key === 'height') {
          this?.setTargetHeight(target, attrs[key])
        }
        if (key === 'width') {
          this?.setTargetWidth(target, attrs[key])
        }
        if (key === 'height') {
          this?.setTargetHeight(target, attrs[key])
        }
        if (key === 'angle') {
          this?.setTargetAngle(target, attrs[key])
        }
      }
    })
    if (hasAttrToUpdate) {
      if (target.group) {
        target.group.triggerLayout()
        target.group.dirty = true
      }
      this.renderAll()
      this.eventbus.emit('recordToUndoRedo')
      this.calculateCurrentObjects()
      this.fire('selection:updated')
    }
  }

  private onCanvasObjectAdded(_e: any) {
    if (this && this.workspace.getImageTargetBase64TilesCount() > 0) {
      this.bgTilesAddedCount += 1
      if (this.bgTilesAddedCount === this.workspace.getImageTargetBase64TilesCount() + 1) {
        // +1 means bg image rect
        this.off('object:added')
        this.bgTilesAddedCount = 0
        this.eventbus.emit('recordToUndoRedo')
      }
    }
  }
}
