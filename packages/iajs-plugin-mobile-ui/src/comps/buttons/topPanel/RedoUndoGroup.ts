import { createSvgTag, SvgNs } from '../../../utils/svg'
import {
  RedoBtnCls,
  RedoBtnIconSvgCls,
  RedoUndoGroupCls,
  UndoBtnCls,
  UndoBtnIconSvgCls,
} from '@xxs3315/clazz/buttons/topPanel/RedoUndoGroup'

export const RedoUndoGroup = (): {
  group: HTMLDivElement
  undoBtn: HTMLButtonElement
  redoBtn: HTMLButtonElement
} => {
  const group = document.createElement('div')
  group.classList.add(...RedoUndoGroupCls)
  const redoBtn = document.createElement('button')
  redoBtn.classList.add(...RedoBtnCls)
  const undoBtn = document.createElement('button')
  undoBtn.classList.add(...UndoBtnCls)
  const redoIconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  redoIconSvg.classList.add(...RedoBtnIconSvgCls)
  const undoIconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  undoIconSvg.classList.add(...UndoBtnIconSvgCls)
  const undoIconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M12.5 8c-2.65 0-5.05 1-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88c3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8',
  })
  const redoIconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M18.4 10.6C16.55 9 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16a8 8 0 0 1 7.6-5.5c1.95 0 3.73.72 5.12 1.88L13 16h9V7z',
  })
  redoIconSvg.appendChild(redoIconSvgPath1)
  undoIconSvg.appendChild(undoIconSvgPath1)
  redoBtn.appendChild(redoIconSvg)
  undoBtn.appendChild(undoIconSvg)

  group.appendChild(undoBtn)
  group.appendChild(redoBtn)

  return { group, undoBtn, redoBtn }
}
