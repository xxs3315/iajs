import { Mitt } from './mitt'
import { createDecorator } from '../../instantiation/instantiation/instantiation'
import { InstantiationType, registerSingleton } from '../../instantiation/instantiation/extensions'

export type Events = {
  // undo redo
  undoRedoStackChange: undefined
  recordToUndoRedo: undefined
  reloadWorkspaceUndoRedo: undefined

  // zoom change
  canvasZoomChangeEnd: { zoom: number }

  // selection change
  selectionChangeEnd: {
    selection: any
    ids: string[] | undefined
    sTypes: string[] | undefined
    x: number | undefined
    y: number | undefined
    width: number | undefined
    height: number | undefined
    angle: number | undefined
    //
    stokeColor: string | undefined
    strokeWidth: number | undefined
    fillColor: string | undefined
    fillOpacity: number | undefined
    textColor: string | undefined
    textFontFamily: string | undefined
    textFontSize: number | undefined
  }

  // canvas content change
  contentChangeEnd: any

  // annotation create
  annotationCreateEnd: any
}

export class EventbusService extends Mitt<Events> {}

export const IEventbusService = createDecorator<EventbusService>('eventbusService')

registerSingleton(IEventbusService, Mitt, InstantiationType.Eager)
