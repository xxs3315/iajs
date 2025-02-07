import { createSvgTag, SvgNs } from '../../../utils/svg'
import {
  RectangleBtnCls,
  RectangleBtnIconSvgCls,
  RectangleBtnTextCls,
} from '../../../clazz/buttons/subToolPanel/Rectangle'

export const Rectangle = () => {
  const rectangleBtn = document.createElement('button')
  rectangleBtn.classList.add(...RectangleBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...RectangleBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M4 6v13h16V6z',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...RectangleBtnTextCls)
  text.innerText = 'Rectangle'
  rectangleBtn.appendChild(iconSvg)
  rectangleBtn.appendChild(text)
  return rectangleBtn
}
