import { createSvgTag, SvgNs } from '../../../utils/svg'
import { ZoomWidthBtnCls, ZoomWidthBtnIconSvgCls } from '../../../clazz/buttons/topPanel/ZoomWidth'

export const ZoomWidth = (): HTMLButtonElement => {
  const zoomWidthBtn = document.createElement('button')
  zoomWidthBtn.classList.add(...ZoomWidthBtnCls)
  const zoomWidthIconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  zoomWidthIconSvg.classList.add(...ZoomWidthBtnIconSvgCls)
  const zoomWidthIconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M9 11h6V8l4 4l-4 4v-3H9v3l-4-4l4-4zm-7 9V4h2v16zm18 0V4h2v16z',
  })
  zoomWidthIconSvg.appendChild(zoomWidthIconSvgPath1)
  zoomWidthBtn.appendChild(zoomWidthIconSvg)
  return zoomWidthBtn
}
