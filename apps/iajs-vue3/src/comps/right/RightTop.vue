<template>
  <div class="grid grid-cols-2 gap-2">
    <div
      id="input-number"
      class="bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
    >
      <div class="w-full flex justify-between items-center gap-x-1">
        <div class="grow py-1 px-2">
          <span class="block text-xs text-gray-500 dark:text-neutral-400">X:</span>
          <input
            class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
            style="-moz-appearance: textfield"
            type="number"
            :value="currentObjectX"
            @change="
              (e) => {
                currentObjectX = (e.target as any).value
              }
            "
            @input="
              (e) => {
                currentObjectX = (e.target as any).value
              }
            "
            @keydown="
              (e) => {
                if (e.key === 'Enter') doSetCurrentObjectX()
              }
            "
            :disabled="currentObject === undefined"
          />
        </div>
        <div
          class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-neutral-700 dark:border-neutral-700"
        >
          <button
            type="button"
            class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            aria-label="Decrease"
            @click="() => doSetCurrentObjectX(-1)"
            :disabled="currentObject === undefined"
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
            class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            aria-label="Increase"
            @click="() => doSetCurrentObjectX(1)"
            :disabled="currentObject === undefined"
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
    <div
      id="input-number"
      class="bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
    >
      <div class="w-full flex justify-between items-center gap-x-1">
        <div class="grow py-1 px-2">
          <span class="block text-xs text-gray-500 dark:text-neutral-400">Y:</span>
          <input
            class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
            style="-moz-appearance: textfield"
            type="number"
            :value="currentObjectY"
            @change="
              (e) => {
                currentObjectY = (e.target as any).value
              }
            "
            @input="
              (e) => {
                currentObjectY = (e.target as any).value
              }
            "
            @keydown="
              (e) => {
                if (e.key === 'Enter') doSetCurrentObjectY()
              }
            "
            :disabled="currentObject === undefined"
          />
        </div>
        <div
          class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-neutral-700 dark:border-neutral-700"
        >
          <button
            type="button"
            class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            aria-label="Decrease"
            @click="() => doSetCurrentObjectY(-1)"
            :disabled="currentObject === undefined"
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
            class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            aria-label="Increase"
            @click="() => doSetCurrentObjectY(1)"
            :disabled="currentObject === undefined"
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
    <div
      id="input-number"
      class="bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
    >
      <div class="w-full flex justify-between items-center gap-x-1">
        <div class="grow py-1 px-2">
          <span class="block text-xs text-gray-500 dark:text-neutral-400">Width:</span>
          <input
            class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
            style="-moz-appearance: textfield"
            type="number"
            :value="currentObjectWidth"
            @change="
              (e) => {
                currentObjectWidth = (e.target as any).value
              }
            "
            @input="
              (e) => {
                currentObjectWidth = (e.target as any).value
              }
            "
            @keydown="
              (e) => {
                if (e.key === 'Enter') doSetCurrentObjectWidth()
              }
            "
            :disabled="currentObject === undefined"
          />
        </div>
        <div
          class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-neutral-700 dark:border-neutral-700"
        >
          <button
            type="button"
            class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            aria-label="Decrease"
            @click="() => doSetCurrentObjectWidth(-1)"
            :disabled="currentObject === undefined"
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
            class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            aria-label="Increase"
            @click="() => doSetCurrentObjectWidth(1)"
            :disabled="currentObject === undefined"
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
    <div
      id="input-number"
      class="bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
    >
      <div class="w-full flex justify-between items-center gap-x-1">
        <div class="grow py-1 px-2">
          <span class="block text-xs text-gray-500 dark:text-neutral-400">Height:</span>
          <input
            class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
            style="-moz-appearance: textfield"
            type="number"
            :value="currentObjectHeight"
            @change="
              (e) => {
                currentObjectHeight = (e.target as any).value
              }
            "
            @input="
              (e) => {
                currentObjectHeight = (e.target as any).value
              }
            "
            @keydown="
              (e) => {
                if (e.key === 'Enter') doSetCurrentObjectHeight()
              }
            "
            :disabled="currentObject === undefined"
          />
        </div>
        <div
          class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-neutral-700 dark:border-neutral-700"
        >
          <button
            type="button"
            class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            aria-label="Decrease"
            @click="() => doSetCurrentObjectHeight(-1)"
            :disabled="currentObject === undefined"
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
            class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            aria-label="Increase"
            @click="() => doSetCurrentObjectHeight(1)"
            :disabled="currentObject === undefined"
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
    <div
      id="input-number"
      class="bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
    >
      <div class="w-full flex justify-between items-center gap-x-1">
        <div class="grow py-1 px-2">
          <span class="block text-xs text-gray-500 dark:text-neutral-400">Angle:</span>
          <input
            class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
            style="-moz-appearance: textfield"
            type="number"
            :value="currentObjectAngle"
            @change="
              (e) => {
                currentObjectAngle = (e.target as any).value
              }
            "
            @input="
              (e) => {
                currentObjectAngle = (e.target as any).value
              }
            "
            @keydown="
              (e) => {
                if (e.key === 'Enter') doSetCurrentObjectAngle()
              }
            "
            :disabled="currentObject === undefined"
          />
        </div>
        <div
          class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-neutral-700 dark:border-neutral-700"
        >
          <button
            type="button"
            class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            aria-label="Decrease"
            @click="() => doSetCurrentObjectAngle(-1)"
            :disabled="currentObject === undefined"
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
            class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            aria-label="Increase"
            @click="() => doSetCurrentObjectAngle(1)"
            :disabled="currentObject === undefined"
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
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { $iajsStore } from '../../store/Iajs'
import { listenKeys } from 'nanostores'

const currentObject = ref(undefined)
const currentObjectX = ref<string>('')
const currentObjectY = ref<string>('')
const currentObjectWidth = ref<string>('')
const currentObjectHeight = ref<string>('')
const currentObjectAngle = ref<string>('')
listenKeys($iajsStore, ['currentActiveObject'], (value, oldValue, changed) => {
  currentObject.value = value.currentActiveObject
})
listenKeys($iajsStore, ['currentActiveObjectGeoAttrs'], (value, oldValue, changed) => {
  if (value.currentActiveObjectGeoAttrs) {
    const { x, y, width, height, angle } = value.currentActiveObjectGeoAttrs
    currentObjectX.value = String(x)
    currentObjectY.value = String(y)
    currentObjectWidth.value = String(width)
    currentObjectHeight.value = String(height)
    currentObjectAngle.value = String(angle)
  } else {
    currentObjectX.value = ''
    currentObjectY.value = ''
    currentObjectWidth.value = ''
    currentObjectHeight.value = ''
    currentObjectAngle.value = ''
  }
})

const doSetCurrentObjectX = (step?: number) => {
  if (currentObjectX.value.length === 0) return
  $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectLeft(Number(currentObjectX.value) + (step ? step : 0))
}

const doSetCurrentObjectY = (step?: number) => {
  if (currentObjectY.value.length === 0) return
  $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectTop(Number(currentObjectY.value) + (step ? step : 0))
}

const doSetCurrentObjectWidth = (step?: number) => {
  if (currentObjectWidth.value.length === 0) return
  $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectWidth(Number(currentObjectWidth.value) + (step ? step : 0))
}

const doSetCurrentObjectHeight = (step?: number) => {
  if (currentObjectHeight.value.length === 0) return
  $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectHeight(Number(currentObjectHeight.value) + (step ? step : 0))
}

const doSetCurrentObjectAngle = (step?: number) => {
  if (currentObjectAngle.value.length === 0) return
  $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAngle(Number(currentObjectAngle.value) + (step ? step : 0))
}
</script>
