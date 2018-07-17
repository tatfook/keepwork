import * as qiniu from 'qiniu-js'
import storage from './storage'
import uuid from 'uuid/v1'

export const qiniuUpload = async (options) => {
  let result = await new Promise((resolve, reject) => {
    let {file, key, token, putExtra, config, onProgress} = options
    let subscription
    let observable = qiniu.upload(file, key, token, putExtra, config)
    let observer = {
      next: ({total}) => onProgress && onProgress(total),
      error(err) {
        reject(err)
        subscription && subscription.unsubscribe()
      },
      complete: resolve
    }
    subscription = observable.subscribe(observer)
    options.onStart && options.onStart(subscription)
  })
  return result
}

export const getFileContent = async file => {
  let content = await new Promise((resolve, reject) => {
    let fileReader = new FileReader()
    fileReader.onload = () => resolve(fileReader.result)
    fileReader.onerror = fileReader.onabort = reject
    fileReader.readAsDataURL(file)
  })
  return content
}

export const getFileExtension = (filename = '') =>
  filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()

export const getFileKey = file => {
  let fileID = uuid()
  let fileExt = getFileExtension(file.name)
  return `${fileID}.${fileExt}`
}

export const upload = async ({file, onStart, onProgress}, authRequestConfig) => {
  let key = getFileKey(file)
  let { token } = await storage.files.token({ key }, authRequestConfig)

  let config = { region: qiniu.region.z2 }
  let putExtra = { params: { 'x:filename': file.name } }
  await qiniuUpload({file, token, key, onStart, onProgress, config, putExtra})
  return { key, filename: file.name, size: file.size }
}

export const remove = async ({file: { id }}, authRequestConfig) => {
  await storage.files.delete({ id }, authRequestConfig)
}

export const list = async (payload, authRequestConfig) => {
  let filelist = await storage.files.list(payload, authRequestConfig)
  return filelist
}

export const info = async (payload, authRequestConfig) => {
  let info = await storage.files.statistics(payload, authRequestConfig)
  return info
}

export const changeFileName = async ({key, filename}, authRequestConfig) => {
  await storage.files.update({key, filename}, authRequestConfig)
}

export const useFileInSite = async ({userId, siteId, fileId}, authRequestConfig) => {
  let url = await storage.siteFiles.url({userId, siteId, fileId}, authRequestConfig)
  return url
}

export default {
  upload,
  remove,
  list,
  info,
  changeFileName,
  useFileInSite
}
