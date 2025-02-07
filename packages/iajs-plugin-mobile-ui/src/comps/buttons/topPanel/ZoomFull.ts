import { createSvgTag, SvgNs } from '../../../utils/svg'
import { ZoomFullBtnCls, ZoomFullBtnIconSvgCls } from '../../../clazz/buttons/topPanel/ZoomFull'

export const ZoomFull = () => {
  const zoomFullBtn = document.createElement('button')
  zoomFullBtn.classList.add(...ZoomFullBtnCls)
  const zoomFullIconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  zoomFullIconSvg.classList.add(...ZoomFullBtnIconSvgCls)
  const zoomFullIconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'm9.5 13.09l1.41 1.41l-4.5 4.5H10v2H3v-7h2v3.59zm1.41-3.59L9.5 10.91L5 6.41V10H3V3h7v2H6.41zm3.59 3.59l4.5 4.5V14h2v7h-7v-2h3.59l-4.5-4.5zM13.09 9.5l4.5-4.5H14V3h7v7h-2V6.41l-4.5 4.5z',
  })
  zoomFullIconSvg.appendChild(zoomFullIconSvgPath1)
  zoomFullBtn.appendChild(zoomFullIconSvg)
  return zoomFullBtn
}
