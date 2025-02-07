import { TopPanelCls } from '../../clazz/panels/TopPanel'

export const TopPanel = () => {
  const topPanel = document.createElement('div')
  topPanel.classList.add(...TopPanelCls)
  return topPanel
}
