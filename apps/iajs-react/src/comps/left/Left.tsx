import { useState } from 'react'
import { $iajsStore, Mode, ModeTypes } from '../../store/Iajs'
import { listenKeys } from 'nanostores'

function Left() {
  const [currentMode, setCurrentMode] = useState<ModeTypes>(Mode.Select)

  listenKeys($iajsStore, ['drawAnnotationCount'], (value, oldValue, changed) => {
    if (!$iajsStore.get().continuousCreate) {
      $iajsStore.setKey('mode', Mode.Select)
    }
  })

  listenKeys($iajsStore, ['mode'], (value, oldValue, changed) => {
    setCurrentMode(value.mode)
  })

  const handleToolClick = (item: ModeTypes) => {
    if (item === Mode.Undo || item === Mode.Redo || item === Mode.Delete || item === Mode.Reset) {
      if (item === Mode.Undo) {
        $iajsStore.get().iajsAnnotationWorkspaceRef?.undo()
      }
      if (item === Mode.Redo) {
        $iajsStore.get().iajsAnnotationWorkspaceRef?.redo()
      }
      if (item === Mode.Delete) {
        $iajsStore.get().iajsAnnotationWorkspaceRef?.deleteAnnotations()
      }
      if (item === Mode.Reset) {
        $iajsStore.get().iajsAnnotationWorkspaceRef?.reset()
      }
    } else if (item === Mode.Save || item === Mode.Copy) {
      if (item === Mode.Save) {
        $iajsStore.get().imageSaveCopy = 'save'
        $iajsStore.get().iajsAnnotationWorkspaceRef?.getImage('single', 'jpeg', 1)
      }
      if (item === Mode.Copy) {
        $iajsStore.get().imageSaveCopy = 'copy'
        $iajsStore.get().iajsAnnotationWorkspaceRef?.getImage('single', 'png', 1)
      }
    } else if (item === Mode.Select) {
      $iajsStore.setKey('mode', item)
      $iajsStore.get().iajsAnnotationWorkspaceRef?.setCurrentMode('select', undefined)
    } else {
      // 这些是图操作工具
      $iajsStore.setKey('mode', item)
      switch (item) {
        case Mode.Line:
          $iajsStore.get().iajsAnnotationWorkspaceRef?.setCurrentMode('manipulate', 'line')
          break
        case Mode.SingleArrow:
          $iajsStore.get().iajsAnnotationWorkspaceRef?.setCurrentMode('manipulate', 'single-arrow')
          break
        case Mode.DoubleArrow:
          $iajsStore.get().iajsAnnotationWorkspaceRef?.setCurrentMode('manipulate', 'double-arrow')
          break
        case Mode.Text:
          $iajsStore.get().iajsAnnotationWorkspaceRef?.setCurrentMode('manipulate', 'text')
          break
        case Mode.FreeDraw:
          $iajsStore.get().iajsAnnotationWorkspaceRef?.setCurrentMode('manipulate', 'free-draw')
          break
        case Mode.EllipseHighlight:
          $iajsStore.get().iajsAnnotationWorkspaceRef?.setCurrentMode('manipulate', 'ellipse-highlight')
          break
        case Mode.RectangleHighlight:
          $iajsStore.get().iajsAnnotationWorkspaceRef?.setCurrentMode('manipulate', 'rectangle-highlight')
          break
        case Mode.Ellipse:
          $iajsStore.get().iajsAnnotationWorkspaceRef?.setCurrentMode('manipulate', 'ellipse')
          break
        case Mode.Rectangle:
          $iajsStore.get().iajsAnnotationWorkspaceRef?.setCurrentMode('manipulate', 'rectangle')
          break
        case Mode.EllipseOutline:
          $iajsStore.get().iajsAnnotationWorkspaceRef?.setCurrentMode('manipulate', 'ellipse-outline')
          break
        case Mode.RectangleOutline:
          $iajsStore.get().iajsAnnotationWorkspaceRef?.setCurrentMode('manipulate', 'rectangle-outline')
          break
      }
    }
  }

  return (
    <>
      <div className="grow overflow-hidden flex flex-col justify-start items-center">
        <button
          type="button"
          onClick={() => handleToolClick(Mode.Save)}
          className="mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7zm2 16H5V5h11.17L19 7.83zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3M6 6h9v4H6z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.Copy)}
          className="mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M4 7v14h14v2H4c-1.1 0-2-.9-2-2V7zm16-4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h3.18C11.6 1.84 12.7 1 14 1s2.4.84 2.82 2zm-6 0c-.55 0-1 .45-1 1s.45 1 1 1s1-.45 1-1s-.45-1-1-1m-4 4V5H8v12h12V5h-2v2z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.Select)}
          className={
            currentMode === Mode.Select
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M13 17h4v-4h2v4h4v2h-4v4h-2v-4h-4zm-2 0v2H9v-2zm-4 0v2H5v-2zm12-8v2h-2V9zm0-4v2h-2V5zm-4 0v2h-2V5zm-4 0v2H9V5zM7 5v2H5V5zm0 8v2H5v-2zm0-4v2H5V9z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.FreeDraw)}
          className={
            currentMode === Mode.FreeDraw
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M9.75 20.85c1.78-.7 1.39-2.63.49-3.85c-.89-1.25-2.12-2.11-3.36-2.94A9.8 9.8 0 0 1 4.54 12c-.28-.33-.85-.94-.27-1.06c.59-.12 1.61.46 2.13.68c.91.38 1.81.82 2.65 1.34l1.01-1.7C8.5 10.23 6.5 9.32 4.64 9.05c-1.06-.16-2.18.06-2.54 1.21c-.32.99.19 1.99.77 2.77c1.37 1.83 3.5 2.71 5.09 4.29c.34.33.75.72.95 1.18c.21.44.16.47-.31.47c-1.24 0-2.79-.97-3.8-1.61l-1.01 1.7c1.53.94 4.09 2.41 5.96 1.79m11.09-15.6c.22-.22.22-.58 0-.79l-1.3-1.3a.56.56 0 0 0-.78 0l-1.02 1.02l2.08 2.08M11 10.92V13h2.08l6.15-6.15l-2.08-2.08z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.Line)}
          className={
            currentMode === Mode.Line
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M19 13H5v-2h14z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.SingleArrow)}
          className={
            currentMode === Mode.SingleArrow
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M19 17.59L17.59 19L7 8.41V15H5V5h10v2H8.41z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.DoubleArrow)}
          className={
            currentMode === Mode.DoubleArrow
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M13 21h8v-8h-2v4.59L6.41 5H11V3H3v8h2V6.41L17.59 19H13z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.RectangleOutline)}
          className={
            currentMode === Mode.RectangleOutline
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M4 6v13h16V6zm14 11H6V8h12z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.EllipseOutline)}
          className={
            currentMode === Mode.EllipseOutline
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 6c4.41 0 8 2.69 8 6s-3.59 6-8 6s-8-2.69-8-6s3.59-6 8-6m0-2C6.5 4 2 7.58 2 12s4.5 8 10 8s10-3.58 10-8s-4.5-8-10-8"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.Rectangle)}
          className={
            currentMode === Mode.Rectangle
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M4 6v13h16V6z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.Ellipse)}
          className={
            currentMode === Mode.Ellipse
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M12 4C6.5 4 2 7.58 2 12s4.5 8 10 8s10-3.58 10-8s-4.5-8-10-8" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.RectangleHighlight)}
          className={
            currentMode === Mode.RectangleHighlight
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M5 5v6h14V5zm.27 8.32L3.5 15.09l1.41 1.41l1.77-1.77zm13.46 0l-1.41 1.41l1.77 1.77l1.41-1.41zM11 16v3h2v-3z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.EllipseHighlight)}
          className={
            currentMode === Mode.EllipseHighlight
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M13 19v-3h-2v3zm6.09-2.5l1.41-1.41l-1.77-1.77l-1.41 1.41zm-14.18 0l1.77-1.77l-1.41-1.41l-1.77 1.77zM20 12c0-2.86-1.5-5.5-4-6.93s-5.5-1.43-8 0S4 9.14 4 12z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.Text)}
          className={
            currentMode === Mode.Text
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M9.6 14L12 7.7l2.4 6.3M11 5L5.5 19h2.2l1.1-3H15l1.1 3h2.2L13 5z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.Delete)}
          className={
            currentMode === Mode.Delete
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.Undo)}
          className={
            currentMode === Mode.Undo
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12.5 8c-2.65 0-5.05 1-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88c3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.Redo)}
          className={
            currentMode === Mode.Redo
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M18.4 10.6C16.55 9 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16a8 8 0 0 1 7.6-5.5c1.95 0 3.73.72 5.12 1.88L13 16h9V7z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.Reset)}
          className={
            currentMode === Mode.Reset
              ? 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              : 'mx-2 my-0.5 py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
          }
        >
          <svg
            className="shrink-0 size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M13.5 8H12v5l4.28 2.54l.72-1.21l-3.5-2.08zM13 3a9 9 0 0 0-9 9H1l3.96 4.03L9 12H6a7 7 0 0 1 7-7a7 7 0 0 1 7 7a7 7 0 0 1-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.9 8.9 0 0 0 13 21a9 9 0 0 0 9-9a9 9 0 0 0-9-9"
            />
          </svg>
        </button>
      </div>
    </>
  )
}

export default Left
