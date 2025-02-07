import { createSvgTag, SvgNs } from '../../../utils/svg'
import {
  AnnotationBtnCls,
  AnnotationBtnIconSvgCls,
  AnnotationBtnTextCls,
} from '../../../clazz/buttons/mainToolPanel/Annotation'

export const Annotation = (): HTMLButtonElement => {
  const annotationBtn = document.createElement('button')
  annotationBtn.classList.add(...AnnotationBtnCls)
  const iconSvg = createSvgTag('svg', {
    xmlns: SvgNs,
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  iconSvg.classList.add(...AnnotationBtnIconSvgCls)
  const iconSvgPath1 = createSvgTag('path', {
    fill: 'inherit',
    d: 'm14.06 9l.94.94L5.92 19H5v-.92zm3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z',
  })
  iconSvg.append(iconSvgPath1)
  const text = document.createElement('div')
  text.classList.add(...AnnotationBtnTextCls)
  text.innerText = 'Annotation'
  annotationBtn.appendChild(iconSvg)
  annotationBtn.appendChild(text)
  return annotationBtn
}
