<template>
  <div class="grid grid-cols-1 gap-2">
    <div
      class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
      :style="{
        display:
          currentObjectSTypes?.length === 1 &&
          currentObjectSTypes.some((type) => {
            return type !== 'text'
          })
            ? 'block'
            : 'none',
      }"
    >
      <div
        class="bg-gray-100 border-b rounded-t-xl py-2 px-4 md:py-2 md:px-4 dark:bg-neutral-900 dark:border-neutral-700"
      >
        <p class="mt-1 text-sm text-gray-500 dark:text-neutral-500">Outline</p>
      </div>
      <div class="p-2 md:p-2">
        <div class="max-w-sm space-y-2">
          <!-- Input Number -->
          <div
            class="py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
            data-hs-input-number=""
          >
            <div class="w-full flex justify-between items-center gap-x-5">
              <div class="grow">
                <span class="block text-xs text-gray-500 dark:text-neutral-400"> Stroke Width </span>
                <input
                  class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                  style="-moz-appearance: textfield"
                  type="number"
                  min="0"
                  oninput="value=value.replace(/^0+(\d)|[^\d]+/g,'')"
                  :value="currentObjectStrokeWidth"
                  @input="
                    (e) => {
                      currentObjectStrokeWidth = (e.target as any).value
                    }
                  "
                  @keydown="
                    (e) => {
                      if (e.key === 'Enter') doSetCurrentObjectStrokeWidth()
                    }
                  "
                />
              </div>
              <div class="flex justify-end items-center gap-x-1.5">
                <button
                  type="button"
                  class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  tabindex="-1"
                  aria-label="Decrease"
                  @click="() => doSetCurrentObjectStrokeWidth(-1)"
                >
                  <svg
                    class="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14"></path>
                  </svg>
                </button>
                <button
                  type="button"
                  class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  tabindex="-1"
                  aria-label="Increase"
                  @click="() => doSetCurrentObjectStrokeWidth(1)"
                >
                  <svg
                    class="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <!-- End Input Number -->
          <!-- Floating Input -->
          <div
            class="relative py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
          >
            <input
              type="color"
              class="peer h-8 block bg-white w-full border-gray-200 text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600 focus:mt-5 focus:mb-0 [&:not(:placeholder-shown)]:mt-5 [&:not(:placeholder-shown)]:mb-0 autofill:mt-5 autofill:mb-0"
              id="hs-color-input"
              title="Choose color"
              :value="currentObjectStokeColor"
              @change="
                (e) => {
                  currentObjectStokeColor = (e.target as any).value
                  doSetCurrentObjectStokeColor(currentObjectStokeColor)
                }
              "
            />
            <label
              for="hs-color-input"
              class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5 peer-focus:text-gray-500 dark:peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:translate-x-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
              >Color</label
            >
          </div>
          <!-- End Floating Input -->
        </div>
      </div>
    </div>

    <div
      class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
      :style="{
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
      }"
    >
      <div
        class="bg-gray-100 border-b rounded-t-xl py-2 px-4 md:py-2 md:px-4 dark:bg-neutral-900 dark:border-neutral-700"
      >
        <p class="mt-1 text-sm text-gray-500 dark:text-neutral-500">Fill</p>
      </div>
      <div class="p-2 md:p-2">
        <div class="max-w-sm space-y-2">
          <!-- Floating Input -->
          <div
            class="relative py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
          >
            <input
              type="color"
              class="peer h-8 block bg-white w-full border-gray-200 text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600 focus:mt-5 focus:mb-0 [&:not(:placeholder-shown)]:mt-5 [&:not(:placeholder-shown)]:mb-0 autofill:mt-5 autofill:mb-0"
              id="hs-color-input"
              title="Choose color"
              :value="currentObjectFillColor"
              @change="
                (e) => {
                  currentObjectFillColor = (e.target as any).value
                  doSetCurrentObjectFillColor(currentObjectFillColor)
                }
              "
            />
            <label
              for="hs-color-input"
              class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5 peer-focus:text-gray-500 dark:peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:translate-x-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
              >Color</label
            >
          </div>
          <!-- End Floating Input -->
          <!-- Input Number -->
          <div
            class="py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
            data-hs-input-number=""
            :style="{
              display:
                currentObjectSTypes?.length === 1 &&
                currentObjectSTypes.some((type) => {
                  return type === 'rectangle-highlight' || type === 'ellipse-highlight'
                })
                  ? 'block'
                  : 'none',
            }"
          >
            <div class="w-full flex justify-between items-center gap-x-5">
              <div class="grow">
                <span class="block text-xs text-gray-500 dark:text-neutral-400"> Opacity </span>
                <input
                  class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                  style="-moz-appearance: textfield"
                  type="number"
                  min="0"
                  aria-roledescription="Number field"
                  :value="currentObjectFillOpacity"
                  @input="
                    (e) => {
                      currentObjectFillOpacity = (e.target as any).value
                    }
                  "
                  @keydown="
                    (e) => {
                      if (e.key === 'Enter') doSetCurrentObjectFillOpacity()
                    }
                  "
                />
              </div>
              <div class="flex justify-end items-center gap-x-1.5">
                <button
                  type="button"
                  class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  tabindex="-1"
                  aria-label="Decrease"
                  @click="() => doSetCurrentObjectFillOpacity(-0.05)"
                >
                  <svg
                    class="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14"></path>
                  </svg>
                </button>
                <button
                  type="button"
                  class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  tabindex="-1"
                  aria-label="Increase"
                  data-hs-input-number-increment=""
                  @click="() => doSetCurrentObjectFillOpacity(0.05)"
                >
                  <svg
                    class="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <!-- End Input Number -->
        </div>
      </div>
    </div>

    <div
      class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
      :style="{
        display:
          currentObjectSTypes?.length === 1 &&
          currentObjectSTypes.some((type) => {
            return type === 'text'
          })
            ? 'block'
            : 'none',
      }"
    >
      <div
        class="bg-gray-100 border-b rounded-t-xl py-2 px-4 md:py-2 md:px-4 dark:bg-neutral-900 dark:border-neutral-700"
      >
        <p class="mt-1 text-sm text-gray-500 dark:text-neutral-500">Text</p>
      </div>
      <div class="p-2 md:p-2">
        <div class="max-w-sm space-y-2">
          <!-- Input Number -->
          <div
            class="py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
            data-hs-input-number='{
              "min": 0
            }'
          >
            <div class="w-full flex justify-between items-center gap-x-5">
              <div class="grow">
                <span class="block text-xs text-gray-500 dark:text-neutral-400"> Size </span>
                <input
                  class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                  style="-moz-appearance: textfield"
                  type="number"
                  aria-roledescription="Number field"
                  oninput="value=value.replace(/^0+(\d)|[^\d]+/g,'')"
                  :value="currentObjectTextFontSize"
                  @input="
                    (e) => {
                      currentObjectTextFontSize = (e.target as any).value
                    }
                  "
                  @keydown="
                    (e) => {
                      if (e.key === 'Enter') doSetCurrentObjectTextFontSize()
                    }
                  "
                />
              </div>
              <div class="flex justify-end items-center gap-x-1.5">
                <button
                  type="button"
                  class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  tabindex="-1"
                  aria-label="Decrease"
                  @click="() => doSetCurrentObjectTextFontSize(-1)"
                >
                  <svg
                    class="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14"></path>
                  </svg>
                </button>
                <button
                  type="button"
                  class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  tabindex="-1"
                  aria-label="Increase"
                  @click="() => doSetCurrentObjectTextFontSize(1)"
                >
                  <svg
                    class="shrink-0 size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <!-- End Input Number -->
          <!-- Floating Input -->
          <div
            class="relative py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
          >
            <input
              type="color"
              class="peer h-8 block bg-white w-full border-gray-200 text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600 focus:mt-5 focus:mb-0 [&:not(:placeholder-shown)]:mt-5 [&:not(:placeholder-shown)]:mb-0 autofill:mt-5 autofill:mb-0"
              id="hs-color-input"
              title="Choose color"
              :value="currentObjectTextColor"
              @change="
                (e) => {
                  currentObjectTextColor = (e.target as any).value
                  doSetCurrentObjectTextColor(currentObjectTextColor)
                }
              "
            />
            <label
              for="hs-color-input"
              class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5 peer-focus:text-gray-500 dark:peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:translate-x-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
              >Color</label
            >
          </div>
          <!-- End Floating Input -->
          <!-- Floating Select -->
          <div
            class="relative py-2 px-4 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
          >
            <select
              class="peer block pl-0 w-full border-0 focus:ring-0 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 focus:pt-6 focus:pb-2 [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
              @change="
                (e) => {
                  currentObjectTextFontFamily = (e.target as any).value
                  doSetCurrentObjectTextFontFamily(currentObjectTextFontFamily)
                }
              "
            >
              <option :selected="currentObjectTextFontFamily === 'Arial'" :style="{ fontFamily: 'Arial' }">
                Arial
              </option>
              <option :selected="currentObjectTextFontFamily === 'Arial Black'" :style="{ fontFamily: 'Arial Black' }">
                Arial black
              </option>
              <option
                :selected="currentObjectTextFontFamily === 'Comic Sans MS'"
                :style="{ fontFamily: 'Comic Sans MS' }"
              >
                Comic Sans MS
              </option>
              <option :selected="currentObjectTextFontFamily === 'Courier New'" :style="{ fontFamily: 'Courier New' }">
                Courier New
              </option>
              <option :selected="currentObjectTextFontFamily === 'Georgia'" :style="{ fontFamily: 'Georgia' }">
                Georgia
              </option>
              <option :selected="currentObjectTextFontFamily === 'Impact'" :style="{ fontFamily: 'Impact' }">
                Impact
              </option>
              <option
                :selected="currentObjectTextFontFamily === 'Times New Roman'"
                :style="{ fontFamily: 'Times New Roman' }"
              >
                Times New Roman
              </option>
              <option
                :selected="currentObjectTextFontFamily === 'Trebuchet MS'"
                :style="{ fontFamily: 'Trebuchet MS' }"
              >
                Trebuchet MS
              </option>
              <option :selected="currentObjectTextFontFamily === 'Verdana'" :style="{ fontFamily: 'Verdana' }">
                Verdana
              </option>
            </select>
            <label
              class="absolute top-0 start-0 p-4 h-full truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 dark:peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500"
              >Font</label
            >
          </div>
          <!-- End Floating Select -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { $iajsStore } from '../../store/Iajs'
import { listenKeys } from 'nanostores'
import { toFixed } from '../../utils/math'

const currentObject = ref(undefined)
const currentObjectSTypes = ref<string[] | undefined>(undefined)
const currentObjectStokeColor = ref<string | undefined>(undefined)
const currentObjectStrokeWidth = ref<number | undefined>(undefined)
const currentObjectFillColor = ref<string | undefined>(undefined)
const currentObjectFillOpacity = ref<number | undefined>(undefined)
const currentObjectTextColor = ref<string | undefined>(undefined)
const currentObjectTextFontFamily = ref<string | undefined>(undefined)
const currentObjectTextFontSize = ref<number | undefined>(undefined)
listenKeys($iajsStore, ['currentActiveObject'], (value, oldValue, changed) => {
  currentObject.value = value.currentActiveObject
})
listenKeys($iajsStore, ['currentActiveObjectSTypes'], (value, oldValue, changed) => {
  currentObjectSTypes.value = value.currentActiveObjectSTypes
})
listenKeys($iajsStore, ['currentActiveObjectShapeAttrs'], (value, oldValue, changed) => {
  if (value.currentActiveObjectShapeAttrs) {
    const { stokeColor, strokeWidth, fillColor, fillOpacity, textColor, textFontFamily, textFontSize } =
      value.currentActiveObjectShapeAttrs
    currentObjectStokeColor.value = stokeColor
    currentObjectStrokeWidth.value = strokeWidth
    currentObjectFillColor.value = fillColor
    currentObjectFillOpacity.value = fillOpacity
    currentObjectTextColor.value = textColor
    currentObjectTextFontFamily.value = textFontFamily
    currentObjectTextFontSize.value = textFontSize
  } else {
    currentObjectStokeColor.value = undefined
    currentObjectStrokeWidth.value = undefined
    currentObjectFillColor.value = undefined
    currentObjectFillOpacity.value = undefined
    currentObjectTextColor.value = undefined
    currentObjectTextFontFamily.value = undefined
    currentObjectTextFontSize.value = undefined
  }
})

const doSetCurrentObjectStokeColor = (value?: string) => {
  if (!currentObject.value || !currentObjectStokeColor.value) return
  $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject.value as any).id, 'stroke', value)
}

const doSetCurrentObjectFillColor = (value?: string) => {
  if (!currentObject.value || !currentObjectFillColor.value) return
  $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject.value as any).id, 'fill', value)
}

const doSetCurrentObjectStrokeWidth = (step?: number) => {
  if (!currentObject.value || currentObjectStrokeWidth.value === undefined) return
  let result = Number(currentObjectStrokeWidth.value) + (step ? step : 0)
  if (result < 0) {
    result = 0
  }
  $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject.value as any).id, 'strokeWidth', result)
}

const doSetCurrentObjectFillOpacity = (step?: number) => {
  if (!currentObject.value || currentObjectFillOpacity.value === undefined) return
  let result = toFixed(Number(currentObjectFillOpacity.value) + (step ? step : 0), 2)
  if (result < 0) {
    result = 0
  }
  if (result > 1) {
    result = 1
  }
  $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject.value as any).id, 'opacity', result)
}

const doSetCurrentObjectTextFontSize = (step?: number) => {
  if (!currentObject.value || currentObjectTextFontSize.value === undefined) return
  let result = Number(currentObjectTextFontSize.value) + (step ? step : 0)
  if (result < 1) {
    result = 1
  }
  $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject.value as any).id, 'fontSize', result)
}

const doSetCurrentObjectTextColor = (value?: string) => {
  if (!currentObject.value || !currentObjectTextColor.value) return
  $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject.value as any).id, 'fill', value)
}

const doSetCurrentObjectTextFontFamily = (value?: string) => {
  if (!currentObject.value || !currentObjectTextFontFamily.value) return
  $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr((currentObject.value as any).id, 'fontFamily', value)
}
</script>
