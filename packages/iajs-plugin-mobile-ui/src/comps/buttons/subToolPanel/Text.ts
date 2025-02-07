import { createSvgTag, SvgNs } from '../../../utils/svg'
import { TextBtnCls, TextBtnIconSvgCls, TextBtnTextCls } from '../../../clazz/buttons/subToolPanel/Text'

export const Text = () => {
  const textBtn = document.createElement('button')
  textBtn.classList.add(...TextBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...TextBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M9.6 14L12 7.7l2.4 6.3M11 5L5.5 19h2.2l1.1-3H15l1.1 3h2.2L13 5z',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...TextBtnTextCls)
  text.innerText = 'Text'
  textBtn.appendChild(iconSvg)
  textBtn.appendChild(text)
  return textBtn
}
