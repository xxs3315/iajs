import { createSvgTag, SvgNs } from '../../../utils/svg'
import {
  EllipseHighlightBtnCls,
  EllipseHighlightBtnIconSvgCls,
  EllipseHighlightBtnTextCls,
} from '../../../clazz/buttons/subToolPanel/EllipseHighlight'

export const EllipseHighlight = () => {
  const ellipseHighlightBtn = document.createElement('button')
  ellipseHighlightBtn.classList.add(...EllipseHighlightBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...EllipseHighlightBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M13 19v-3h-2v3zm6.09-2.5l1.41-1.41l-1.77-1.77l-1.41 1.41zm-14.18 0l1.77-1.77l-1.41-1.41l-1.77 1.77zM20 12c0-2.86-1.5-5.5-4-6.93s-5.5-1.43-8 0S4 9.14 4 12z',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...EllipseHighlightBtnTextCls)
  text.innerText = 'Ellipse Highlight'
  ellipseHighlightBtn.appendChild(iconSvg)
  ellipseHighlightBtn.appendChild(text)
  return ellipseHighlightBtn
}
