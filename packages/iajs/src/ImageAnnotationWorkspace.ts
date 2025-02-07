import { ImageAnnotation } from './ImageAnnotation'

export { ImageAnnotation, ImageAnnotationEventData } from './ImageAnnotation'
export { createWorkspacePlugin } from './core/plugin/createWorkspacePlugin'
export { IMainCanvas } from './core/canvas/MainCanvas'
export { IWorkspaceService } from './core/service/workspace/WorkspaceService'
export { IWorkspaceUndoRedoService } from './core/workspace/undoRedo/WorkspaceUndoRedoService'
export { WorkspacePlugin } from './core/type'

if (window && window.customElements && window.customElements.get('iajs-workspace') === undefined) {
  window.customElements.define('iajs-workspace', ImageAnnotation)
}
