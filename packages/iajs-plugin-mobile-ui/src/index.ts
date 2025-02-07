import {
  createWorkspacePlugin,
  IMainCanvas,
  WorkspacePlugin,
  IWorkspaceService,
  IWorkspaceUndoRedoService,
} from '@xxs3315/iajs'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import style from './style/index.css?inline'
import { TopPanel } from './comps/panels/TopPanel'
import { ResetRedoUndo } from './comps/buttons/topPanel/ResetRedoUndo'
import { MainToolPanel } from './comps/panels/MainToolPanel'
import { Crop } from './comps/buttons/mainToolPanel/Crop'
import { SubToolPanel } from './comps/panels/SubToolPanel'
import { createStyleTag } from './utils/style'
import { MainToolPanelContainer } from './comps/panels/MainToolPanelContainer'
import { RedoUndoGroup } from './comps/buttons/topPanel/RedoUndoGroup'
import { ZoomInOutGroup } from './comps/buttons/topPanel/ZoomInOutGroup'
import { ZoomFull } from './comps/buttons/topPanel/ZoomFull'
import { ZoomWidth } from './comps/buttons/topPanel/ZoomWidth'
import { ZoomHeight } from './comps/buttons/topPanel/ZoomHeight'
import { SubToolPanelContainer } from './comps/panels/SubToolPanelContainer'
import { Select } from './comps/buttons/subToolPanel/Select'
import { Annotation } from './comps/buttons/mainToolPanel/Annotation'
import { Eraser } from './comps/buttons/subToolPanel/Eraser'
import { FreeDraw } from './comps/buttons/subToolPanel/FreeDraw'
import { SingleArrow } from './comps/buttons/subToolPanel/SingleArrow'
import { Line } from './comps/buttons/subToolPanel/Line'
import { DoubleArrow } from './comps/buttons/subToolPanel/DoubleArrow'
import { RectangleOutline } from './comps/buttons/subToolPanel/RectangleOutline'
import { Rectangle } from './comps/buttons/subToolPanel/Rectangle'
import { EllipseOutline } from './comps/buttons/subToolPanel/EllipseOutline'
import { Ellipse } from './comps/buttons/subToolPanel/Ellipse'
import { RectangleHighlight } from './comps/buttons/subToolPanel/RectangleHighlight'
import { EllipseHighlight } from './comps/buttons/subToolPanel/EllipseHighlight'
import { Text } from './comps/buttons/subToolPanel/Text'

const mobileUIPlugin: WorkspacePlugin = createWorkspacePlugin((workspace) => {
  const [canvas, workspaceService, undoRedoService] = workspace.service.invokeFunction((accessor) => {
    return [accessor.get(IMainCanvas), accessor.get(IWorkspaceService), accessor.get(IWorkspaceUndoRedoService)]
  })

  const styleTag = createStyleTag()
  styleTag.innerHTML = style

  const topPanel = TopPanel()
  const mainToolPanel = MainToolPanel()
  const mainToolPanelContainer = MainToolPanelContainer()
  const subToolPanel = SubToolPanel()
  const subToolPanelContainer = SubToolPanelContainer()

  const initTopPanel = () => {
    const resetRedoUndoBtn = ResetRedoUndo()
    resetRedoUndoBtn.addEventListener('click', () => undoRedoService.reset())
    topPanel?.appendChild(resetRedoUndoBtn)
    const { group: redoUndoGroup, undoBtn, redoBtn } = RedoUndoGroup()
    undoBtn.addEventListener('click', () => undoRedoService.undo())
    redoBtn.addEventListener('click', () => undoRedoService.redo())
    topPanel?.appendChild(redoUndoGroup)
    const zoomWidthBtn = ZoomWidth()
    zoomWidthBtn.addEventListener('click', () => canvas.zoomWidth())
    topPanel?.appendChild(zoomWidthBtn)
    const zoomHeightBtn = ZoomHeight()
    zoomHeightBtn.addEventListener('click', () => canvas.zoomHeight())
    topPanel?.appendChild(zoomHeightBtn)
    const zoomFullBtn = ZoomFull()
    zoomFullBtn.addEventListener('click', () => canvas.zoomFull())
    topPanel?.appendChild(zoomFullBtn)
    const { group: zoomInOutGroup, zoomInBtn, zoomOutBtn } = ZoomInOutGroup()
    zoomInBtn.addEventListener('click', () => canvas.zoomIn())
    zoomOutBtn.addEventListener('click', () => canvas.zoomOut())
    topPanel?.appendChild(zoomInOutGroup)
  }

  const initMainToolPanel = () => {
    const annotationBtn = Annotation()
    mainToolPanelContainer?.appendChild(annotationBtn)
    const cropBtn = Crop()
    mainToolPanelContainer?.appendChild(cropBtn)

    mainToolPanel.appendChild(mainToolPanelContainer)
  }

  const initSubToolPanel = () => {
    const selectBtn = Select()
    selectBtn.addEventListener('click', () => canvas.setCurrentMode('select'))
    subToolPanelContainer?.appendChild(selectBtn)
    const eraserBtn = Eraser()
    eraserBtn.addEventListener('click', () => canvas.deleteAnnotations())
    subToolPanelContainer?.appendChild(eraserBtn)
    const freeDrawBtn = FreeDraw()
    freeDrawBtn.addEventListener('click', () => canvas.setCurrentMode('manipulate', 'free-draw'))
    subToolPanelContainer?.appendChild(freeDrawBtn)
    const textBtn = Text()
    textBtn.addEventListener('click', () => canvas.setCurrentMode('manipulate', 'text'))
    subToolPanelContainer?.appendChild(textBtn)
    const lineBtn = Line()
    lineBtn.addEventListener('click', () => canvas.setCurrentMode('manipulate', 'line'))
    subToolPanelContainer?.appendChild(lineBtn)
    const singleArrowBtn = SingleArrow()
    singleArrowBtn.addEventListener('click', () => canvas.setCurrentMode('manipulate', 'single-arrow'))
    subToolPanelContainer?.appendChild(singleArrowBtn)
    const doubleArrowBtn = DoubleArrow()
    doubleArrowBtn.addEventListener('click', () => canvas.setCurrentMode('manipulate', 'double-arrow'))
    subToolPanelContainer?.appendChild(doubleArrowBtn)

    const rectangleOutlineBtn = RectangleOutline()
    rectangleOutlineBtn.addEventListener('click', () => canvas.setCurrentMode('manipulate', 'rectangle-outline'))
    subToolPanelContainer?.appendChild(rectangleOutlineBtn)
    const rectangleBtn = Rectangle()
    rectangleBtn.addEventListener('click', () => canvas.setCurrentMode('manipulate', 'rectangle'))
    subToolPanelContainer?.appendChild(rectangleBtn)
    const rectangleHighlightBtn = RectangleHighlight()
    rectangleHighlightBtn.addEventListener('click', () => canvas.setCurrentMode('manipulate', 'rectangle-highlight'))
    subToolPanelContainer?.appendChild(rectangleHighlightBtn)

    const ellipseOutlineBtn = EllipseOutline()
    ellipseOutlineBtn.addEventListener('click', () => canvas.setCurrentMode('manipulate', 'ellipse-outline'))
    subToolPanelContainer?.appendChild(ellipseOutlineBtn)
    const ellipseBtn = Ellipse()
    ellipseBtn.addEventListener('click', () => canvas.setCurrentMode('manipulate', 'ellipse'))
    subToolPanelContainer?.appendChild(ellipseBtn)
    const ellipseHighlightBtn = EllipseHighlight()
    ellipseHighlightBtn.addEventListener('click', () => canvas.setCurrentMode('manipulate', 'ellipse-highlight'))
    subToolPanelContainer?.appendChild(ellipseHighlightBtn)

    subToolPanel.appendChild(subToolPanelContainer)
  }

  return {
    setup() {
      console.log('[plugin mobile ui setup]')
      workspaceService.getMainContainerEl()?.parentNode?.appendChild(styleTag)
      // panels
      workspaceService.getMainContainerEl()?.parentNode?.appendChild(topPanel)
      initTopPanel()
      workspaceService.getMainContainerEl()?.parentNode?.appendChild(mainToolPanel)
      initMainToolPanel()
      workspaceService.getMainContainerEl()?.parentNode?.appendChild(subToolPanel)
      initSubToolPanel()
    },
    dispose() {
      console.log('[plugin mobile ui setup]')
    },
  }
})

export default mobileUIPlugin
