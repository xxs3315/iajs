<script lang="tsx">
import { defineComponent, ref, watch } from 'vue'
import { listenKeys } from 'nanostores'
import { $iajsStore } from '../../store/Iajs'

type TreeNode = {
  id: string
  name: string
  type: string
  v: boolean
  evt: boolean
  svg: string
  lvl: number
  children?: TreeNode[]
}

export default defineComponent({
  name: 'RightBottom',
  props: {},
  setup() {
    const currentObjects = ref<TreeNode[] | undefined>(undefined)

    listenKeys($iajsStore, ['currentObjects'], (value, oldValue, changed) => {
      currentObjects.value = value.currentObjects as any
    })

    watch(
      () => currentObjects.value,
      () => {
        const loadPreline = async () => {
          window.HSStaticMethods.autoInit()
        }
        loadPreline()
      },
    )

    const handleNodeEvented = (id: string, evt: boolean) => {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttrs(id, {
        evented: !evt,
        selectable: !evt,
        hasControls: !evt,
      })
    }

    const handleNodeVisible = (id: string, v: boolean) => {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectAttr(id, 'visible', !v)
    }

    const handleNodeClick = (id: string) => {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.setActiveObjectById(id)
    }

    const assembly = (item: TreeNode) => {
      const isDir = !!item.children
      return (
        <>
          <div
            key={item.id}
            class={`hs-accordion active ${item.lvl > 0 ? 'pl-5' : ''}`}
            role="treeitem"
            aria-expanded="true"
            id={item.id}
            data-hs-tree-view-item={`{ "value": "${item.name}", "isDir": ${isDir} }`}
          >
            <div
              class="hs-accordion-heading flex items-center justify-between hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                if (item.lvl > 0) return
              }}
            >
              <button
                class={`${!isDir ? 'invisible' : ''} hs-accordion-toggle flex-none`}
                aria-expanded="true"
                aria-controls={`hs-cco-collapse-${item.id}`}
              >
                <svg
                  class="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M5 12h14" />
                  <path class="hs-accordion-active:hidden block" d="M12 5v14" />
                </svg>
              </button>
              <div class="flex-1 grow" onClick={() => handleNodeClick(item.id)}>
                {item.name}
              </div>
              <div class={`${item.lvl > 0 ? 'hidden' : ''} flex-none w-9 flex justify-start items-center`}>
                <button class="" onClick={() => handleNodeEvented(item.id, item.evt)}>
                  {item.evt && (
                    <svg
                      class="shrink-0 size-4 text-gray-200 hover:text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M18 20V10H6v10zm0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h9V6a3 3 0 0 0-3-3a3 3 0 0 0-3 3H7a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6 9a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2"
                      />
                    </svg>
                  )}
                  {!item.evt && (
                    <svg
                      class="shrink-0 size-4 text-gray-700 hover:text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12 17a2 2 0 0 1-2-2c0-1.11.89-2 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2m6 3V10H6v10zm0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.11.89-2 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"
                      />
                    </svg>
                  )}
                </button>
                <button class="" onClick={() => handleNodeVisible(item.id, item.v)}>
                  {item.v && (
                    <svg
                      class="shrink-0 size-4 text-gray-200 hover:text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
                      />
                    </svg>
                  )}
                  {!item.v && (
                    <svg
                      class="shrink-0 size-4 text-gray-700 hover:text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.8 11.8 0 0 1-4 5.19l-1.42-1.43A9.86 9.86 0 0 0 20.82 12A9.82 9.82 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.82 9.82 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {isDir && (
              <div
                key={`hs-cco-collapse-${item.id}`}
                id={`hs-cco-collapse-${item.id}`}
                class={`hs-accordion-content overflow-hidden transition-[height] duration-300`}
                role="group"
                aria-labelledby={item.id}
              >
                {item.children?.map((subItem: any, index: number) => {
                  if (subItem.children) {
                    return assembly(subItem)
                  } else {
                    return (
                      <div
                        key={`${subItem.id}-${index}`}
                        role="treeitem"
                        class="pl-9 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                        data-hs-tree-view-item={`{ "value": "${subItem.name}" }`}
                      >
                        <div class="flex-1 grow">{subItem.name}</div>
                        <div class={`${subItem.lvl > 0 ? 'hidden' : ''} flex-none w-9 flex justify-start items-center`}>
                          <button class="" onClick={() => handleNodeEvented(subItem.id, subItem.evt)}>
                            {subItem.evt && (
                              <svg
                                class="shrink-0 size-4 text-gray-200 hover:text-gray-700"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M18 20V10H6v10zm0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h9V6a3 3 0 0 0-3-3a3 3 0 0 0-3 3H7a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6 9a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2"
                                />
                              </svg>
                            )}
                            {!subItem.evt && (
                              <svg
                                class="shrink-0 size-4 text-gray-700 hover:text-gray-700"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M12 17a2 2 0 0 1-2-2c0-1.11.89-2 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2m6 3V10H6v10zm0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.11.89-2 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"
                                />
                              </svg>
                            )}
                          </button>
                          <button class="" onClick={() => handleNodeVisible(subItem.id, subItem.v)}>
                            {subItem.v && (
                              <svg
                                class="shrink-0 size-4 text-gray-200 hover:text-gray-700"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
                                />
                              </svg>
                            )}
                            {!subItem.v && (
                              <svg
                                class="shrink-0 size-4 text-gray-700 hover:text-gray-700"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.8 11.8 0 0 1-4 5.19l-1.42-1.43A9.86 9.86 0 0 0 20.82 12A9.82 9.82 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.82 9.82 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            )}
          </div>
        </>
      )
    }

    return () => (
      <div
        role="tree"
        aria-orientation="vertical"
        class="bg-white h-full w-full grow rounded p-1 dark:bg-neutral-900 text-sm"
        data-hs-tree-view
      >
        {currentObjects.value?.map((item) => {
          return assembly(item)
        })}
      </div>
    )
  },
})
</script>
