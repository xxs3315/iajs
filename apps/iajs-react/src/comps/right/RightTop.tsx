import { useState } from 'react'
import { listenKeys } from 'nanostores'
import { $iajsStore } from '../../store/Iajs'

function RightTop() {
  const [currentObject, setCurrentObject] = useState(undefined)
  const [currentObjectX, setCurrentObjectX] = useState<string>('')
  const [currentObjectY, setCurrentObjectY] = useState<string>('')
  const [currentObjectWidth, setCurrentObjectWidth] = useState<string>('')
  const [currentObjectHeight, setCurrentObjectHeight] = useState<string>('')
  const [currentObjectAngle, setCurrentObjectAngle] = useState<string>('')
  listenKeys($iajsStore, ['currentActiveObject'], (value, oldValue, changed) => {
    setCurrentObject(value.currentActiveObject)
  })
  listenKeys($iajsStore, ['currentActiveObjectGeoAttrs'], (value, oldValue, changed) => {
    if (value.currentActiveObjectGeoAttrs) {
      const { x, y, width, height, angle } = value.currentActiveObjectGeoAttrs
      setCurrentObjectX(String(x))
      setCurrentObjectY(String(y))
      setCurrentObjectWidth(String(width))
      setCurrentObjectHeight(String(height))
      setCurrentObjectAngle(String(angle))
    } else {
      setCurrentObjectX('')
      setCurrentObjectY('')
      setCurrentObjectWidth('')
      setCurrentObjectHeight('')
      setCurrentObjectAngle('')
    }
  })

  const doSetCurrentObjectX = (step?: number) => {
    if (currentObjectX.length === 0) return
    $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectLeft(Number(currentObjectX) + (step ? step : 0))
  }

  const doSetCurrentObjectY = (step?: number) => {
    if (currentObjectY.length === 0) return
    $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectTop(Number(currentObjectY) + (step ? step : 0))
  }

  const doSetCurrentObjectWidth = (step?: number) => {
    if (currentObjectWidth.length === 0) return
    $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectWidth(Number(currentObjectWidth) + (step ? step : 0))
  }

  const doSetCurrentObjectHeight = (step?: number) => {
    if (currentObjectHeight.length === 0) return
    $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectHeight(Number(currentObjectHeight) + (step ? step : 0))
  }

  const doSetCurrentObjectAngle = (step?: number) => {
    if (currentObjectAngle.length === 0) return
    $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAngle(Number(currentObjectAngle) + (step ? step : 0))
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div
          id="input-number"
          className="bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
        >
          <div className="w-full flex justify-between items-center gap-x-1">
            <div className="grow py-1 px-2">
              <span className="block text-xs text-gray-500 dark:text-neutral-400">X:</span>
              <input
                className="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                style={{ MozAppearance: 'textfield' }}
                type="number"
                value={currentObjectX}
                onChange={(e) => {
                  setCurrentObjectX(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') doSetCurrentObjectX()
                }}
                disabled={currentObject === undefined}
              ></input>
            </div>
            <div className="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-neutral-700 dark:border-neutral-700">
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                aria-label="Decrease"
                onClick={() => doSetCurrentObjectX(-1)}
                disabled={currentObject === undefined}
              >
                <svg
                  className="shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                </svg>
              </button>
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                aria-label="Increase"
                onClick={() => doSetCurrentObjectX(1)}
                disabled={currentObject === undefined}
              >
                <svg
                  className="shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          id="input-number"
          className="bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
        >
          <div className="w-full flex justify-between items-center gap-x-1">
            <div className="grow py-1 px-2">
              <span className="block text-xs text-gray-500 dark:text-neutral-400">Y:</span>
              <input
                className="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                style={{ MozAppearance: 'textfield' }}
                type="number"
                value={currentObjectY}
                onChange={(e) => {
                  setCurrentObjectY(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') doSetCurrentObjectY()
                }}
                disabled={currentObject === undefined}
              ></input>
            </div>
            <div className="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-neutral-700 dark:border-neutral-700">
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                aria-label="Decrease"
                onClick={() => doSetCurrentObjectY(-1)}
                disabled={currentObject === undefined}
              >
                <svg
                  className="shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                </svg>
              </button>
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                aria-label="Increase"
                onClick={() => doSetCurrentObjectY(1)}
                disabled={currentObject === undefined}
              >
                <svg
                  className="shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          id="input-number"
          className="bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
        >
          <div className="w-full flex justify-between items-center gap-x-1">
            <div className="grow py-1 px-2">
              <span className="block text-xs text-gray-500 dark:text-neutral-400">Width:</span>
              <input
                className="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                style={{ MozAppearance: 'textfield' }}
                type="number"
                value={currentObjectWidth}
                onChange={(e) => {
                  setCurrentObjectWidth(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') doSetCurrentObjectWidth()
                }}
                disabled={currentObject === undefined}
              ></input>
            </div>
            <div className="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-neutral-700 dark:border-neutral-700">
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                aria-label="Decrease"
                onClick={() => doSetCurrentObjectWidth(-1)}
                disabled={currentObject === undefined}
              >
                <svg
                  className="shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                </svg>
              </button>
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                aria-label="Increase"
                onClick={() => doSetCurrentObjectWidth(1)}
                disabled={currentObject === undefined}
              >
                <svg
                  className="shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          id="input-number"
          className="bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
        >
          <div className="w-full flex justify-between items-center gap-x-1">
            <div className="grow py-1 px-2">
              <span className="block text-xs text-gray-500 dark:text-neutral-400">Height:</span>
              <input
                className="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                style={{ MozAppearance: 'textfield' }}
                type="number"
                value={currentObjectHeight}
                onChange={(e) => {
                  setCurrentObjectHeight(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') doSetCurrentObjectHeight()
                }}
                disabled={currentObject === undefined}
              ></input>
            </div>
            <div className="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-neutral-700 dark:border-neutral-700">
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                aria-label="Decrease"
                onClick={() => doSetCurrentObjectHeight(-1)}
                disabled={currentObject === undefined}
              >
                <svg
                  className="shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                </svg>
              </button>
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                aria-label="Increase"
                onClick={() => doSetCurrentObjectHeight(1)}
                disabled={currentObject === undefined}
              >
                <svg
                  className="shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          id="input-number"
          className="bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
        >
          <div className="w-full flex justify-between items-center gap-x-1">
            <div className="grow py-1 px-2">
              <span className="block text-xs text-gray-500 dark:text-neutral-400">Angle:</span>
              <input
                className="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                style={{ MozAppearance: 'textfield' }}
                type="number"
                value={currentObjectAngle}
                onChange={(e) => {
                  setCurrentObjectAngle(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') doSetCurrentObjectAngle()
                }}
                disabled={currentObject === undefined}
              ></input>
            </div>
            <div className="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-neutral-700 dark:border-neutral-700">
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                aria-label="Decrease"
                onClick={() => doSetCurrentObjectAngle(-1)}
                disabled={currentObject === undefined}
              >
                <svg
                  className="shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                </svg>
              </button>
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                aria-label="Increase"
                onClick={() => doSetCurrentObjectAngle(1)}
                disabled={currentObject === undefined}
              >
                <svg
                  className="shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RightTop
