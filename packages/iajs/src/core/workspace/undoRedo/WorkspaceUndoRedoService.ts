import { BaseCommand } from '../../service/undoRedo/command'
import { UndoRedoBase } from '../../service/undoRedo/UndoRedoBase'
import { IUndoRedoService, UndoRedoService } from '../../service/undoRedo/UndoRedoService'
import { IWorkspaceService, WorkspaceService } from '../../service/workspace/WorkspaceService'
import { debounce } from 'lodash-es'
import { createDecorator } from '../../instantiation'
import { Disposable } from '../../instantiation'
import { IDisposable, runWhenIdle } from '../../instantiation/base'
import { IMainCanvas, MainCanvas } from '../../canvas/MainCanvas'
import { EventbusService, IEventbusService } from '../../service/eventbus/EventbusService'

export const IWorkspaceUndoRedoService = createDecorator<WorkspaceUndoRedoService>('workspaceUndoRedoService')

class UndoRedoStateCommand extends BaseCommand {
  constructor(private readonly workspaceUndoRedoService: WorkspaceUndoRedoService) {
    super()
  }

  public undo() {
    this.workspaceUndoRedoService.undo()
  }

  public redo() {
    this.workspaceUndoRedoService.redo()
  }
}

export class WorkspaceUndoRedoService extends Disposable {
  private canvasEvents

  private undoRedo:
    | {
        instantiation: UndoRedoBase
        lastState: string | undefined
      }
    | undefined = undefined

  constructor(
    @IMainCanvas private readonly canvas: MainCanvas,
    @IWorkspaceService private readonly workspacesService: WorkspaceService,
    @IUndoRedoService private readonly undoRedoService: UndoRedoService,
    @IEventbusService private readonly eventbus: EventbusService,
  ) {
    super()

    this.canvasEvents = {
      'object:modified': this.saveState.bind(this),
    }
    canvas.on(this.canvasEvents)

    this.initWorkspace()
  }

  private saveDispose: IDisposable | undefined
  public saveState = debounce(() => {
    this.saveDispose?.dispose()
    this.saveDispose = runWhenIdle(() => {
      if (!this.undoRedo || !this.undoRedo.instantiation.isTracking) return
      this.push(this.undoRedo.lastState)
      this.undoRedo.lastState = this.getJson()
      this.undoRedoService.add(new UndoRedoStateCommand(this))
    })
    this.canvas.fire('selection:updated')
  }, 300)

  public push(state: any) {
    if (!this.undoRedo) return
    this.undoRedo.instantiation.push(state)
    this.eventbus.emit('undoRedoStackChange')
  }

  private getJson() {
    return this.canvas.toObject()
  }

  private async loadJson(json: string) {
    if (!this.undoRedo) return
    const { instantiation } = this.undoRedo

    try {
      instantiation.pause()
      await this.canvas.loadFromJSON(json)
    } finally {
      this.canvas.renderAll()
      instantiation.resume()
    }
  }

  public redo() {
    if (!this.undoRedo) return
    if (!this.undoRedo.instantiation.canRedo) return
    this.undoRedo.lastState = this.undoRedo.instantiation.redo(this.undoRedo.lastState)
    if (this.undoRedo.lastState) {
      this.loadJson(this.undoRedo.lastState).finally(() => {
        this.canvas.calculateCurrentObjects()
        this.eventbus.emit('undoRedoStackChange')
      })
    }
    return this.undoRedo.lastState
  }

  public undo() {
    if (!this.undoRedo) return
    if (!this.undoRedo.instantiation.canUndo) return
    this.undoRedo.lastState = this.undoRedo.instantiation.undo(this.undoRedo.lastState)
    if (this.undoRedo.lastState) {
      this.loadJson(this.undoRedo.lastState).finally(() => {
        this.canvas.calculateCurrentObjects()
        this.eventbus.emit('undoRedoStackChange')
      })
    }
    return this.undoRedo.lastState
  }

  // 废弃 selectable evented 输出至json了，这里不再需要进行特殊处理
  private handleBgImage() {
    this.canvas.getObjects().forEach((item: any) => {
      if (item.bgt && item.bgt.startsWith('bg')) {
        item.set('selectable', false)
        item.set('evented', false)
      }
    })
  }

  public async reset() {
    if (!this.undoRedo) return
    const { instantiation } = this.undoRedo
    try {
      instantiation.pause()
      // 记录当前最新的state
      let ls = this.undoRedo.lastState
      // 重置, undo中自动加入原链表第一个，并返回链表第二个，要么是undefined 要么是背景
      const second = this.undoRedo.instantiation.reset()
      // 如果是undefined，那此时最新的state（即ls）一定是背景
      if (second !== undefined) {
        // 如果不是undefined, 那一定是背景
        ls = second
      }
      if (ls) {
        // 将背景加载到canvas中，并设置成最新的state
        this.undoRedo.lastState = ls
        await this.canvas.loadFromJSON(ls)
      }
    } finally {
      this.canvas.renderAll()
      instantiation.resume()
      this.canvas.calculateCurrentObjects()
      this.eventbus.emit('undoRedoStackChange')
    }
  }

  private initWorkspace() {
    this.undoRedo = {
      instantiation: new UndoRedoBase(),
      lastState: this.getJson(),
    }
    this.eventbus.on('recordToUndoRedo', () => {
      // 接收记录undo redo的消息，进行记录
      this.saveState()
    })
    this.eventbus.on('reloadWorkspaceUndoRedo', () => {
      // workspace重置了，新的undo redo，自动加入第一个空元素（第一个空元素无关紧要，是个占位符）
      const newUndoRedo = new UndoRedoBase()
      newUndoRedo.push('')
      this.undoRedo = {
        instantiation: newUndoRedo,
        lastState: this.getJson(),
      }
    })
  }

  public dispose(): void {
    super.dispose()
    // 解绑事件绑定
    this.canvas.off(this.canvasEvents)
  }
}
