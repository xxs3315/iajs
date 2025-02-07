import { Workspace } from './Workspace'
import { IEventbusService } from '../service/eventbus/EventbusService'
import { IWorkspaceUndoRedoService } from './undoRedo/WorkspaceUndoRedoService'
import { IWorkspaceService } from '../service/workspace/WorkspaceService'
import { IMainCanvas } from '../canvas/MainCanvas'

export interface ICoreWorkspace {
  workspace: Workspace | undefined
}

export const workspaceInstance: ICoreWorkspace = {
  workspace: undefined,
}

export const useWorkspace = () => {
  if (!workspaceInstance.workspace) {
    console.warn('workspace is not ready')
    return undefined
  }
  return workspaceInstance.workspace.service.invokeFunction((accessor) => {
    return {
      canvas: accessor.get(IMainCanvas),
      undoRedoService: accessor.get(IWorkspaceUndoRedoService),
      eventbusService: accessor.get(IEventbusService),
      workspaceService: accessor.get(IWorkspaceService),
    }
  })
}
