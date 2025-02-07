import { SubToolPanelCls } from '../../clazz/panels/SubToolPanel'

export const SubToolPanel = () => {
  const subToolPanel = document.createElement('div')
  subToolPanel.classList.add(...SubToolPanelCls)
  return subToolPanel
}
