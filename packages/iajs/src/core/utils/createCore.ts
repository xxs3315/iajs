import { InstantiationService } from '../instantiation/instantiation/instantiationService'
import { getSingletonServiceDescriptors } from '../instantiation/instantiation/extensions'
import { IInstantiationService } from '../instantiation/instantiation/instantiation'
import { ServiceCollection } from '../instantiation/instantiation/serviceCollection'
import { ICore } from '../type'
import { setActiveCore } from '../index'
import { workspaceInstance } from '../workspace'

const createServices = (): IInstantiationService => {
  const services = new ServiceCollection()
  // 获取全局单例服务
  for (const [id, descriptor] of getSingletonServiceDescriptors()) {
    services.set(id, descriptor)
  }
  return new InstantiationService(services, true)
}

export const createCore = (): ICore => {
  const service = createServices()
  const core: ICore = {
    service: service,
    use(plugin) {
      workspaceInstance.workspace?.use(plugin)
      return this
    },
  }
  setActiveCore(core)
  return core
}
