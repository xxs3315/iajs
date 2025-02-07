import { createSvgTag, SvgNs } from '../../../utils/svg'
import { EllipseBtnCls, EllipseBtnIconSvgCls, EllipseBtnTextCls } from '../../../clazz/buttons/subToolPanel/Ellipse'

export const Ellipse = () => {
  const ellipseBtn = document.createElement('button')
  ellipseBtn.classList.add(...EllipseBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...EllipseBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M12 4C6.5 4 2 7.58 2 12s4.5 8 10 8s10-3.58 10-8s-4.5-8-10-8',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...EllipseBtnTextCls)
  text.innerText = 'Ellipse'
  ellipseBtn.appendChild(iconSvg)
  ellipseBtn.appendChild(text)
  return ellipseBtn
}
