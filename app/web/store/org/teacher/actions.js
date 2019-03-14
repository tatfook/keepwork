import { props } from './mutations'
import { keepwork } from '@/api'
const { lessonOrganizations: orgApi } = keepwork

const {
  GET_ORG_CLASSES_SUCCESS
} = props

const actions = {
  async getOrgClasses({ commit }) {
    const classes = await orgApi.getOrgClasses()
    commit(GET_ORG_CLASSES_SUCCESS, classes)
  }
}

export default actions