import { createSvgTag, SvgNs } from '../../../utils/svg'
import {
  RectangleOutlineBtnCls,
  RectangleOutlineBtnIconSvgCls,
  RectangleOutlineBtnTextCls,
} from '../../../clazz/buttons/subToolPanel/RectangleOutline'

export const RectangleOutline = () => {
  const rectangleOutlineBtn = document.createElement('button')
  rectangleOutlineBtn.classList.add(...RectangleOutlineBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...RectangleOutlineBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M4 6v13h16V6zm14 11H6V8h12z',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...RectangleOutlineBtnTextCls)
  text.innerText = 'Rectangle Outline'
  rectangleOutlineBtn.appendChild(iconSvg)
  rectangleOutlineBtn.appendChild(text)
  return rectangleOutlineBtn
}
