/*---------------------------------------------------------------------------------------------
 *  Copyright (c) seasonjs. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export {
  IObservable,
  IObserver,
  IReader,
  ISettable,
  ISettableObservable,
  ITransaction,
  observableValue,
  transaction,
} from './observableImpl/base'
export { derived } from './observableImpl/derived'
export { autorun, autorunDelta, autorunHandleChanges, autorunWithStore } from './observableImpl/autorun'
export * from './observableImpl/utils'

import { ConsoleObservableLogger, setLogger } from './observableImpl/logging'

const enableLogging = false
if (enableLogging) {
  setLogger(new ConsoleObservableLogger())
}
