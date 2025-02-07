import { createSvgTag, SvgNs } from '../../../utils/svg'
import { ZoomHeightBtnCls, ZoomHeightBtnIconSvgCls } from '../../../clazz/buttons/topPanel/ZoomHeight'

export const ZoomHeight = (): HTMLButtonElement => {
  const zoomHeightBtn = document.createElement('button')
  zoomHeightBtn.classList.add(...ZoomHeightBtnCls)
  const zoomHeightIconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  zoomHeightIconSvg.classList.add(...ZoomHeightBtnIconSvgCls)
  const zoomHeightIconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M13 9v6h3l-4 4l-4-4h3V9H8l4-4l4 4zM4 2h16v2H4zm0 18h16v2H4z',
  })
  zoomHeightIconSvg.appendChild(zoomHeightIconSvgPath1)
  zoomHeightBtn.appendChild(zoomHeightIconSvg)

  return zoomHeightBtn
}
