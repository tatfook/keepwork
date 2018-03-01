import _ from 'lodash'

export const imageTypes = ['.png', '.jpg', '.jpeg', '.svg']

export const videoTypes = ['.mp4']

export const isVideo = src => {
  return videoTypes.findIndex(el => _.endsWith(src.toLowerCase(), el)) !== -1
}

export const isImage = src => {
  return imageTypes.findIndex(el => _.endsWith(src.toLowerCase(), el)) !== -1
}

export default {
  imageTypes,
  videoTypes,
  isImage,
  isVideo
}
