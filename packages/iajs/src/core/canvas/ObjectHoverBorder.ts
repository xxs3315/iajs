import { Disposable } from '../instantiation'
import { IMainCanvas, MainCanvas } from './MainCanvas'
import { CanvasEvents, FabricObject, IText, Line, Path, Polyline, Rect } from 'fabric'
import { addDisposableListener } from '../instantiation/base/dom'
import { clone } from 'lodash-es'
import { isCollection } from '../../utils/fabric/fabric'

export class ObjectHoverBorder extends Disposable {
  private canvasEvents

  private lineWidth = 2
  private hoveredTarget: FabricObject | undefined

  constructor(@IMainCanvas private readonly canvas: MainCanvas) {
    super()

    this.canvasEvents = {
      'mouse:over': this.drawBorder.bind(this),
      'mouse:out': this.clearBorder.bind(this),
    }

    canvas.on(this.canvasEvents)

    this._register(
      addDisposableListener(this.canvas.upperCanvasEl, 'mouseout', () => {
        if (this.canvas.contextTopDirty && this.hoveredTarget) {
          this.clearContextTop(this.hoveredTarget.group || this.hoveredTarget)
          this.hoveredTarget = undefined
        }
      }),
    )
  }

  private clearContextTop(target: FabricObject, restoreManually = false) {
    const ctx = this.canvas.contextTop
    ctx.save()
    ctx.transform(...this.canvas.viewportTransform)
    target.transform(ctx)
    const { strokeWidth, scaleX, scaleY, strokeUniform } = target
    const zoom = this.canvas.getZoom()
    // we add 4 pixel, to be sure to do not leave any pixel out
    const width = target.width + 4 / zoom + (strokeUniform ? strokeWidth / scaleX : strokeWidth)
    const height = target.height + 4 / zoom + (strokeUniform ? strokeWidth / scaleY : strokeWidth)
    ctx.clearRect(-width / 2, -height / 2, width, height)
    restoreManually || ctx.restore()
    return ctx
  }

  private clearBorder(e: CanvasEvents['mouse:over']) {
    const target = e.target

    this.hoveredTarget = undefined

    if (!target || target === this.canvas._activeObject) return

    if (this.canvas.contextTopDirty) {
      this.clearContextTop(target)
    }
  }

  private drawBorder(e: CanvasEvents['mouse:out']) {
    const target = e.target

    if (!target || target === this.canvas._activeObject) return

    this.hoveredTarget = target

    const ctx = this.clearContextTop(target, true)
    if (!ctx) return

    const object = clone(target)

    // 分组 或 文字 或 箭头 或 线 特殊处理，显示矩形边框
    if (
      isCollection(object) ||
      object instanceof IText ||
      object instanceof Polyline ||
      object instanceof Line ||
      object instanceof Path
    ) {
      ;(object as FabricObject)._render = Rect.prototype._render
    }

    const { strokeWidth, strokeUniform } = object

    let { width, height } = object

    width += strokeUniform ? strokeWidth / object.scaleX : strokeWidth
    height += strokeUniform ? strokeWidth / object.scaleY : strokeWidth

    const totalObjectScaling = object.getTotalObjectScaling()

    const lineWidth = Math.min(this.lineWidth, width * totalObjectScaling.x, height * totalObjectScaling.y)

    width -= lineWidth / totalObjectScaling.x
    height -= lineWidth / totalObjectScaling.y

    object.set({
      width,
      height,
      stroke: 'rgb(60,126,255)',
      strokeWidth: lineWidth,
      strokeDashArray: null,
      strokeDashOffset: 0,
      strokeLineCap: 'butt',
      strokeLineJoin: 'miter',
      strokeMiterLimit: 4,
    })

    object._renderPaintInOrder = () => {
      ctx.save()
      const scaling = object.getTotalObjectScaling()
      ctx.scale(1 / scaling.x, 1 / scaling.y)
      object._setLineDash(ctx, object.strokeDashArray)
      object._setStrokeStyles(ctx, object)
      ctx.stroke()
      ctx.restore()
    }

    object._render(ctx)

    ctx.restore()
    this.canvas.contextTopDirty = true
  }

  public dispose(): void {
    super.dispose()
    this.canvas.off(this.canvasEvents)
  }
}
