import { createSvgTag, SvgNs } from '../../../utils/svg'
import { ResetRedoUndoBtnCls, ResetRedoUndoBtnIconSvgCls } from '../../../clazz/buttons/topPanel/ResetRedoUndo'

export const ResetRedoUndo = (): HTMLButtonElement => {
  const resetRedoUndoBtn = document.createElement('button')
  resetRedoUndoBtn.classList.add(...ResetRedoUndoBtnCls)
  const resetRedoUndoIconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  resetRedoUndoIconSvg.classList.add(...ResetRedoUndoBtnIconSvgCls)
  const resetRedoUndoIconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M13.5 8H12v5l4.28 2.54l.72-1.21l-3.5-2.08zM13 3a9 9 0 0 0-9 9H1l3.96 4.03L9 12H6a7 7 0 0 1 7-7a7 7 0 0 1 7 7a7 7 0 0 1-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.9 8.9 0 0 0 13 21a9 9 0 0 0 9-9a9 9 0 0 0-9-9',
  })
  resetRedoUndoIconSvg.appendChild(resetRedoUndoIconSvgPath1)
  resetRedoUndoBtn.appendChild(resetRedoUndoIconSvg)
  return resetRedoUndoBtn
}
