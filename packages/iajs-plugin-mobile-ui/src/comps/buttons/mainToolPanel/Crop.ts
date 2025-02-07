import { createSvgTag, SvgNs } from '../../../utils/svg'
import { CropBtnCls, CropBtnIconSvgCls, CropBtnTextCls } from '../../../clazz/buttons/mainToolPanel/Crop'

export const Crop = (): HTMLButtonElement => {
  const cropBtn = document.createElement('button')
  cropBtn.classList.add(...CropBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...CropBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M7 17V1H5v4H1v2h4v10a2 2 0 0 0 2 2h10v4h2v-4h4v-2m-6-2h2V7a2 2 0 0 0-2-2H9v2h8z',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...CropBtnTextCls)
  text.innerText = 'Crop'
  cropBtn.appendChild(iconSvg)
  cropBtn.appendChild(text)
  return cropBtn
}
