import { createSvgTag, SvgNs } from '../../../utils/svg'
import { FreeDrawBtnCls, FreeDrawBtnIconSvgCls, FreeDrawBtnTextCls } from '../../../clazz/buttons/subToolPanel/FreeDraw'

export const FreeDraw = () => {
  const freeDrawBtn = document.createElement('button')
  freeDrawBtn.classList.add(...FreeDrawBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...FreeDrawBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'M9.75 20.85c1.78-.7 1.39-2.63.49-3.85c-.89-1.25-2.12-2.11-3.36-2.94A9.8 9.8 0 0 1 4.54 12c-.28-.33-.85-.94-.27-1.06c.59-.12 1.61.46 2.13.68c.91.38 1.81.82 2.65 1.34l1.01-1.7C8.5 10.23 6.5 9.32 4.64 9.05c-1.06-.16-2.18.06-2.54 1.21c-.32.99.19 1.99.77 2.77c1.37 1.83 3.5 2.71 5.09 4.29c.34.33.75.72.95 1.18c.21.44.16.47-.31.47c-1.24 0-2.79-.97-3.8-1.61l-1.01 1.7c1.53.94 4.09 2.41 5.96 1.79m11.09-15.6c.22-.22.22-.58 0-.79l-1.3-1.3a.56.56 0 0 0-.78 0l-1.02 1.02l2.08 2.08M11 10.92V13h2.08l6.15-6.15l-2.08-2.08z',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...FreeDrawBtnTextCls)
  text.innerText = 'FreeDraw'
  freeDrawBtn.appendChild(iconSvg)
  freeDrawBtn.appendChild(text)
  return freeDrawBtn
}
