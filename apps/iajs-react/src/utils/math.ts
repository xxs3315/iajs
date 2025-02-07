import NP from 'number-precision'

NP.enableBoundaryChecking(false)
export const toFixed = (v: number, digits = 2): number => NP.round(v, digits)
