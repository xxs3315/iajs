<template>
  <div
    class="grow flex"
    data-hs-layout-splitter='{
      "verticalSplitterTemplate": "<div><span class=\"absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 block w-6 h-4 flex justify-center items-center bg-white border border-gray-200 text-gray-400 rounded-md cursor-row-resize hover:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-600 dark:hover:bg-neutral-900\"><svg class=\"shrink-0 size-3.5\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"9\" r=\"1\"/><circle cx=\"19\" cy=\"9\" r=\"1\"/><circle cx=\"5\" cy=\"9\" r=\"1\"/><circle cx=\"12\" cy=\"15\" r=\"1\"/><circle cx=\"19\" cy=\"15\" r=\"1\"/><circle cx=\"5\" cy=\"15\" r=\"1\"/></svg></span></div>",
      "verticalSplitterClasses": "relative flex border-t border-gray-200 dark:border-neutral-700"
    }'
  >
    <div
      class="flex flex-col grow border border-gray-200 rounded-lg dark:border-neutral-700 w-full"
      data-hs-layout-splitter-vertical-group=""
    >
      <div
        class="overflow-hidden"
        data-hs-layout-splitter-item='{
          "dynamicSize": 15.0,
          "minSize": 10.0
        }'
        style='{
            "flex": 15 1 0px,
          }'
      >
        <div class="flex items-start justify-center h-full p-0.5 text-gray-800 dark:text-neutral-200">
          <RightTop />
        </div>
      </div>
      <div
        class="overflow-hidden"
        data-hs-layout-splitter-item='{
          "dynamicSize": 35.0,
          "minSize": 20.0
        }'
        style='{
            "flex": 35 1 0px,
          }'
      >
        <div
          class="flex items-start justify-center h-full p-3 text-gray-800 dark:text-neutral-200 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          <RightCenter />
        </div>
      </div>
      <div
        class="overflow-auto w-full h-full"
        data-hs-layout-splitter-item='{
          "dynamicSize": 50.0,
          "minSize": 20.0
        }'
        style='{
      "flex": 50 1 0px,
      }'
      >
        <div
          class="flex items-start justify-start h-full w-full p-0.5 text-gray-800 dark:text-neutral-200 overflow-auto"
        >
          <RightBottom />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { watchEffect } from 'vue'
import RightTop from './RightTop.vue'
import RightBottom from './RightBottom.vue'
import RightCenter from './RightCenter.vue'

watchEffect(() => {
  const loadPreline = async () => {
    const layoutSplitter = await import('@preline/layout-splitter')
    const HSLayoutSplitter = layoutSplitter.default

    window.HSStaticMethods.autoInit()
    HSLayoutSplitter.autoInit()
  }
  loadPreline()
})
</script>
