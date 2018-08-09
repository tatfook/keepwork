import { lesson } from '@/api'
import { props } from './mutations'

let {
  GET_PACKAGE_DETAIL_SUCCESS,
  GET_LESSON_CONTENT_SUCCESS,
  GET_USER_SUBSCRIBES,
  GET_USER_SKILLS,
  ENTER_CLASSROOM,
  SET_ENTER_CLASS_ID
} = props

const actions = {
  async getPackageDetail({ commit }, { packageId }) {
    let detail = await lesson.packages.packageDetail({
      id: packageId
    })
    commit(GET_PACKAGE_DETAIL_SUCCESS, { detail })
  },
  async getLessonContent({ commit }, { lessonId }) {
    let content = await lesson.getLessonContent({ lessonId })
    commit(GET_LESSON_CONTENT_SUCCESS, { lessonId, content })
  },
  async subscribePackage({ context }, { packageId }) {
    let subscribeResult = await lesson.packages.subscribe({
      id: packageId
    })
    return subscribeResult
  },
  async getUserSubscribes({ commit }, { userId }) {
    let userSubscribeList = await lesson.users.userSubscribes({ userId })
    commit(GET_USER_SUBSCRIBES, { userSubscribeList })
  },
  async getUserSkills({ commit }, { userId }) {
    let userSkillsList = await lesson.users.userSkills({ userId })
    commit(GET_USER_SKILLS, { userSkillsList })
  },
  async enterClassRoom({ commit }, { key }) {
    let enterClassInfo = await lesson.classrooms.join({ key })
    commit(ENTER_CLASSROOM, { enterClassInfo })
  },
  setEnterClassID({ commit }, { key }) {
    commit(SET_ENTER_CLASS_ID, { key })
  }
}
export default actions
