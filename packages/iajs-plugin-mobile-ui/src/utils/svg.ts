export const SvgNs = 'http://www.w3.org/2000/svg'
export const createSvgTag = (svgTag: string, objAttrs: any) => {
  const oTag = document.createElementNS(SvgNs, svgTag)
  for (const attr in objAttrs) {
    oTag.setAttribute(attr, objAttrs[attr])
  }
  return oTag
}
