import { IInstantiationService } from '../instantiation/instantiation/instantiation'
import { Disposable } from '../instantiation/base/lifecycle'

export abstract class BaseWorkspace extends Disposable {
  public abstract service: IInstantiationService

  constructor() {
    super()
  }

  public abstract startup(): void

  public dispose() {
    super.dispose()
  }
}
