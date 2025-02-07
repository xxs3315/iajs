export function base64ToBlob(base64: string) {
  const type = base64.split(',')![0]!.match(/:(.*?);/)![1] //提取base64头的type如 'image/png'
  const bytes = window.atob(base64.split(',')[1]) //去掉url的头，并转换为byte (atob:编码 btoa:解码)

  const ia = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  const blob = new Blob([ia], { type: type })
  return blob
}
