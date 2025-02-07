import { createSvgTag, SvgNs } from '../../../utils/svg'
import { SelectBtnCls, SelectBtnIconSvgCls, SelectBtnTextCls } from '../../../clazz/buttons/subToolPanel/Select'

export const Select = () => {
  const selectBtn = document.createElement('button')
  selectBtn.classList.add(...SelectBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...SelectBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M13 17h4v-4h2v4h4v2h-4v4h-2v-4h-4zm-2 0v2H9v-2zm-4 0v2H5v-2zm12-8v2h-2V9zm0-4v2h-2V5zm-4 0v2h-2V5zm-4 0v2H9V5zM7 5v2H5V5zm0 8v2H5v-2zm0-4v2H5V9z',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...SelectBtnTextCls)
  text.innerText = 'Select'
  selectBtn.appendChild(iconSvg)
  selectBtn.appendChild(text)
  return selectBtn
}
