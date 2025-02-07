import { MainToolPanelContainerCls } from '../../clazz/panels/MainToolPanelContainer'

export const MainToolPanelContainer = () => {
  const mainToolPanelContainer = document.createElement('div')
  mainToolPanelContainer.classList.add(...MainToolPanelContainerCls)
  return mainToolPanelContainer
}
