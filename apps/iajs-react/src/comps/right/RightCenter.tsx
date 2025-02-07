import { useState } from 'react'
import { listenKeys } from 'nanostores'
import { $iajsStore } from '../../store/Iajs'
import { toFixed } from '@xxs3315/iajs-vue3/src/utils/math'

function RightCenter() {
  const [currentObject, setCurrentObject] = useState(undefined)
  const [currentObjectSTypes, setCurrentObjectSTypes] = useState<string[] | undefined>(undefined)
  const [currentObjectStokeColor, setCurrentObjectStokeColor] = useState<string>('')
  const [currentObjectStrokeWidth, setCurrentObjectStrokeWidth] = useState<string>('')
  const [currentObjectFillColor, setCurrentObjectFillColor] = useState<string>('')
  const [currentObjectFillOpacity, setCurrentObjectFillOpacity] = useState<string>('')
  const [currentObjectTextColor, setCurrentObjectTextColor] = useState<string>('')
  const [currentObjectTextFontFamily, setCurrentObjectTextFontFamily] = useState<string>('')
  const [currentObjectTextFontSize, setCurrentObjectTextFontSize] = useState<string>('')

  listenKeys($iajsStore, ['currentActiveObject'], (value, oldValue, changed) => {
    setCurrentObject(value.currentActiveObject)
  })
  listenKeys($iajsStore, ['currentActiveObjectSTypes'], (value, oldValue, changed) => {
    setCurrentObjectSTypes(value.currentActiveObjectSTypes)
  })
  listenKeys($iajsStore, ['currentActiveObjectShapeAttrs'], (value, oldValue, changed) => {
    if (value.currentActiveObjectShapeAttrs) {
      const { stokeColor, strokeWidth, fillColor, fillOpacity, textColor, textFontFamily, textFontSize } =
        value.currentActiveObjectShapeAttrs
      setCurrentObjectStokeColor(stokeColor !== undefined ? stokeColor : '')
      setCurrentObjectStrokeWidth(strokeWidth !== undefined ? String(strokeWidth) : '')
      setCurrentObjectFillColor(fillColor !== undefined ? fillColor : '')
      setCurrentObjectFillOpacity(fillOpacity !== undefined ? String(fillOpacity) : '')
      setCurrentObjectTextColor(textColor !== undefined ? textColor : '')
      setCurrentObjectTextFontFamily(textFontFamily !== undefined ? textFontFamily : '')
      setCurrentObjectTextFontSize(textFontSize !== undefined ? String(textFontSize) : '')
    } else {
      setCurrentObjectStokeColor('')
      setCurrentObjectStrokeWidth('')
      setCurrentObjectFillColor('')
      setCurrentObjectFillOpacity('')
      setCurrentObjectTextColor('')
      setCurrentObjectTextFontFamily('')
      setCurrentObjectTextFontSize('')
    }
  })

  const doSetCurrentObjectStokeColor = (value?: string) => {
    if (currentObjectStokeColor.length === 0) return
    $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject as any).id, 'stroke', value)
  }

  const doSetCurrentObjectFillColor = (value?: string) => {
    if (currentObjectFillColor.length === 0) return
    $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject as any).id, 'fill', value)
  }

  const doSetCurrentObjectStrokeWidth = (step?: number) => {
    if (currentObjectStrokeWidth.length === 0) return
    let result = Number(currentObjectStrokeWidth) + (step ? step : 0)
    if (result < 0) {
      result = 0
    }
    $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject as any).id, 'strokeWidth', result)
  }

  const doSetCurrentObjectFillOpacity = (step?: number) => {
    if (currentObjectFillOpacity.length === 0) return
    let result = toFixed(Number(currentObjectFillOpacity) + (step ? step : 0), 2)
    if (result < 0) {
      result = 0
    }
    if (result > 1) {
      result = 1
    }
    $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject as any).id, 'opacity', result)
  }

  const doSetCurrentObjectTextFontSize = (step?: number) => {
    if (currentObjectTextFontSize.length === 0) return
    let result = Number(currentObjectTextFontSize) + (step ? step : 0)
    if (result < 1) {
      result = 1
    }
    $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject as any).id, 'fontSize', result)
  }

  const doSetCurrentObjectTextColor = (value?: string) => {
    if (currentObjectTextColor.length === 0) return
    $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject as any).id, 'fill', value)
  }

  const doSetCurrentObjectTextFontFamily = (value?: string) => {
    if (currentObjectTextFontFamily.length === 0) return
    $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject as any).id, 'fontFamily', value)
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        <div
          className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
          style={{
            display:
              currentObjectSTypes?.length === 1 &&
              currentObjectSTypes.some((type) => {
                return type !== 'text'
              })
                ? 'block'
                : 'none',
          }}
        >
          <div className="bg-gray-100 border-b rounded-t-xl py-2 px-4 md:py-2 md:px-4 dark:bg-neutral-900 dark:border-neutral-700">
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">Outline</p>
          </div>
          <div className="p-2 md:p-2">
            <div className="max-w-sm space-y-2">
              <div
                className="py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
                data-hs-input-number=""
              >
                <div className="w-full flex justify-between items-center gap-x-5">
                  <div className="grow">
                    <span className="block text-xs text-gray-500 dark:text-neutral-400"> Stroke Width </span>
                    <input
                      className="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                      style={{ MozAppearance: 'textfield' }}
                      type="number"
                      min="0"
                      onInput={(e) => {
                        ;(e.target as any).value = (e.target as any).value.replace(/^0+(\d)|[^\d]+/g, '')
                      }}
                      value={currentObjectStrokeWidth}
                      onChange={(e) => {
                        setCurrentObjectStrokeWidth((e.target as any).value)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') doSetCurrentObjectStrokeWidth()
                      }}
                    />
                  </div>
                  <div className="flex justify-end items-center gap-x-1.5">
                    <button
                      type="button"
                      className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      aria-label="Decrease"
                      onClick={() => doSetCurrentObjectStrokeWidth(-1)}
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
                      className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      aria-label="Increase"
                      onClick={() => doSetCurrentObjectStrokeWidth(1)}
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
              <div className="relative py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
                <input
                  type="color"
                  className="peer h-8 block bg-white w-full border-gray-200 text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600 focus:mt-5 focus:mb-0 [&:not(:placeholder-shown)]:mt-5 [&:not(:placeholder-shown)]:mb-0 autofill:mt-5 autofill:mb-0"
                  id="hs-color-input"
                  title="Choose color"
                  value={currentObjectStokeColor}
                  onChange={(e) => {
                    setCurrentObjectStokeColor((e.target as any).value)
                    doSetCurrentObjectStokeColor((e.target as any).value)
                  }}
                />
                <label
                  htmlFor="hs-color-input"
                  className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5 peer-focus:text-gray-500 dark:peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:translate-x-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
                >
                  Color
                </label>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
          style={{
            display:
              currentObjectSTypes?.length === 1 &&
              currentObjectSTypes.some((type) => {
                return (
                  type === 'rectangle' ||
                  type === 'ellipse' ||
                  type === 'rectangle-highlight' ||
                  type === 'ellipse-highlight'
                )
              })
                ? 'block'
                : 'none',
          }}
        >
          <div className="bg-gray-100 border-b rounded-t-xl py-2 px-4 md:py-2 md:px-4 dark:bg-neutral-900 dark:border-neutral-700">
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">Fill</p>
          </div>
          <div className="p-2 md:p-2">
            <div className="max-w-sm space-y-2">
              <div className="relative py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
                <input
                  type="color"
                  className="peer h-8 block bg-white w-full border-gray-200 text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600 focus:mt-5 focus:mb-0 [&:not(:placeholder-shown)]:mt-5 [&:not(:placeholder-shown)]:mb-0 autofill:mt-5 autofill:mb-0"
                  id="hs-color-input"
                  title="Choose color"
                  value={currentObjectFillColor}
                  onChange={(e) => {
                    setCurrentObjectFillColor((e.target as any).value)
                    doSetCurrentObjectFillColor((e.target as any).value)
                  }}
                />
                <label
                  htmlFor="hs-color-input"
                  className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5 peer-focus:text-gray-500 dark:peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:translate-x-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
                >
                  Color
                </label>
              </div>
              <div
                className="py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
                data-hs-input-number=""
                style={{
                  display:
                    currentObjectSTypes?.length === 1 &&
                    currentObjectSTypes.some((type) => {
                      return type === 'rectangle-highlight' || type === 'ellipse-highlight'
                    })
                      ? 'block'
                      : 'none',
                }}
              >
                <div className="w-full flex justify-between items-center gap-x-5">
                  <div className="grow">
                    <span className="block text-xs text-gray-500 dark:text-neutral-400"> Opacity </span>
                    <input
                      className="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                      style={{ MozAppearance: 'textfield' }}
                      type="number"
                      min="0"
                      onInput={(e) => {
                        setCurrentObjectFillOpacity((e.target as any).value)
                      }}
                      value={currentObjectFillOpacity}
                      onChange={(e) => {
                        setCurrentObjectFillOpacity((e.target as any).value)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') doSetCurrentObjectFillOpacity()
                      }}
                    />
                  </div>
                  <div className="flex justify-end items-center gap-x-1.5">
                    <button
                      type="button"
                      className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      aria-label="Decrease"
                      onClick={() => doSetCurrentObjectFillOpacity(-0.05)}
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
                      className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      aria-label="Increase"
                      data-hs-input-number-increment=""
                      onClick={() => doSetCurrentObjectFillOpacity(0.05)}
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
          </div>
        </div>

        <div
          className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
          style={{
            display:
              currentObjectSTypes?.length === 1 &&
              currentObjectSTypes.some((type) => {
                return type === 'text'
              })
                ? 'block'
                : 'none',
          }}
        >
          <div className="bg-gray-100 border-b rounded-t-xl py-2 px-4 md:py-2 md:px-4 dark:bg-neutral-900 dark:border-neutral-700">
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">Text</p>
          </div>
          <div className="p-2 md:p-2">
            <div className="max-w-sm space-y-2">
              <div
                className="py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
                data-hs-input-number='{
              "min": 0
            }'
              >
                <div className="w-full flex justify-between items-center gap-x-5">
                  <div className="grow">
                    <span className="block text-xs text-gray-500 dark:text-neutral-400"> Size </span>
                    <input
                      className="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                      style={{ MozAppearance: 'textfield' }}
                      type="number"
                      min="0"
                      onInput={(e) => {
                        ;(e.target as any).value = (e.target as any).value.replace(/^0+(\d)|[^\d]+/g, '')
                      }}
                      value={currentObjectTextFontSize}
                      onChange={(e) => {
                        setCurrentObjectTextFontSize((e.target as any).value)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') doSetCurrentObjectTextFontSize()
                      }}
                    />
                  </div>
                  <div className="flex justify-end items-center gap-x-1.5">
                    <button
                      type="button"
                      className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      aria-label="Decrease"
                      onClick={() => doSetCurrentObjectTextFontSize(-1)}
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
                      className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      aria-label="Increase"
                      onClick={() => doSetCurrentObjectTextFontSize(1)}
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
              <div className="relative py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
                <input
                  type="color"
                  className="peer h-8 block bg-white w-full border-gray-200 text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600 focus:mt-5 focus:mb-0 [&:not(:placeholder-shown)]:mt-5 [&:not(:placeholder-shown)]:mb-0 autofill:mt-5 autofill:mb-0"
                  id="hs-color-input"
                  title="Choose color"
                  value={currentObjectTextColor}
                  onChange={(e) => {
                    setCurrentObjectTextColor((e.target as any).value)
                    doSetCurrentObjectTextColor((e.target as any).value)
                  }}
                />
                <label
                  htmlFor="hs-color-input"
                  className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5 peer-focus:text-gray-500 dark:peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:translate-x-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
                >
                  Color
                </label>
              </div>
              <div className="relative py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
                <select
                  className="peer block pl-0 w-full border-0 focus:ring-0 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 focus:pt-6 focus:pb-2 [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                  value={currentObjectTextFontFamily}
                  onChange={(e) => {
                    setCurrentObjectTextFontFamily((e.target as any).value)
                    doSetCurrentObjectTextFontFamily((e.target as any).value)
                  }}
                >
                  <option value="Arial" style={{ fontFamily: 'Arial' }}>
                    Arial
                  </option>
                  <option value="Arial Black" style={{ fontFamily: 'Arial Black' }}>
                    Arial black
                  </option>
                  <option value="Comic Sans MS" style={{ fontFamily: 'Comic Sans MS' }}>
                    Comic Sans MS
                  </option>
                  <option value="Courier New" style={{ fontFamily: 'Courier New' }}>
                    Courier New
                  </option>
                  <option value="Georgia" style={{ fontFamily: 'Georgia' }}>
                    Georgia
                  </option>
                  <option value="Impact" style={{ fontFamily: 'Impact' }}>
                    Impact
                  </option>
                  <option value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>
                    Times New Roman
                  </option>
                  <option value="Trebuchet MS" style={{ fontFamily: 'Trebuchet MS' }}>
                    Trebuchet MS
                  </option>
                  <option value="Verdana" style={{ fontFamily: 'Verdana' }}>
                    Verdana
                  </option>
                </select>
                <label className="absolute top-0 start-0 p-4 h-full truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 dark:peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">
                  Font
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RightCenter
