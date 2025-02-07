import { ImageAnnotationWorkspace } from '@xxs3315/iajs'
import { map } from 'nanostores'

export enum Mode {
  Select = 'Select',
  FreeDraw = 'FreeDraw',
  Line = 'Line',
  Rectangle = 'Rectangle',
  Ellipse = 'Ellipse',
  RectangleOutline = 'RectangleOutline',
  EllipseOutline = 'EllipseOutline',
  RectangleHighlight = 'RectangleHighlight',
  EllipseHighlight = 'EllipseHighlight',
  SingleArrow = 'SingleArrow',
  DoubleArrow = 'DoubleArrow',
  Text = 'Text',

  Delete = 'Delete',
  Undo = 'Undo',
  Redo = 'Redo',
  Reset = 'Reset',

  Save = 'Save',
  Copy = 'Copy',

  ZoomFull = 'ZoomFull',
  ZoomWidth = 'ZoomWidth',
  ZoomHeight = 'ZoomHeight',
  ZoomIn = 'ZoomIn',
  ZoomOut = 'ZoomOut',

  HorizontalLeft = 'HorizontalLeft',
  HorizontalRight = 'HorizontalRight',
  HorizontalCenter = 'HorizontalCenter',
  VerticalTop = 'VerticalTop',
  VerticalMiddle = 'VerticalMiddle',
  VerticalBottom = 'VerticalBottom',

  Group = 'Group',
  UnGroup = 'UnGroup',

  BringFront = 'BringFront',
  BringForward = 'BringForward',
  SendBackwards = 'SendBackwards',
  SendBack = 'SendBack',

  FlipX = 'FlipX',
  FlipY = 'FlipY',
}

export type ModeTypes = keyof typeof Mode

interface IajsStore {
  containerRef: null | HTMLDivElement
  iajsAnnotationWorkspaceRef: null | ImageAnnotationWorkspace
  mode: ModeTypes // 当前绘制工具类型
  modeList: ModeTypes[] // 全部绘制工具类型
  continuousCreate: null | boolean // 上一个绘制对象是不是连续绘制类型？ 用于更改当前绘制类型，进而改变工具栏按钮状态
  drawAnnotationCount: number // 绘制对象计数器， 每次新增绘制对象，计数器递增1，用于触发一些判断（如上一个绘制对象是否是连续绘制类型等
  zoom: number
  currentObjects: Record<string, any>[]
  currentActiveObject: any
  currentActiveObjectIds: string[] | undefined
  currentActiveObjectSTypes: string[] | undefined
  currentActiveObjectGeoAttrs: { x: number; y: number; width: number; height: number; angle: number } | undefined
  currentActiveObjectShapeAttrs:
    | {
        stokeColor: string | undefined
        strokeWidth: number | undefined
        fillColor: string | undefined
        fillOpacity: number | undefined
        textColor: string | undefined
        textFontFamily: string | undefined
        textFontSize: number | undefined
      }
    | undefined
  imageResult: any
  imageSaveCopy: string
}

const iajsStoreInit: IajsStore = {
  containerRef: null,
  iajsAnnotationWorkspaceRef: null,
  mode: 'Select',
  modeList: Object.keys(Mode) as ModeTypes[],
  continuousCreate: null,
  drawAnnotationCount: 0,
  zoom: 1,
  currentObjects: [],
  currentActiveObject: undefined,
  currentActiveObjectIds: undefined,
  currentActiveObjectSTypes: undefined,
  currentActiveObjectGeoAttrs: undefined,
  currentActiveObjectShapeAttrs: undefined,
  imageResult: undefined,
  imageSaveCopy: 'save',
}

export const $iajsStore = map<IajsStore>(iajsStoreInit)
