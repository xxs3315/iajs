export type ArrowType = 'single' | 'double'

export const ArrowPoints = (
  arrowType: ArrowType,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): { x: number; y: number }[] => {
  const angle = Math.atan2(endY - startY, endX - startX)

  const headLength = 10

  // bring the line end back some to account for arrow head.
  endX = endX - headLength * Math.cos(angle)
  endY = endY - headLength * Math.sin(angle)

  if (arrowType === 'double') {
    startX = startX + headLength * Math.cos(angle)
    startY = startY + headLength * Math.sin(angle)
  }

  const tip1 = {
    x: endX + headLength * Math.cos(angle),
    y: endY + headLength * Math.sin(angle),
  }

  const tip1Sides = (type: string) => {
    const sol = type === 'pos' ? angle + Math.PI / 4 : angle - Math.PI / 4
    return {
      x: endX - headLength * Math.cos(sol),
      y: endY - headLength * Math.sin(sol),
    }
  }

  const angle2 = angle + 3.15
  const tip2 = {
    x: startX + headLength * Math.cos(angle2),
    y: startY + headLength * Math.sin(angle2),
  }

  const tip2Sides = (type: string) => {
    const sol = type === 'pos' ? angle2 + Math.PI / 4 : angle2 - Math.PI / 4
    return {
      x: startX - headLength * Math.cos(sol),
      y: startY - headLength * Math.sin(sol),
    }
  }

  const tip1BottomSides = (type: string) => {
    const sol = type === 'pos' ? angle + Math.PI / 4 : angle - Math.PI / 4
    return {
      x: endX - (headLength / 6) * Math.cos(sol),
      y: endY - (headLength / 6) * Math.sin(sol),
    }
  }

  const tip2BottomSides = (type: string) => {
    const sol = type === 'pos' ? angle + Math.PI / 4 : angle - Math.PI / 4
    return {
      x: startX - (headLength / 6) * Math.cos(sol),
      y: startY - (headLength / 6) * Math.sin(sol),
    }
  }

  const lineSides1 = (type: string) => {
    const sol = type === 'pos' ? angle + Math.PI / 4 : angle - Math.PI / 4
    return {
      x: startX - (headLength / 6) * Math.cos(sol),
      y: startY - (headLength / 6) * Math.sin(sol),
    }
  }

  const lineSides2 = (type: string) => {
    const sol = type === 'pos' ? angle + Math.PI / 4 : angle - Math.PI / 4
    return {
      x: endX - (headLength / 6) * Math.cos(sol),
      y: endY - (headLength / 6) * Math.sin(sol),
    }
  }

  // calculate the points.
  return arrowType === 'single'
    ? [
        {
          x: startX, // start point
          y: startY,
        },
        lineSides1('neg'),
        tip1BottomSides('neg'),
        tip1Sides('neg'),
        tip1,
        tip1Sides('pos'),
        tip1BottomSides('pos'),
        lineSides1('pos'),
        {
          x: startX,
          y: startY,
        },
      ]
    : [
        lineSides2('pos'),
        tip2BottomSides('neg'),
        tip2Sides('neg'),
        tip2,
        tip2Sides('pos'),
        tip2BottomSides('pos'),
        lineSides2('neg'),

        lineSides1('neg'),
        tip1BottomSides('neg'),
        tip1Sides('neg'),
        tip1,
        tip1Sides('pos'),
        tip1BottomSides('pos'),
        lineSides1('pos'),
      ]
}
