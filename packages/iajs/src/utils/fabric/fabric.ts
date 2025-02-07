import { ActiveSelection, Canvas, Group } from 'fabric'
// import { ImGroup } from './ImGroup'

export const isCollection = (thing?: unknown): thing is Group | ActiveSelection | Canvas => {
  return !!thing && Array.isArray((thing as Group)._objects)
}
