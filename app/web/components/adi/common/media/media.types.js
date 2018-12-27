import _ from 'lodash'

export const imageTypes = ['.png', '.jpg', '.jpeg', '.svg', '.bmp', '.webp', '.gif']
export const videoTypes = ['.mp4', '.mpg', '.mpeg', '.wmv', '.mov', '.avi']

export const isVideo = src => {
  if (typeof src !== 'string') {
    return false
  }

  if (src.length === 0) {
    return true
  }

  return videoTypes.findIndex(el => _.endsWith(src.toLocaleLowerCase(), el)) !== -1
}

export const isImage = src => {
  if (typeof src !== 'string') {
    return false
  }

  if (src.length === 0) {
    return true
  }

  return imageTypes.findIndex(el => _.endsWith(src.toLocaleLowerCase(), el)) !== -1
}

export default {
  imageTypes,
  videoTypes,
  isImage,
  isVideo
}
