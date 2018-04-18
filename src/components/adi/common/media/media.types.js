import _ from 'lodash'

export const imageTypes = ['.png', '.jpg', '.jpeg', '.svg']
export const videoTypes = ['.mp4']

export const isVideo = src => {
  return (
    src && videoTypes.findIndex(el => _.endsWith(src.toLowerCase(), el)) !== -1
  )
}

export const isImage = src => {
  if (src === '') {
    return true
  } else if (typeof (src) === 'string') {
    let isImageFile = src && imageTypes.findIndex(el => _.endsWith(src.toLowerCase(), el)) !== -1

    if (isImageFile) {
      return true
    } else {
      // base64 image
      let type = src.split(',')[0] ? src.split(',')[0] : ''

      if (type === 'data:image/png;base64' || type === 'data:image/jpeg;base64' || type === 'data:image/gif;base64') {
        return true
      } else {
        return false
      }
    }
  }
}

export const isBase64Svg = src => {
  if (typeof (src) === 'string') {
    let type = src.split(',')[0] ? src.split(',')[0] : ''

    if (type === 'data:image/svg+xml;base64') {
      return true
    } else {
      return false
    }
  }
}

export default {
  imageTypes,
  videoTypes,
  isImage,
  isVideo,
  isBase64Svg
}
