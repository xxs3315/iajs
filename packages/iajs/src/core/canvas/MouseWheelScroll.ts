import { Disposable, toDisposable } from '../instantiation'
import { IMainCanvas, MainCanvas } from './MainCanvas'
import { EventbusService, IEventbusService } from '../service/eventbus/EventbusService'
import { CanvasEvents, Point } from 'fabric'

export class MouseWheelScroll extends Disposable {
  constructor(
    @IMainCanvas private readonly canvas: MainCanvas,
    @IEventbusService private readonly eventbus: EventbusService,
  ) {
    super()
    this.initMouseWheelScroll()
  }

  private initMouseWheelScroll() {
    const mouseWheel = (e: CanvasEvents['mouse:wheel']) => {
      e.e.preventDefault()
      e.e.stopPropagation()
      if (e.e.ctrlKey || e.e.metaKey) {
        const { deltaX, deltaY } = e.e
        const pointer = this.canvas.getViewportPoint(e.e)
        const point = new Point(pointer.x, pointer.y)
        if (deltaX > 0 || deltaY > 0) {
          this.canvas.zoomOut(point)
        } else if (deltaX < 0 || deltaY < 0) {
          this.canvas.zoomIn(point)
        }
      }
    }

    this.canvas.on('mouse:wheel', mouseWheel)
    this._register(
      toDisposable(() => {
        this.canvas.off('mouse:wheel', mouseWheel)
      }),
    )
  }
}
