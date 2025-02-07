import NP from 'number-precision'

NP.enableBoundaryChecking(false)
export const toFixed = (v: number, digits = 2): number => NP.round(v, digits)

export const clampAngle = (angle: number): number => {
  const normalizedAngle = ((angle % 360) + 360) % 360
  const clampedAngle = normalizedAngle > 180 ? normalizedAngle - 360 : normalizedAngle
  return clampedAngle
}

export const PiBy180 = Math.PI / 180
