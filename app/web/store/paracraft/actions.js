import _ from 'lodash'
import axios from 'axios'
import { paracraft } from '@/api'
import { props } from './mutations'

let { GET_CLASSIFIES_SUCCESS, GET_SYSTEM_COMPS_SUCCESS } = props

const actions = {
  async getSystemClassifies({ commit }) {
    let result = await paracraft.pBlocks.getClassifies()
    commit(GET_CLASSIFIES_SUCCESS, result)
  },
  async getSystemComps({ commit }) {
    let result = await paracraft.pBlocks.getCopms()
    commit(GET_SYSTEM_COMPS_SUCCESS, result)
  },
  async updateUsedCount(state, { id }) {
    await paracraft.pBlocks.updateUsedCount({ id })
  },
  async useCompToParacraft(
    { dispatch },
    { port, fileType, fileName, downloadUrl, id }
  ) {
    fileType = _.lowerCase(fileType)
    let paracraftBaseUrl = `http://127.0.0.1:${port}/ajax/console?action=runcode&text=cmd("/install -ext ${fileType} -filename ${fileName} ${downloadUrl}")`
    await axios
      .post(paracraftBaseUrl)
      .then(() => {
        dispatch('updateUsedCount', { id })
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

export default actions
