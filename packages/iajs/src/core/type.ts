import { Workspace } from './workspace/Workspace'
import { IInstantiationService } from './instantiation/instantiation/instantiation'

export interface WorkspacePluginContext {
  setup?: () => void
  dispose?: () => void
}

export interface IWorkspacePluginContext extends WorkspacePluginContext {
  _id: symbol
}

export type WorkspacePlugin = (workspace: Pick<Workspace, 'service'>) => WorkspacePluginContext

export interface ICore {
  service: IInstantiationService
  use: (plugin: WorkspacePlugin) => ICore
}
