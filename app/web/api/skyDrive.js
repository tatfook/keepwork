import * as qiniu from 'qiniu-js'
import storage from './storage'
import uuid from 'uuid/v1'
import Cookies from 'js-cookie'
import jsrsasign from 'jsrsasign'

let subscriptionObj = {}

export const qiniuUpload = async options => {
  let result = await new Promise((resolve, reject) => {
    let { file, key, token, putExtra, config, onProgress } = options
    let subscription
    let observable = qiniu.upload(file, key, token, putExtra, config)
    let observer = {
      next: ({ total }) => onProgress && onProgress(total),
      error(err) {
        reject(err)
        subscription && subscription.unsubscribe()
      },
      complete: resolve
    }
    subscription = observable.subscribe(observer)
    options.onStart && options.onStart(subscription)
    let filename = file.name
    subscriptionObj[filename] = subscription
  })
  return result
}

export const removeQiniuUpload = filename => {
  let removingSubscription = subscriptionObj[filename]
  removingSubscription && removingSubscription.unsubscribe()
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
  filename
    .split('.')
    .pop()
    .toLowerCase()

export const getFileKey = file => {
  const { userId } = jsrsasign.KJUR.jws.JWS.readSafeJSONString(
    jsrsasign.b64utoutf8(Cookies.get('token').split('.')[1])
  )
  let fileID = `${userId}-${uuid()}`
  let fileExt = getFileExtension(file.name)
  return `${fileID}.${fileExt}`
}

export const upload = async ({ file, filename, onStart, onProgress }) => {
  let key = getFileKey(file)
  let { token } = await storage.files.token({ key })
  filename = filename || file.name
  let config = { region: qiniu.region.z2 }
  let putExtra = { params: { 'x:filename': filename } }
  await qiniuUpload({ file, token, key, onStart, onProgress, config, putExtra })
  return { key, filename, size: file.size }
}

export const remove = async ({ file: { id } }) => {
  await storage.files.delete({ id })
}

export const list = async payload => {
  return storage.files.list(payload)
}

export const info = async payload => {
  return storage.files.statistics(payload)
}

export const changeFileName = async ({ key, filename }) => {
  await storage.files.update({ key, filename })
}

export const useFileInSite = async ({ userId, siteId, fileId }) => {
  return storage.siteFiles.url({ userId, siteId, fileId })
}

export const getFileRawUrl = async ({ fileId }) => {
  return storage.files.getRawUrl({ fileId })
}

export default {
  removeQiniuUpload,
  upload,
  remove,
  list,
  info,
  changeFileName,
  useFileInSite,
  getFileRawUrl
}
