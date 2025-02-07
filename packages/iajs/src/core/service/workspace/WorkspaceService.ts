import { EventbusService, IEventbusService } from '../eventbus/EventbusService'
import { createDecorator, Disposable } from '../../instantiation'
import { randomText } from '../../../utils/string'
import { toFixed } from '../../../utils/math'
import { Point } from 'fabric'
import { ImageAnnotationManipulateDetail, ImageAnnotationMode } from '../../../ImageAnnotation'

export const IWorkspaceService = createDecorator<WorkspaceService>('workspaceService')

export type IWorkspace = { id: string; name: string }

export class WorkspaceService extends Disposable {
  private workspace: IWorkspace | undefined = undefined
  private workspaceEl: HTMLElement | undefined = undefined
  private mainContainerEl: HTMLDivElement | undefined = undefined
  private tmpLineCanvas: HTMLCanvasElement | undefined = undefined
  private id = ''
  private currentZoomScale = 1
  private minZoomScale: number = 0.02
  private maxZoomScale: number = 20
  private ctrlKeydown = false
  private mouseDownPoint: Point | undefined = undefined
  private mouseDownPointInActiveObject: boolean = false
  private containerWidth: number = 1
  private containerHeight: number = 1
  private imageTargetWidth: number = 1
  private imageTargetHeight: number = 1
  private mode: ImageAnnotationMode = 'select'
  private manipulateDetail: ImageAnnotationManipulateDetail | undefined = undefined
  private prevMode: ImageAnnotationMode | undefined = undefined
  private prevManipulateDetail: ImageAnnotationManipulateDetail | undefined = undefined
  private currentObjects: Record<string, any>[] = []
  private imageTargetBase64TilesCount = 0
  private manipulateOrigX = 0
  private manipulateOrigY = 0
  private manipulateObj: any = undefined
  private recordToUndoRedo = true
  private createObjectTolerance: number = 10

  getCreateObjectTolerance(): number {
    return this.createObjectTolerance
  }

  setCreateObjectTolerance(value: number) {
    this.createObjectTolerance = value
  }

  getMouseDownPointInActiveObject(): boolean {
    return this.mouseDownPointInActiveObject
  }

  setMouseDownPointInActiveObject(value: boolean) {
    this.mouseDownPointInActiveObject = value
  }

  getRecordToUndoRedo(): boolean {
    return this.recordToUndoRedo
  }

  setRecordToUndoRedo(value: boolean) {
    this.recordToUndoRedo = value
  }

  getManipulateOrigX(): number {
    return this.manipulateOrigX
  }

  setManipulateOrigX(value: number) {
    this.manipulateOrigX = value
  }

  getManipulateOrigY(): number {
    return this.manipulateOrigY
  }

  setManipulateOrigY(value: number) {
    this.manipulateOrigY = value
  }

  getManipulateObj(): any {
    return this.manipulateObj
  }

  setManipulateObj(value: any) {
    this.manipulateObj = value
  }

  getWorkspaceEl(): HTMLElement | undefined {
    return this.workspaceEl
  }

  setWorkspaceEl(value: HTMLElement | undefined) {
    this.workspaceEl = value
  }

  getMainContainerEl(): HTMLDivElement | undefined {
    return this.mainContainerEl
  }

  setMainContainerEl(value: HTMLDivElement | undefined) {
    this.mainContainerEl = value
  }

  getTmpLineCanvas(): HTMLCanvasElement | undefined {
    return this.tmpLineCanvas
  }

  setTmpLineCanvas(value: HTMLCanvasElement | undefined) {
    this.tmpLineCanvas = value
  }

  getImageTargetBase64TilesCount(): number {
    return this.imageTargetBase64TilesCount
  }

  setImageTargetBase64TilesCount(value: number) {
    this.imageTargetBase64TilesCount = value
  }

  getCurrentObjects(): Record<string, any>[] {
    return this.currentObjects
  }

  setCurrentObjects(value: Record<string, any>[]) {
    this.currentObjects = value
  }

  getPrevManipulateDetail(): ImageAnnotationManipulateDetail | undefined {
    return this.prevManipulateDetail
  }

  setPrevManipulateDetail(value: ImageAnnotationManipulateDetail | undefined) {
    this.prevManipulateDetail = value
  }

  getPrevMode(): ImageAnnotationMode | undefined {
    return this.prevMode
  }

  setPrevMode(value: ImageAnnotationMode | undefined) {
    this.prevMode = value
  }

  getCtrlKeydown(): boolean {
    return this.ctrlKeydown
  }

  setCtrlKeydown(value: boolean) {
    this.ctrlKeydown = value
  }

  getMode(): ImageAnnotationMode {
    return this.mode
  }

  setMode(value: ImageAnnotationMode) {
    this.mode = value
  }

  getManipulateDetail(): ImageAnnotationManipulateDetail | undefined {
    return this.manipulateDetail
  }

  setManipulateDetail(value: ImageAnnotationManipulateDetail | undefined) {
    this.manipulateDetail = value
  }

  getImageTargetWidth(): number {
    return this.imageTargetWidth
  }

  setImageTargetWidth(value: number) {
    this.imageTargetWidth = value
  }

  getImageTargetHeight(): number {
    return this.imageTargetHeight
  }

  setImageTargetHeight(value: number) {
    this.imageTargetHeight = value
  }

  getContainerHeight(): number {
    return this.containerHeight
  }

  setContainerHeight(value: number) {
    this.containerHeight = value
  }

  getContainerWidth(): number {
    return this.containerWidth
  }

  setContainerWidth(value: number) {
    this.containerWidth = value
  }

  constructor(@IEventbusService private readonly eventbus: EventbusService) {
    super()
  }

  getMouseDownPoint(): Point | undefined {
    return this.mouseDownPoint
  }

  setMouseDownPoint(value: Point | undefined) {
    this.mouseDownPoint = value
  }

  public getCurrentZoomScale() {
    return this.currentZoomScale
  }

  public setCurrentZoomScale(scale: number) {
    this.currentZoomScale = scale
    if (scale < this.minZoomScale) {
      this.currentZoomScale = this.minZoomScale
    }
    if (scale > this.maxZoomScale) {
      this.currentZoomScale = this.maxZoomScale
    }
    this.currentZoomScale = toFixed(this.currentZoomScale, 4)
  }

  public getId(): string {
    return this.id
  }

  public setId(workspaceId: string) {
    if (!this.get(workspaceId) || this.id === workspaceId) return
    this.id = workspaceId
  }

  public set(workspaceId: string, name: string) {
    const workspace = this.get(workspaceId)
    if (!workspace || workspace.name === name) return
    workspace.name = name
  }

  public get(workspaceId: string) {
    return this.workspace && this.workspace.id === workspaceId ? this.workspace : undefined
  }

  public all(): IWorkspace[] {
    return this.workspace ? [this.workspace] : []
  }

  public init(name: string, id?: string): string {
    if (!id) {
      id = randomText()
    }
    this.workspace = { id, name }
    return id
  }

  public clear() {
    this.workspace = undefined
    this.id = ''
  }

  public dispose() {
    super.dispose()
  }
}
