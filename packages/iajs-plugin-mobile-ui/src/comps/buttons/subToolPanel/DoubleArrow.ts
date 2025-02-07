import { createSvgTag, SvgNs } from '../../../utils/svg'
import {
  DoubleArrowBtnCls,
  DoubleArrowBtnIconSvgCls,
  DoubleArrowBtnTextCls,
} from '../../../clazz/buttons/subToolPanel/DoubleArrow'

export const DoubleArrow = () => {
  const doubleArrowBtn = document.createElement('button')
  doubleArrowBtn.classList.add(...DoubleArrowBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...DoubleArrowBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M13 21h8v-8h-2v4.59L6.41 5H11V3H3v8h2V6.41L17.59 19H13z',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...DoubleArrowBtnTextCls)
  text.innerText = '2Way Arrow'
  doubleArrowBtn.appendChild(iconSvg)
  doubleArrowBtn.appendChild(text)
  return doubleArrowBtn
}
