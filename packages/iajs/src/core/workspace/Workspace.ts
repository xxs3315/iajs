import { BaseWorkspace } from './BaseWorkspace'
import { IWorkspacePluginContext, WorkspacePlugin } from '../type'
import { IInstantiationService, ServiceIdentifier } from '../instantiation/instantiation/instantiation'
import { ServiceCollection, toDisposable } from '../instantiation'
import { SyncDescriptor } from '../instantiation'
import { IWorkspaceUndoRedoService, WorkspaceUndoRedoService } from './undoRedo/WorkspaceUndoRedoService'
import { EventbusService, IEventbusService } from '../service/eventbus/EventbusService'
import { IWorkspaceService, WorkspaceService } from '../service/workspace/WorkspaceService'
import { IMainCanvas, MainCanvas } from '../canvas/MainCanvas'
import { MouseWheelScroll } from '../canvas/MouseWheelScroll'
import { GuideLines } from '../canvas/GuideLines'
import { ObjectHoverBorder } from '../canvas/ObjectHoverBorder'
import { FabricTools } from '../canvas/FabricTools'
import { runWhenIdle } from '../../core/instantiation/base'

export class Workspace extends BaseWorkspace {
  public service!: IInstantiationService

  private readonly pluginInstanceMap = new Map<Symbol, IWorkspacePluginContext>()

  constructor(@IInstantiationService private readonly instantiationService: IInstantiationService) {
    super()
  }

  startup(): void {
    this.service = this.initServices()
    this.service.invokeFunction((accessor) => {
      const workspaceService = accessor.get(IWorkspaceService)
      workspaceService.setId(workspaceService.init('Workspace'))
    })
    const instances = [
      this.service.createInstance(FabricTools as any),
      this.service.createInstance(MouseWheelScroll as any),
      this.service.createInstance(GuideLines as any),
      this.service.createInstance(ObjectHoverBorder as any),
    ]
    instances.forEach((instance) => {
      this._register(instance)
    })
  }

  use(plugin: WorkspacePlugin) {
    const instance = plugin({
      service: this.service,
    }) as IWorkspacePluginContext
    instance._id = Symbol()
    this.pluginInstanceMap.set(instance._id, instance)
    runWhenIdle(() => {
      instance.setup?.()
      this._register(
        toDisposable(() => {
          instance.dispose?.()
          this.pluginInstanceMap.delete(instance._id)
        }),
      )
    })
  }

  private initServices() {
    const services = new ServiceCollection()

    const define = <T>(id: ServiceIdentifier<T>, ctor: new (...args: any[]) => T) => {
      if (!services.has(id)) {
        services.set(id, new SyncDescriptor(ctor))
      }
    }

    define(IEventbusService, EventbusService)
    define(IWorkspaceService, WorkspaceService)
    define(IWorkspaceUndoRedoService, WorkspaceUndoRedoService)
    define(IMainCanvas, MainCanvas)

    return this.instantiationService.createChild(services)
  }

  public dispose() {
    try {
      super.dispose()
      if (this.service) {
        this.service.invokeFunction((accessor) => {
          accessor.get(IWorkspaceUndoRedoService).reset()
          accessor.get(IMainCanvas).dispose()
          accessor.get(IWorkspaceService).dispose()
          accessor.get(IEventbusService).all.clear()
        })
        this.service = undefined!
      }
    } catch (_e) {
      console.error(_e)
    }
  }
}
