import { createWorkspacePlugin, IMainCanvas, WorkspacePlugin, IWorkspaceService } from '@xxs3315/iajs'
import { Point } from 'fabric'
import 'hammerjs'

const mobileGesturePlugin: WorkspacePlugin = createWorkspacePlugin((workspace) => {
  const [canvas, workspaceService] = workspace.service.invokeFunction((accessor) => {
    return [accessor.get(IMainCanvas), accessor.get(IWorkspaceService)]
  })

  let zoomScaleInOneSinglePinch: number = 1
  let hammer: any = undefined

  return {
    setup() {
      console.log('[plugin mobile gesture setup]')
      // add hammerjs
      hammer = new Hammer(canvas.getSelectionElement())
      hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0, pointers: 2 }))
      hammer.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith(hammer.get('pan'))
      hammer.on('pan', (event: any) => {
        if (!canvas || !workspaceService) return
        event.preventDefault()
        const pointer = new Point(event.center.x, event.center.y)
        const mouseMovePoint = new Point(pointer.x, pointer.y)
        canvas.relativePan(mouseMovePoint.subtract(workspaceService.getMouseDownPoint()!))
        workspaceService.setMouseDownPoint(mouseMovePoint)
      })
      hammer.on('panstart', (event: any) => {
        // 当前若是绘图模式，那么会在双指操作后忽略一次undoredo写操作
        if (workspaceService.getMode() === 'manipulate') workspaceService.setRecordToUndoRedo(false)
        canvas!.selection = false
        workspaceService.setMouseDownPoint(new Point(event.center.x, event.center.y))
        if (workspaceService.getManipulateObj()) {
          // 当前若有绘图的图形，那么会在双指操作时取消掉
          canvas.remove(workspaceService.getManipulateObj())
          canvas.renderAll()
          workspaceService.setManipulateObj(undefined)
          workspaceService.setManipulateOrigX(0)
          workspaceService.setManipulateOrigY(0)
        }
        // 这里特别处理free-draw
        if (workspaceService.getMode() === 'manipulate' && workspaceService.getManipulateDetail() === 'free-draw') {
          workspaceService.setPrevMode(workspaceService.getMode())
          workspaceService.setPrevManipulateDetail(workspaceService.getManipulateDetail())
          canvas.setCurrentMode('select', undefined)
        }
      })
      hammer.on('panend', (event: any) => {
        canvas!.selection = true
        workspaceService.setMouseDownPoint(undefined)
        // 这里特别处理free-draw
        if (
          workspaceService.getPrevMode() === 'manipulate' &&
          workspaceService.getPrevManipulateDetail() === 'free-draw'
        ) {
          canvas.setCurrentMode(workspaceService.getPrevMode()!, workspaceService.getPrevManipulateDetail())
          workspaceService.setPrevMode(undefined)
          workspaceService.setPrevManipulateDetail(undefined)
        }
      })
      hammer.on('pinch', (event: any) => {
        canvas.zoomToScale(event.scale * zoomScaleInOneSinglePinch, {
          x: event.center.x,
          y: event.center.y,
        })
      })
      hammer.on('pinchstart', (event: any) => {
        zoomScaleInOneSinglePinch = workspaceService.getCurrentZoomScale()
      })
      hammer.on('pinchend', (event: any) => {})
    },
    dispose() {
      console.log('[plugin mobile gesture dispose]')
      hammer = undefined
    },
  }
})

export default mobileGesturePlugin
