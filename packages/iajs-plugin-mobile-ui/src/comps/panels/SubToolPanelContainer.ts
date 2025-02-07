import { SubToolPanelContainerCls } from '../../clazz/panels/SubToolPanelContainer'

export const SubToolPanelContainer = () => {
  const subToolPanelContainer = document.createElement('div')
  subToolPanelContainer.classList.add(...SubToolPanelContainerCls)
  return subToolPanelContainer
}
