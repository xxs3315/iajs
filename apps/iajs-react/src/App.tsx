import React, { useEffect, useState } from 'react'
import './App.css'
import Uploader from './comps/Uploader'
import { IStaticMethods } from 'preline/preline'
import Dropzone from 'dropzone'
import _ from 'lodash'
import Main from './comps/Main'

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods
    Dropzone: typeof Dropzone
    _: typeof _
  }
}

const App = (props: any): any => {
  const [base64, setBase64] = useState('')

  const [img, setImg] = useState({ base64: '', width: 0, height: 0 })

  useEffect(() => {
    const loadPreline = async () => {
      const preline = await import('preline/preline')
      const fileUpload = await import('@preline/file-upload')
      const HSFileUpload = fileUpload.default

      // Import Preline Components here
      const { HSDropdown } = preline

      const dropzoneImport = (await import('dropzone')).default
      const lodashImport = (await import('lodash')).default
      window.Dropzone = dropzoneImport
      window._ = lodashImport

      window.HSStaticMethods.autoInit()
      HSDropdown.autoInit()
      HSFileUpload.autoInit()
    }
    loadPreline()
  }, [])

  const getBase64 = (base64: string) => {
    setBase64(base64)
    const image = new Image()
    image.src = base64
    image.onload = () => {
      setImg({
        base64: base64,
        width: image.width,
        height: image.height,
      })
    }
  }

  return (
    <>
      {base64.length === 0 && (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Uploader callback={getBase64} />
        </div>
      )}
      {base64.length > 0 && (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Main image={img} />
        </div>
      )}
    </>
  )
}

export default App
