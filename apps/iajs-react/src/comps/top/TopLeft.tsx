import { $iajsStore, Mode, ModeTypes } from '../../store/Iajs'

function TopLeft() {
  const handleToolClick = (item: ModeTypes) => {
    if (item === Mode.HorizontalLeft) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.alignHorizontalLeft()
    }
    if (item === Mode.HorizontalCenter) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.alignHorizontalCenter()
    }
    if (item === Mode.HorizontalRight) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.alignHorizontalRight()
    }
    if (item === Mode.VerticalTop) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.alignVerticalTop()
    }
    if (item === Mode.VerticalMiddle) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.alignVerticalMiddle()
    }
    if (item === Mode.VerticalBottom) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.alignVerticalBottom()
    }
    if (item === Mode.Group) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.group()
    }
    if (item === Mode.UnGroup) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.ungroup()
    }
    if (item === Mode.BringFront) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.bringFront()
    }
    if (item === Mode.BringForward) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.bringForward()
    }
    if (item === Mode.SendBackwards) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.sendBackwards()
    }
    if (item === Mode.SendBack) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.sendBack()
    }
    if (item === Mode.FlipX) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectFlipX()
    }
    if (item === Mode.FlipY) {
      $iajsStore.get().iajsAnnotationWorkspaceRef?.setObjectFlipY()
    }
  }

  return (
    <>
      <div className="grow overflow-hidden flex flex-row items-center justify-start">
        <button
          type="button"
          onClick={() => handleToolClick(Mode.HorizontalLeft)}
          className="ml-2 mr-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M4 22H2V2h2zM22 7H6v3h16zm-6 7H6v3h10z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.HorizontalCenter)}
          className="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M11 2h2v5h8v3h-8v4h5v3h-5v5h-2v-5H6v-3h5v-4H3V7h8z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.HorizontalRight)}
          className="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M20 2h2v20h-2zM2 10h16V7H2zm6 7h10v-3H8z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.VerticalTop)}
          className="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M22 2v2H2V2zM7 22h3V6H7zm7-6h3V6h-3z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.VerticalMiddle)}
          className="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M22 11h-5V6h-3v5h-4V3H7v8H1.8v2H7v8h3v-8h4v5h3v-5h5z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.VerticalBottom)}
          className="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M22 22H2v-2h20zM10 2H7v16h3zm7 6h-3v10h3z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.BringFront)}
          className="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M7.41 18.41L6 17l6-6l6 6l-1.41 1.41L12 13.83zm0-6L6 11l6-6l6 6l-1.41 1.41L12 7.83z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.BringForward)}
          className="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.SendBackwards)}
          className="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.SendBack)}
          className="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M16.59 5.59L18 7l-6 6l-6-6l1.41-1.41L12 10.17zm0 6L18 13l-6 6l-6-6l1.41-1.41L12 16.17z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.Group)}
          className="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M1 1v4h1v14H1v4h4v-1h14v1h4v-4h-1V5h1V1h-4v1H5V1m0 3h14v1h1v14h-1v1H5v-1H4V5h1m1 1v8h3v4h9V9h-4V6M8 8h4v4H8m6-1h2v5h-5v-2h3"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.UnGroup)}
          className="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M2 2h4v1h7V2h4v4h-1v3h2V8h4v4h-1v6h1v4h-4v-1h-6v1H8v-4h1v-2H6v1H2v-4h1V6H2zm16 10v-1h-2v2h1v4h-4v-1h-2v2h1v1h6v-1h1v-6zm-5-6V5H6v1H5v7h1v1h3v-2H8V8h4v1h2V6zm-1 6h-1v2h2v-1h1v-2h-2z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.FlipX)}
          className="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M15 21h2v-2h-2m4-10h2V7h-2M3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2m16-2v2h2c0-1.1-.9-2-2-2m-8 20h2V1h-2m8 16h2v-2h-2M15 5h2V3h-2m4 10h2v-2h-2m0 10c1.1 0 2-.9 2-2h-2Z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleToolClick(Mode.FlipY)}
          className="mx-0.5 my-0.5 flex shrink-0 justify-center items-center gap-2 size-[24px] text-sm font-medium rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M3 15v2h2v-2m10 4v2h2v-2m2-16H5c-1.1 0-2 .9-2 2v4h2V5h14v4h2V5c0-1.1-.9-2-2-2m2 16h-2v2c1.1 0 2-.9 2-2M1 11v2h22v-2M7 19v2h2v-2m10-4v2h2v-2m-10 4v2h2v-2M3 19c0 1.1.9 2 2 2v-2Z"
            />
          </svg>
        </button>
      </div>
    </>
  )
}

export default TopLeft
