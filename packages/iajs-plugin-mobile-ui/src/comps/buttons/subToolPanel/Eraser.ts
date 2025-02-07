import { createSvgTag, SvgNs } from '../../../utils/svg'
import { EraserBtnCls, EraserBtnIconSvgCls, EraserBtnTextCls } from '../../../clazz/buttons/subToolPanel/Eraser'

export const Eraser = () => {
  const eraserBtn = document.createElement('button')
  eraserBtn.classList.add(...EraserBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...EraserBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'm16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.01 4.01 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0M4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53l-4.95-4.95z',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...EraserBtnTextCls)
  text.innerText = 'Eraser'
  eraserBtn.appendChild(iconSvg)
  eraserBtn.appendChild(text)
  return eraserBtn
}
