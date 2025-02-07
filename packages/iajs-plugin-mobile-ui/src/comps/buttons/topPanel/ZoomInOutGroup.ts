import { createSvgTag, SvgNs } from '../../../utils/svg'
import {
  ZoomInBtnCls,
  ZoomInBtnIconSvgCls,
  ZoomInOutGroupCls,
  ZoomOutBtnCls,
  ZoomOutBtnIconSvgCls,
} from '@xxs3315/clazz/buttons/topPanel/ZoomInOutGroup'

export const ZoomInOutGroup = (): {
  group: HTMLDivElement
  zoomInBtn: HTMLButtonElement
  zoomOutBtn: HTMLButtonElement
} => {
  const group = document.createElement('div')
  group.classList.add(...ZoomInOutGroupCls)
  const zoomInBtn = document.createElement('button')
  zoomInBtn.classList.add(...ZoomInBtnCls)
  const zoomOutBtn = document.createElement('button')
  zoomOutBtn.classList.add(...ZoomOutBtnCls)
  const zoomInBtnSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  zoomInBtnSvg.classList.add(...ZoomInBtnIconSvgCls)
  const zoomOutBtnSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  zoomOutBtnSvg.classList.add(...ZoomOutBtnIconSvgCls)
  const zoomOutBtnSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 0 0 9.5 3A6.5 6.5 0 0 0 3 9.5A6.5 6.5 0 0 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5l1.5-1.5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5S14 7 14 9.5S12 14 9.5 14M7 9h5v1H7z',
  })
  const zoomInBtnSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'm15.5 14l5 5l-1.5 1.5l-5-5v-.79l-.27-.28A6.47 6.47 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.57 4.23l.28.27zm-6 0C12 14 14 12 14 9.5S12 5 9.5 5S5 7 5 9.5S7 14 9.5 14m2.5-4h-2v2H9v-2H7V9h2V7h1v2h2z',
  })
  zoomInBtnSvg.appendChild(zoomInBtnSvgPath1)
  zoomOutBtnSvg.appendChild(zoomOutBtnSvgPath1)
  zoomInBtn.appendChild(zoomInBtnSvg)
  zoomOutBtn.appendChild(zoomOutBtnSvg)

  group.appendChild(zoomOutBtn)
  group.appendChild(zoomInBtn)

  return { group, zoomInBtn, zoomOutBtn }
}
