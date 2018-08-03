import { lesson } from '@/api'
import { props } from './mutations'

let { GET_PACKAGE_DETAIL_SUCCESS, GET_LESSON_CONTENT_SUCCESS } = props

const actions = {
  async getPackageDetail({ commit }, { packageId }) {
    let detail = await lesson.packages.packageDetail({
      id: packageId
    })
    commit(GET_PACKAGE_DETAIL_SUCCESS, { detail })
  },
  async getLessonContent({ commit }, { lessonId }) {
    let content = await lesson.getLessonContent({ lessonId })
    commit(GET_LESSON_CONTENT_SUCCESS, {lessonId, content})
  },
  async subscribePackage({ context }, { packageId }) {
    let subscribeResult = await lesson.packages.subscribe({
      id: packageId
    })
    return subscribeResult
  }

const actions = {

}

export default actions
