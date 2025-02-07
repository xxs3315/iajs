import { Disposable } from '../instantiation'
import { IMainCanvas, MainCanvas } from './MainCanvas'
import { EventbusService, IEventbusService } from '../service/eventbus/EventbusService'
import { Ellipse, IText, Line, PencilBrush, Point, Polyline, Rect } from 'fabric'
import { randomText } from '../../utils/string'
import { IWorkspaceService, WorkspaceService } from '../service/workspace/WorkspaceService'
import { ArrowPoints } from '../../utils/fabric/ArrowPoints'
import { IWorkspaceUndoRedoService, WorkspaceUndoRedoService } from '../workspace/undoRedo/WorkspaceUndoRedoService'

export class FabricTools extends Disposable {
  private canvasEvents
  private uniqueIds = new Map<string, number>()

  constructor(
    @IMainCanvas private readonly canvas: MainCanvas,
    @IEventbusService private readonly eventbus: EventbusService,
    @IWorkspaceService private readonly workspace: WorkspaceService,
    @IWorkspaceUndoRedoService private readonly undoRedo: WorkspaceUndoRedoService,
  ) {
    super()
    this.canvasEvents = {
      'mouse:down': this.onCanvasMouseDown.bind(this),
      'mouse:down:before': this.onCanvasMouseDownBefore.bind(this),
      'mouse:move': this.onCanvasMouseMove.bind(this),
      'mouse:up': this.onCanvasMouseUp.bind(this),
      'path:created': this.onFreeDrawCreated.bind(this), // free draw
    }
    this.canvas.on(this.canvasEvents)
  }

  private onFreeDrawCreated(e: any) {
    if (this.canvas.isDrawingMode) {
      if (this.workspace.getRecordToUndoRedo()) {
        // free-draw 创建的对象
        const id = randomText()
        e.path.id = id
        const count = this.uniqueIds.get('Free-draw') || 1
        const name = `Free draw ${count}`
        e.path.name = name
        e.path.sType = 'free-draw'
        e.path.activeOn = 'up'
        this.uniqueIds.set('Free-draw', count + 1)
        this.canvas.calculateCurrentObjects()
        this.eventbus.emit('annotationCreateEnd', {
          annotation: e.path,
          mode: this.workspace.getMode(),
          manipulateDetail: this.workspace.getManipulateDetail(),
        })
        this.eventbus.emit('recordToUndoRedo')
      } else {
        this.workspace.setRecordToUndoRedo(true)
      }
    }
  }

  private onCanvasMouseDownBefore(e: any) {
    if (e.e.touches && e.e.touches.length > 1) {
      // more than 1 finger
    }
  }

  private onCanvasMouseDown(e: any) {
    if (e.e.touches && e.e.touches.length > 1) {
      // more than 1 finger
      return
    }
    if (this.canvas !== undefined) {
      const p = this.canvas.getViewportPoint(e)
      this.workspace.setMouseDownPoint(new Point(p.x, p.y))
      let isMouseDownInActiveObject = false
      isMouseDownInActiveObject = !!this.canvas.getActiveObject()?.containsPoint(this.canvas.getScenePoint(e))
      let isMouseDownInActiveObjectControls = false
      if (this.canvas.getActiveObject()?.findControl(this.workspace.getMouseDownPoint()!)) {
        isMouseDownInActiveObjectControls = true
      }
      !isMouseDownInActiveObject && (isMouseDownInActiveObject = isMouseDownInActiveObjectControls)
      this.workspace.setMouseDownPointInActiveObject(isMouseDownInActiveObject)
    }
  }

  private onCanvasMouseMove(e: any) {
    if (e.e.touches && e.e.touches.length > 1) {
      // more than 1 finger
      return
    }
    if (this.canvas !== undefined && this.workspace.getMouseDownPoint() !== undefined) {
      if (this.workspace.getCtrlKeydown()) {
        const pointer = this.canvas.getViewportPoint(e)
        const mouseMovePoint = new Point(pointer.x, pointer.y)
        this.canvas.relativePan(mouseMovePoint.subtract(this.workspace.getMouseDownPoint()!))
        this.workspace.setMouseDownPoint(mouseMovePoint)
      } else {
        if (this.workspace.getMode() === 'manipulate' && !this.workspace.getMouseDownPointInActiveObject()) {
          if (this.workspace.getManipulateObj()) {
            if (this.workspace.getManipulateDetail() === 'text') {
              const pointer = this.canvas.getScenePoint(e)
              if (this.workspace.getManipulateObj()) {
                const width = Math.abs(pointer.x - this.workspace.getManipulateOrigX())
                const targetTextObj = this.workspace.getManipulateObj() as IText
                const originalLines = targetTextObj.text.split('\n')
                const targetFontSizes: number[] = []
                originalLines.forEach((line) => {
                  const currentLineFontSize = this.findFitFontSize({
                    text: line,
                    fontSize: 0,
                    fontFamily: targetTextObj.fontFamily,
                    width,
                  })
                  targetFontSizes.push(currentLineFontSize)
                })

                const minTargetFontSize = Math.max(Math.min(...targetFontSizes), 1)
                targetTextObj.fontSize = minTargetFontSize
                targetTextObj.set({ lineHeight: 1.12 })
                targetTextObj.set({ width: targetTextObj.calcTextWidth() })
                targetTextObj.set({ height: targetTextObj.calcTextHeight() })
              }
              this.canvas.renderAll()
            }
            if (this.workspace.getManipulateDetail() === 'line') {
              const pointer = this.canvas.getScenePoint(e)
              if (this.workspace.getManipulateObj()) {
                this.workspace.getManipulateObj().stroke = '#FF0000'
                this.workspace.getManipulateObj().strokeWidth = 3
                this.workspace.getManipulateObj().fill = '#FF0000'

                this.workspace.getManipulateObj().set({ x2: pointer.x })
                this.workspace.getManipulateObj().set({ y2: pointer.y })

                this.workspace.getManipulateObj().setCoords()
              }
              this.canvas.renderAll()
            }
            if (this.workspace.getManipulateDetail() === 'single-arrow') {
              const pointer = this.canvas.getScenePoint(e)
              if (this.workspace.getManipulateObj()) {
                this.canvas.remove(this.workspace.getManipulateObj())
                const points = ArrowPoints(
                  'single',
                  this.workspace.getManipulateOrigX(),
                  this.workspace.getManipulateOrigY(),
                  pointer.x,
                  pointer.y,
                )
                const id = randomText()
                this.workspace.setManipulateObj(
                  new Polyline(points, {
                    id: id,
                    name: 'single-arrow-' + id,
                    sType: 'single-arrow',
                    stroke: '#FF0000',
                    strokeWidth: 1,
                    fill: '#FF0000',
                    angle: 0,
                    transparentCorners: false,
                    hasBorders: true,
                    hasControls: true,
                    strokeUniform: true,
                    activeOn: 'up',
                  }),
                )

                this.canvas.add(this.workspace.getManipulateObj())
              }
              this.canvas.renderAll()
            }
            if (this.workspace.getManipulateDetail() === 'double-arrow') {
              const pointer = this.canvas.getScenePoint(e)
              if (this.workspace.getManipulateObj()) {
                this.canvas.remove(this.workspace.getManipulateObj())
                const points = ArrowPoints(
                  'double',
                  this.workspace.getManipulateOrigX(),
                  this.workspace.getManipulateOrigY(),
                  pointer.x,
                  pointer.y,
                )
                const id = randomText()
                this.workspace.setManipulateObj(
                  new Polyline(points, {
                    id: id,
                    name: 'double-arrow-' + id,
                    sType: 'double-arrow',
                    stroke: '#FF0000',
                    strokeWidth: 1,
                    fill: '#FF0000',
                    angle: 0,
                    transparentCorners: false,
                    hasBorders: true,
                    hasControls: true,
                    strokeUniform: true,
                    activeOn: 'up',
                  }),
                )

                this.canvas.add(this.workspace.getManipulateObj())
              }
              this.canvas.renderAll()
            }
            if (this.workspace.getManipulateDetail() === 'rectangle') {
              const pointer = this.canvas.getScenePoint(e)
              if (this.workspace.getManipulateObj()) {
                this.workspace.getManipulateObj().stroke = '#FF0000'
                this.workspace.getManipulateObj().strokeWidth = 3
                this.workspace.getManipulateObj().fill = '#FF0000'

                if (this.workspace.getManipulateOrigX() > pointer.x) {
                  this.workspace.getManipulateObj().set({ left: Math.abs(pointer.x) })
                }
                if (this.workspace.getManipulateOrigY() > pointer.y) {
                  this.workspace.getManipulateObj().set({ top: Math.abs(pointer.y) })
                }

                this.workspace.getManipulateObj().set({
                  width: Math.abs(this.workspace.getManipulateOrigX() - pointer.x),
                })
                this.workspace.getManipulateObj().set({
                  height: Math.abs(this.workspace.getManipulateOrigY() - pointer.y),
                })

                this.workspace.getManipulateObj().setCoords()
              }
              this.canvas.renderAll()
            }
            if (this.workspace.getManipulateDetail() === 'rectangle-outline') {
              const pointer = this.canvas.getScenePoint(e)
              if (this.workspace.getManipulateObj()) {
                this.workspace.getManipulateObj().stroke = '#FF0000'
                this.workspace.getManipulateObj().strokeWidth = 3
                this.workspace.getManipulateObj().fill = 'transparent'

                if (this.workspace.getManipulateOrigX() > pointer.x) {
                  this.workspace.getManipulateObj().set({ left: Math.abs(pointer.x) })
                }
                if (this.workspace.getManipulateOrigY() > pointer.y) {
                  this.workspace.getManipulateObj().set({ top: Math.abs(pointer.y) })
                }

                this.workspace.getManipulateObj().set({
                  width: Math.abs(this.workspace.getManipulateOrigX() - pointer.x),
                })
                this.workspace.getManipulateObj().set({
                  height: Math.abs(this.workspace.getManipulateOrigY() - pointer.y),
                })

                this.workspace.getManipulateObj().setCoords()
              }
              this.canvas.renderAll()
            }
            if (this.workspace.getManipulateDetail() === 'rectangle-highlight') {
              const pointer = this.canvas.getScenePoint(e)
              if (this.workspace.getManipulateObj()) {
                this.workspace.getManipulateObj().stroke = '#FFFF00'
                this.workspace.getManipulateObj().strokeWidth = 3
                this.workspace.getManipulateObj().fill = '#FFFF00'
                this.workspace.getManipulateObj().opacity = '0.5'

                if (this.workspace.getManipulateOrigX() > pointer.x) {
                  this.workspace.getManipulateObj().set({ left: Math.abs(pointer.x) })
                }
                if (this.workspace.getManipulateOrigY() > pointer.y) {
                  this.workspace.getManipulateObj().set({ top: Math.abs(pointer.y) })
                }

                this.workspace.getManipulateObj().set({
                  width: Math.abs(this.workspace.getManipulateOrigX() - pointer.x),
                })
                this.workspace.getManipulateObj().set({
                  height: Math.abs(this.workspace.getManipulateOrigY() - pointer.y),
                })

                this.workspace.getManipulateObj().setCoords()
              }
              this.canvas.renderAll()
            }
            if (this.workspace.getManipulateDetail() === 'ellipse') {
              const pointer = this.canvas.getScenePoint(e)
              if (this.workspace.getManipulateObj()) {
                this.workspace.getManipulateObj().stroke = '#FF0000'
                this.workspace.getManipulateObj().strokeWidth = 3
                this.workspace.getManipulateObj().fill = '#FF0000'

                if (this.workspace.getManipulateOrigX() > pointer.x) {
                  this.workspace.getManipulateObj().set({ left: Math.abs(pointer.x) })
                }
                if (this.workspace.getManipulateOrigY() > pointer.y) {
                  this.workspace.getManipulateObj().set({ top: Math.abs(pointer.y) })
                }

                this.workspace.getManipulateObj().set({
                  rx: Math.abs(this.workspace.getManipulateOrigX() - pointer.x) / 2,
                })
                this.workspace.getManipulateObj().set({
                  ry: Math.abs(this.workspace.getManipulateOrigY() - pointer.y) / 2,
                })

                this.workspace.getManipulateObj().setCoords()
              }
              this.canvas.renderAll()
            }
            if (this.workspace.getManipulateDetail() === 'ellipse-outline') {
              const pointer = this.canvas.getScenePoint(e)
              if (this.workspace.getManipulateObj()) {
                this.workspace.getManipulateObj().stroke = '#FF0000'
                this.workspace.getManipulateObj().strokeWidth = 3
                this.workspace.getManipulateObj().fill = 'transparent'

                if (this.workspace.getManipulateOrigX() > pointer.x) {
                  this.workspace.getManipulateObj().set({ left: Math.abs(pointer.x) })
                }
                if (this.workspace.getManipulateOrigY() > pointer.y) {
                  this.workspace.getManipulateObj().set({ top: Math.abs(pointer.y) })
                }

                this.workspace.getManipulateObj().set({
                  rx: Math.abs(this.workspace.getManipulateOrigX() - pointer.x) / 2,
                })
                this.workspace.getManipulateObj().set({
                  ry: Math.abs(this.workspace.getManipulateOrigY() - pointer.y) / 2,
                })

                this.workspace.getManipulateObj().setCoords()
              }
              this.canvas.renderAll()
            }
            if (this.workspace.getManipulateDetail() === 'ellipse-highlight') {
              const pointer = this.canvas.getScenePoint(e)
              if (this.workspace.getManipulateObj()) {
                this.workspace.getManipulateObj().stroke = '#FFFF00'
                this.workspace.getManipulateObj().strokeWidth = 3
                this.workspace.getManipulateObj().fill = '#FFFF00'
                this.workspace.getManipulateObj().opacity = '0.5'

                if (this.workspace.getManipulateOrigX() > pointer.x) {
                  this.workspace.getManipulateObj().set({ left: Math.abs(pointer.x) })
                }
                if (this.workspace.getManipulateOrigY() > pointer.y) {
                  this.workspace.getManipulateObj().set({ top: Math.abs(pointer.y) })
                }

                this.workspace.getManipulateObj().set({
                  rx: Math.abs(this.workspace.getManipulateOrigX() - pointer.x) / 2,
                })
                this.workspace.getManipulateObj().set({
                  ry: Math.abs(this.workspace.getManipulateOrigY() - pointer.y) / 2,
                })

                this.workspace.getManipulateObj().setCoords()
              }
              this.canvas.renderAll()
            }
            if (this.workspace.getManipulateDetail() === 'free-draw') {
              const pointer = this.canvas.getScenePoint(e)
              this.canvas.freeDrawingBrush?.onMouseMove(pointer, e)
            }
          } else {
            const pointer = this.canvas.getScenePoint(e)
            const deltaX = Math.abs(pointer.x - this.workspace.getMouseDownPoint()!.x)
            const deltaY = Math.abs(pointer.y - this.workspace.getMouseDownPoint()!.y)
            if (
              deltaX >= this.workspace.getCreateObjectTolerance() ||
              deltaY >= this.workspace.getCreateObjectTolerance()
            ) {
              // 超过了容忍度，视作绘图
              this.canvas.isDrawingMode = true
              const id = randomText()
              if (this.workspace.getManipulateDetail() === 'text') {
                const pointer = this.canvas.getScenePoint(e)
                this.workspace.setManipulateOrigX(pointer.x)
                this.workspace.setManipulateOrigY(pointer.y)
                const count = this.uniqueIds.get('Text') || 1
                const name = `Text ${count}`

                const defaultText = 'Add text here...'
                const targetText = new IText(defaultText, {
                  id: id,
                  name: name,
                  sType: 'text',
                  left: this.workspace.getManipulateOrigX(),
                  top: this.workspace.getManipulateOrigY(),
                  angle: 0,
                  transparentCorners: false,
                  hasBorders: true,
                  hasControls: true,
                  fill: '#FF0000',
                  fontSize: 1,
                  activeOn: 'up',
                })
                targetText.setControlsVisibility({ mb: false, ml: false, mt: false, mr: false })
                targetText.objectCaching = false

                this.workspace.setManipulateObj(targetText)
                this.uniqueIds.set('Text', count + 1)
                this.canvas.add(this.workspace.getManipulateObj())
                this.canvas.renderAll()
              }
              if (this.workspace.getManipulateDetail() === 'line') {
                const pointer = this.canvas.getScenePoint(e)
                this.workspace.setManipulateOrigX(pointer.x)
                this.workspace.setManipulateOrigY(pointer.y)
                const count = this.uniqueIds.get('Line') || 1
                const name = `Line ${count}`
                this.workspace.setManipulateObj(
                  new Line(
                    [this.workspace.getManipulateOrigX(), this.workspace.getManipulateOrigY(), pointer.x, pointer.y],
                    {
                      id: id,
                      name: name,
                      sType: 'line',
                      angle: 0,
                      transparentCorners: false,
                      hasBorders: true,
                      hasControls: true,
                      strokeUniform: true,
                      activeOn: 'up',
                    },
                  ),
                )
                this.uniqueIds.set('Line', count + 1)
                this.canvas.add(this.workspace.getManipulateObj())
              }
              if (this.workspace.getManipulateDetail() === 'single-arrow') {
                const pointer = this.canvas.getScenePoint(e)
                this.workspace.setManipulateOrigX(pointer.x)
                this.workspace.setManipulateOrigY(pointer.y)

                this.workspace.setManipulateObj(
                  new Polyline(
                    [
                      { x: this.workspace.getManipulateOrigX(), y: this.workspace.getManipulateOrigY() },
                      { x: pointer.x, y: pointer.y },
                    ],
                    {
                      id: id,
                      name: 'single-arrow-' + id,
                      sType: 'single-arrow',
                      angle: 0,
                      transparentCorners: false,
                      hasBorders: true,
                      hasControls: true,
                      strokeUniform: true,
                      activeOn: 'up',
                    },
                  ),
                )
                this.canvas.add(this.workspace.getManipulateObj())
              }
              if (this.workspace.getManipulateDetail() === 'double-arrow') {
                const pointer = this.canvas.getScenePoint(e)
                this.workspace.setManipulateOrigX(pointer.x)
                this.workspace.setManipulateOrigY(pointer.y)

                this.workspace.setManipulateObj(
                  new Polyline(
                    [
                      { x: this.workspace.getManipulateOrigX(), y: this.workspace.getManipulateOrigY() },
                      { x: pointer.x, y: pointer.y },
                    ],
                    {
                      id: id,
                      name: 'double-arrow-' + id,
                      sType: 'double-arrow',
                      angle: 0,
                      transparentCorners: false,
                      hasBorders: true,
                      hasControls: true,
                      strokeUniform: true,
                      activeOn: 'up',
                    },
                  ),
                )
                this.canvas.add(this.workspace.getManipulateObj())
              }
              if (this.workspace.getManipulateDetail() === 'rectangle') {
                const pointer = this.canvas.getScenePoint(e)
                this.workspace.setManipulateOrigX(pointer.x)
                this.workspace.setManipulateOrigY(pointer.y)
                const count = this.uniqueIds.get('Rect') || 1
                const name = `Rect ${count}`
                this.workspace.setManipulateObj(
                  new Rect({
                    id: id,
                    name: name,
                    sType: 'rectangle',
                    left: this.workspace.getManipulateOrigX(),
                    top: this.workspace.getManipulateOrigY(),
                    width: pointer.x - this.workspace.getManipulateOrigX(),
                    height: pointer.y - this.workspace.getManipulateOrigY(),
                    angle: 0,
                    transparentCorners: false,
                    hasBorders: true,
                    hasControls: true,
                    strokeUniform: true,
                    activeOn: 'up',
                  }),
                )
                this.uniqueIds.set('Rect', count + 1)
                this.canvas.add(this.workspace.getManipulateObj())
              }
              if (this.workspace.getManipulateDetail() === 'rectangle-outline') {
                const pointer = this.canvas.getScenePoint(e)
                this.workspace.setManipulateOrigX(pointer.x)
                this.workspace.setManipulateOrigY(pointer.y)
                const count = this.uniqueIds.get('Rect-ol') || 1
                const name = `Rect ol ${count}`
                this.workspace.setManipulateObj(
                  new Rect({
                    id: id,
                    name: name,
                    sType: 'rectangle-outline',
                    left: this.workspace.getManipulateOrigX(),
                    top: this.workspace.getManipulateOrigY(),
                    width: pointer.x - this.workspace.getManipulateOrigX(),
                    height: pointer.y - this.workspace.getManipulateOrigY(),
                    angle: 0,
                    transparentCorners: false,
                    hasBorders: true,
                    hasControls: true,
                    strokeUniform: true,
                    activeOn: 'up',
                  }),
                )
                this.uniqueIds.set('Rect-ol', count + 1)
                this.canvas.add(this.workspace.getManipulateObj())
              }
              if (this.workspace.getManipulateDetail() === 'rectangle-highlight') {
                const pointer = this.canvas.getScenePoint(e)
                this.workspace.setManipulateOrigX(pointer.x)
                this.workspace.setManipulateOrigY(pointer.y)
                const count = this.uniqueIds.get('Rect-hl') || 1
                const name = `Rect hl ${count}`
                this.workspace.setManipulateObj(
                  new Rect({
                    id: id,
                    name: name,
                    sType: 'rectangle-highlight',
                    left: this.workspace.getManipulateOrigX(),
                    top: this.workspace.getManipulateOrigY(),
                    width: pointer.x - this.workspace.getManipulateOrigX(),
                    height: pointer.y - this.workspace.getManipulateOrigY(),
                    angle: 0,
                    transparentCorners: false,
                    hasBorders: true,
                    hasControls: true,
                    strokeUniform: true,
                    activeOn: 'up',
                  }),
                )
                this.uniqueIds.set('Rect-hl', count + 1)
                this.canvas.add(this.workspace.getManipulateObj())
              }
              if (this.workspace.getManipulateDetail() === 'ellipse') {
                const pointer = this.canvas.getScenePoint(e)
                this.workspace.setManipulateOrigX(pointer.x)
                this.workspace.setManipulateOrigY(pointer.y)
                const count = this.uniqueIds.get('Ellipse') || 1
                const name = `Ellipse ${count}`
                this.workspace.setManipulateObj(
                  new Ellipse({
                    id: id,
                    name: name,
                    sType: 'ellipse',
                    left: this.workspace.getManipulateOrigX(),
                    top: this.workspace.getManipulateOrigY(),
                    rx: (pointer.x - this.workspace.getManipulateOrigX()) / 2,
                    ry: (pointer.y - this.workspace.getManipulateOrigY()) / 2,
                    angle: 0,
                    transparentCorners: false,
                    hasBorders: true,
                    hasControls: true,
                    strokeUniform: true,
                    activeOn: 'up',
                  }),
                )
                this.uniqueIds.set('Ellipse', count + 1)
                this.canvas.add(this.workspace.getManipulateObj())
              }
              if (this.workspace.getManipulateDetail() === 'ellipse-outline') {
                const pointer = this.canvas.getScenePoint(e)
                this.workspace.setManipulateOrigX(pointer.x)
                this.workspace.setManipulateOrigY(pointer.y)
                const count = this.uniqueIds.get('Ellipse-ol') || 1
                const name = `Ellipse ol ${count}`
                this.workspace.setManipulateObj(
                  new Ellipse({
                    id: id,
                    name: name,
                    sType: 'ellipse-outline',
                    left: this.workspace.getManipulateOrigX(),
                    top: this.workspace.getManipulateOrigY(),
                    rx: (pointer.x - this.workspace.getManipulateOrigX()) / 2,
                    ry: (pointer.y - this.workspace.getManipulateOrigY()) / 2,
                    angle: 0,
                    transparentCorners: false,
                    hasBorders: true,
                    hasControls: true,
                    strokeUniform: true,
                    activeOn: 'up',
                  }),
                )
                this.uniqueIds.set('Ellipse-ol', count + 1)
                this.canvas.add(this.workspace.getManipulateObj())
              }
              if (this.workspace.getManipulateDetail() === 'ellipse-highlight') {
                const pointer = this.canvas.getScenePoint(e)
                this.workspace.setManipulateOrigX(pointer.x)
                this.workspace.setManipulateOrigY(pointer.y)
                const count = this.uniqueIds.get('Ellipse-hl') || 1
                const name = `Ellipse hl ${count}`
                this.workspace.setManipulateObj(
                  new Ellipse({
                    id: id,
                    name: name,
                    sType: 'ellipse-highlight',
                    left: this.workspace.getManipulateOrigX(),
                    top: this.workspace.getManipulateOrigY(),
                    rx: (pointer.x - this.workspace.getManipulateOrigX()) / 2,
                    ry: (pointer.y - this.workspace.getManipulateOrigY()) / 2,
                    angle: 0,
                    transparentCorners: false,
                    hasBorders: true,
                    hasControls: true,
                    strokeUniform: true,
                    activeOn: 'up',
                  }),
                )
                this.uniqueIds.set('Ellipse-hl', count + 1)
                this.canvas.add(this.workspace.getManipulateObj())
              }
              if (this.workspace.getManipulateDetail() === 'free-draw') {
                const pointer = this.canvas.getScenePoint(e)
                this.workspace.setManipulateOrigX(pointer.x)
                this.workspace.setManipulateOrigY(pointer.y)
                // free draw 时，加入一个fake object，并不加到canvas上
                this.workspace.setManipulateObj(
                  new Rect({
                    id: 'fake-id',
                    name: 'fake-name',
                    sType: 'fake-s-type',
                    left: this.workspace.getManipulateOrigX(),
                    top: this.workspace.getManipulateOrigY(),
                    width: 10,
                    height: 10,
                    angle: 0,
                    transparentCorners: false,
                    hasBorders: false,
                    hasControls: false,
                    strokeUniform: true,
                    selectable: false,
                    visible: false,
                    evented: false,
                    activeOn: 'up',
                  }),
                )
                this.canvas.freeDrawingBrush = new PencilBrush(this.canvas)
                this.canvas.freeDrawingBrush.color = '#FF0000'
                this.canvas.freeDrawingBrush.width = 6
                this.canvas.freeDrawingBrush?.onMouseDown(pointer, e)
              }
            }
          }
        }
      }
    }
  }

  private findFitFontSize = ({ text, fontSize, fontFamily, width }: any) => {
    let currentLineWidth = this.getLineWidth(text, `${fontSize}px ${fontFamily}`)
    while (currentLineWidth < width) {
      fontSize++
      currentLineWidth = this.getLineWidth(text, `${fontSize}px ${fontFamily}`)
    }
    return fontSize
  }

  private getLineWidth = (text: any, font: any) => {
    if (!this.workspace.getTmpLineCanvas()) {
      this.workspace.setTmpLineCanvas(document.createElement('canvas'))
    }
    const canvas2dContext = this.workspace.getTmpLineCanvas()!.getContext('2d')
    if (canvas2dContext) {
      canvas2dContext.font = font
      const metrics = canvas2dContext.measureText(text)

      return metrics.width
    }
    return 0
  }

  private onCanvasMouseUp(e: any) {
    if (e.e.touches && e.e.touches.length > 1) {
      // more than 1 finger
      return
    }
    if (this.canvas !== undefined) {
      this.workspace.setMouseDownPoint(undefined)
      this.workspace.setMouseDownPointInActiveObject(false)
      if (
        this.workspace.getManipulateDetail() === 'line' ||
        this.workspace.getManipulateDetail() === 'single-arrow' ||
        this.workspace.getManipulateDetail() === 'double-arrow' ||
        this.workspace.getManipulateDetail() === 'rectangle' ||
        this.workspace.getManipulateDetail() === 'rectangle-outline' ||
        this.workspace.getManipulateDetail() === 'rectangle-highlight' ||
        this.workspace.getManipulateDetail() === 'ellipse' ||
        this.workspace.getManipulateDetail() === 'ellipse-outline' ||
        this.workspace.getManipulateDetail() === 'ellipse-highlight' ||
        this.workspace.getManipulateDetail() === 'text'
      ) {
        if (this.workspace.getManipulateDetail() === 'single-arrow' && this.workspace.getManipulateObj()) {
          // 绘制箭头特殊处理 name
          const count = this.uniqueIds.get('Arrow-one-way') || 1
          const name = `Arrow one-way ${count}`
          this.workspace.getManipulateObj().set({
            name: name,
          })
          this.uniqueIds.set('Arrow-one-way', count + 1)
        }
        if (this.workspace.getManipulateDetail() === 'double-arrow' && this.workspace.getManipulateObj()) {
          // 绘制箭头特殊处理 name
          const count = this.uniqueIds.get('Double-arrow') || 1
          const name = `Double arrow ${count}`
          this.workspace.getManipulateObj().set({
            name: name,
          })
          this.uniqueIds.set('Double-arrow', count + 1)
        }
        if (this.workspace.getRecordToUndoRedo()) {
          this.eventbus.emit('annotationCreateEnd', {
            annotation: this.workspace.getManipulateObj(),
            mode: this.workspace.getMode(),
            manipulateDetail: this.workspace.getManipulateDetail(),
          })
          // this.canvas.setCurrentMode('select') // 取消这一行，表示所有的绘制均是连续绘制模式
          this.workspace.setManipulateOrigX(0)
          this.workspace.setManipulateOrigY(0)
          this.workspace.setManipulateObj(undefined)
          this.eventbus.emit('recordToUndoRedo')
          this.canvas.calculateCurrentObjects()
        } else {
          this.workspace.setRecordToUndoRedo(true)
        }
      } else if (this.workspace.getManipulateDetail() === 'free-draw') {
        // see path:created event
        this.workspace.setManipulateOrigX(0)
        this.workspace.setManipulateOrigY(0)
        this.workspace.setManipulateObj(undefined)
        this.canvas.freeDrawingBrush?.onMouseUp(e)
        this.canvas.freeDrawingBrush = undefined
      }
      this.canvas.isDrawingMode = false
    }
  }

  public dispose(): void {
    super.dispose()
    this.canvas.off(this.canvasEvents)
  }
}
