import type { ICore } from './type'

export let activeCore: ICore

export const setActiveCore = (core: ICore) => (activeCore = core)

export const getActiveCore = () => activeCore
