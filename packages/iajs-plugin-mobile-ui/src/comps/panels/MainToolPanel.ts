import { MainToolPanelCls } from '../../clazz/panels/MainToolPanel'

export const MainToolPanel = () => {
  const mainToolPanel = document.createElement('div')
  mainToolPanel.classList.add(...MainToolPanelCls)
  return mainToolPanel
}
