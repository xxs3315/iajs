import { createSvgTag, SvgNs } from '../../../utils/svg'
import { LineBtnCls, LineBtnIconSvgCls, LineBtnTextCls } from '../../../clazz/buttons/subToolPanel/Line'

export const Line = () => {
  const lineBtn = document.createElement('button')
  lineBtn.classList.add(...LineBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...LineBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M19 13H5v-2h14z',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...LineBtnTextCls)
  text.innerText = 'Line'
  lineBtn.appendChild(iconSvg)
  lineBtn.appendChild(text)
  return lineBtn
}
