import { createSvgTag, SvgNs } from '../../../utils/svg'
import {
  RectangleHighlightBtnCls,
  RectangleHighlightBtnIconSvgCls,
  RectangleHighlightBtnTextCls,
} from '../../../clazz/buttons/subToolPanel/RectangleHighlight'

export const RectangleHighlight = () => {
  const rectangleHighlightBtn = document.createElement('button')
  rectangleHighlightBtn.classList.add(...RectangleHighlightBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...RectangleHighlightBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M5 5v6h14V5zm.27 8.32L3.5 15.09l1.41 1.41l1.77-1.77zm13.46 0l-1.41 1.41l1.77 1.77l1.41-1.41zM11 16v3h2v-3z',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...RectangleHighlightBtnTextCls)
  text.innerText = 'Rectangle Highlight'
  rectangleHighlightBtn.appendChild(iconSvg)
  rectangleHighlightBtn.appendChild(text)
  return rectangleHighlightBtn
}
