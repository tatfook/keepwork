import * as qiniu from 'qiniu-js'
import keepwork from './keepwork'
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

// export const getFileMD5 = async file => {
//   let content = await getFileContent(file)
//   return md5(content)
// }

export const getFileExtension = (filename = '') =>
  filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()

export const getFileKey = file => {
  let fileID = uuid()
  let fileExt = getFileExtension(file.name)
  return `${fileID}.${fileExt}`
}

export const getTokenAndUid = async authRequestConfig => {
  let { uid } = await keepwork.qiniu.getUid(null, authRequestConfig)
  let returnOriginalData = true
  let { uptoken: token } = await keepwork.qiniu.uploadToken(null, authRequestConfig, returnOriginalData)
  return { token, uid }
}

export const upload = async ({file, onProgress}, authRequestConfig) => {
  let { token, uid } = await getTokenAndUid(authRequestConfig)
  let key = getFileKey(file)
  let config = { region: qiniu.region.z2 }
  let putExtra = { params: { 'x:uid': uid } }
  let { hash } = await qiniuUpload({file, token, key, onProgress, config, putExtra})

  let result = await keepwork.bigfile.upload({
    filename: file.name,
    domain: 'ov62qege8.bkt.clouddn.com', // seems useless
    key,
    size: file.size,
    type: file.type,
    hash: hash,
    channel: 'qiniu'
  }, authRequestConfig)

  let { _id } = result
  let downloadUrl = await keepwork.bigfile.getDownloadUrlById({ _id })
  return downloadUrl
}

export const remove = async ({file: { _id }}, authRequestConfig) => {
  await keepwork.bigfile.deleteById({_id}, authRequestConfig)
}

export const list = async (payload, authRequestConfig) => {
  let { filelist } = await keepwork.bigfile.getByUsername(payload, authRequestConfig)
  return filelist
}

export const info = async (payload, authRequestConfig) => {
  let info = await keepwork.bigfile.getUserStoreInfo(payload, authRequestConfig)
  return info
}

export const changeFileName = async ({_id, filename}, authRequestConfig) => {
  await keepwork.bigfile.changeFilename({_id, filename}, authRequestConfig)
}

export default {
  upload,
  remove,
  list,
  info,
  changeFileName
}
