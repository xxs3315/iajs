import { createSvgTag, SvgNs } from '../../../utils/svg'
import {
  EllipseOutlineBtnCls,
  EllipseOutlineBtnIconSvgCls,
  EllipseOutlineBtnTextCls,
} from '../../../clazz/buttons/subToolPanel/EllipseOutline'

export const EllipseOutline = () => {
  const ellipseOutlineBtn = document.createElement('button')
  ellipseOutlineBtn.classList.add(...EllipseOutlineBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...EllipseOutlineBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M12 6c4.41 0 8 2.69 8 6s-3.59 6-8 6s-8-2.69-8-6s3.59-6 8-6m0-2C6.5 4 2 7.58 2 12s4.5 8 10 8s10-3.58 10-8s-4.5-8-10-8',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...EllipseOutlineBtnTextCls)
  text.innerText = 'Ellipse Outline'
  ellipseOutlineBtn.appendChild(iconSvg)
  ellipseOutlineBtn.appendChild(text)
  return ellipseOutlineBtn
}
