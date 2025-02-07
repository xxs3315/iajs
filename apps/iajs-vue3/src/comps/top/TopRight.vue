<template>
  <div class="flex-none w-80 flex flex-row items-center justify-end">
    <button
      type="button"
      @click="() => handleToolClick(Mode.ZoomWidth)"
      class="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
    >
      <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M9 11h6V8l4 4l-4 4v-3H9v3l-4-4l4-4zm-7 9V4h2v16zm18 0V4h2v16z" />
      </svg>
    </button>
    <button
      type="button"
      @click="() => handleToolClick(Mode.ZoomHeight)"
      class="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
    >
      <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M13 9v6h3l-4 4l-4-4h3V9H8l4-4l4 4zM4 2h16v2H4zm0 18h16v2H4z" />
      </svg>
    </button>
    <button
      type="button"
      @click="() => handleToolClick(Mode.ZoomFull)"
      class="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
    >
      <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="m9.5 13.09l1.41 1.41l-4.5 4.5H10v2H3v-7h2v3.59zm1.41-3.59L9.5 10.91L5 6.41V10H3V3h7v2H6.41zm3.59 3.59l4.5 4.5V14h2v7h-7v-2h3.59l-4.5-4.5zM13.09 9.5l4.5-4.5H14V3h7v7h-2V6.41l-4.5 4.5z"
        />
      </svg>
    </button>
    <button
      type="button"
      @click="() => handleToolClick(Mode.ZoomOut)"
      class="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
    >
      <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 0 0 9.5 3A6.5 6.5 0 0 0 3 9.5A6.5 6.5 0 0 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5l1.5-1.5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5S14 7 14 9.5S12 14 9.5 14M7 9h5v1H7z"
        />
      </svg>
    </button>
    <div class="hs-dropdown relative [--placement:bottom] inline-flex mx-0.5 my-0.5">
      <button
        id="hs-dropdown-transform-style"
        type="button"
        class="hs-dropdown-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label="Dropdown"
      >
        {{ toFixed(currentZoomScale * 100) }}%
        <svg
          class="hs-dropdown-open:rotate-180 size-4"
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
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="hs-dropdown-transform-style"
      >
        <div
          class="hs-dropdown-open:ease-in hs-dropdown-open:opacity-100 hs-dropdown-open:scale-100 transition ease-out opacity-0 scale-95 duration-200 mt-0.5 origin-top-left min-w-20 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700"
        >
          <div class="p-1 space-y-0.5">
            <a
              v-for="item in canvasZoomPresets.reverse()"
              :key="item"
              class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
              href="#"
              @click="applyCanvasPresetScale(item)"
            >
              {{ item }}%
            </a>
          </div>
        </div>
      </div>
    </div>
    <button
      type="button"
      @click="() => handleToolClick(Mode.ZoomIn)"
      class="ml-0.5 mr-2 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
    >
      <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="m15.5 14l5 5l-1.5 1.5l-5-5v-.79l-.27-.28A6.47 6.47 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.57 4.23l.28.27zm-6 0C12 14 14 12 14 9.5S12 5 9.5 5S5 7 5 9.5S7 14 9.5 14m2.5-4h-2v2H9v-2H7V9h2V7h1v2h2z"
        />
      </svg>
    </button>
  </div>
</template>
<script setup lang="ts">
import { $iajsStore, Mode, ModeTypes } from '../../store/Iajs'
import { ref, watchEffect } from 'vue'
import { toFixed } from '../../utils/math'
import { listenKeys } from 'nanostores'

const currentZoomScale = ref<number>(1)

listenKeys($iajsStore, ['zoom'], (value, oldValue, changed) => {
  currentZoomScale.value = value.zoom
})
const canvasZoomPresets = [1000, 500, 200, 150, 100, 75, 50, 25]
const applyCanvasPresetScale = (value: number) => {
  $iajsStore.get().iajsAnnotationWorkspaceRef?.zoomToScale(toFixed(value / 100))
}

watchEffect(() => {
  const loadPreline = async () => {
    const preline = await import('preline/preline')
    const { HSDropdown } = preline

    window.HSStaticMethods.autoInit()
    HSDropdown.autoInit()
  }
  loadPreline()
})

const handleToolClick = (item: ModeTypes) => {
  if (item === Mode.ZoomFull) {
    $iajsStore.get().iajsAnnotationWorkspaceRef?.zoomFull()
  }
  if (item === Mode.ZoomWidth) {
    $iajsStore.get().iajsAnnotationWorkspaceRef?.zoomWidth()
  }
  if (item === Mode.ZoomHeight) {
    $iajsStore.get().iajsAnnotationWorkspaceRef?.zoomHeight()
  }
  if (item === Mode.ZoomIn) {
    $iajsStore.get().iajsAnnotationWorkspaceRef?.zoomIn()
  }
  if (item === Mode.ZoomOut) {
    $iajsStore.get().iajsAnnotationWorkspaceRef?.zoomOut()
  }
}
</script>
