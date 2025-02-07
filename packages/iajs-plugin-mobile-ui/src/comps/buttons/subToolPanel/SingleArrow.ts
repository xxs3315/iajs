import { createSvgTag, SvgNs } from '../../../utils/svg'
import {
  SingleArrowBtnCls,
  SingleArrowBtnIconSvgCls,
  SingleArrowBtnTextCls,
} from '../../../clazz/buttons/subToolPanel/SingleArrow'

export const SingleArrow = () => {
  const singleArrowBtn = document.createElement('button')
  singleArrowBtn.classList.add(...SingleArrowBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...SingleArrowBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M19 17.59L17.59 19L7 8.41V15H5V5h10v2H8.41z',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...SingleArrowBtnTextCls)
  text.innerText = 'Arrow'
  singleArrowBtn.appendChild(iconSvg)
  singleArrowBtn.appendChild(text)
  return singleArrowBtn
}
