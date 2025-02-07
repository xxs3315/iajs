import {
  createWorkspacePlugin,
  IMainCanvas,
  WorkspacePlugin,
  IWorkspaceService,
  ImageAnnotationWorkspace,
} from '@xxs3315/iajs'

// 辅助函数: 实现Mixin应用
function applyMixins(derivedCtor: any, invokeMethodName: string, invokeMethod: any): void {
  derivedCtor.prototype[invokeMethodName] = invokeMethod
}

export const invokeMethodName = 'invokeCrop'

const cropPlugin: WorkspacePlugin = createWorkspacePlugin((workspace) => {
  const [canvas, workspaceService] = workspace.service.invokeFunction((accessor) => {
    return [accessor.get(IMainCanvas), accessor.get(IWorkspaceService)]
  })

  const invokeCrop = () => {
    console.log('invoke crop in plugin')
  }

  return {
    setup() {
      console.log('[plugin crop setup]')
      applyMixins(ImageAnnotationWorkspace, invokeMethodName, invokeCrop)
    },
    dispose() {
      console.log('[plugin crop dispose]')
    },
  }
})

export default cropPlugin
