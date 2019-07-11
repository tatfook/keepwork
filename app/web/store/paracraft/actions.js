import _ from 'lodash'
import { paracraft } from '@/api'
import { props } from './mutations'

let { GET_CLASSIFIES_SUCCESS, GET_SYSTEM_COMPS_SUCCESS } = props

const actions = {
  async getSystemClassifies({ commit }) {
    let result = await paracraft.pBlocks.getClassifies()
    commit(GET_CLASSIFIES_SUCCESS, result)
  },
  async getSystemComps({ commit }, { seachContent }) {
    let filterParams = seachContent
      ? `id-op=${seachContent}&name-op=${seachContent}`
      : ''
    let result = await paracraft.pBlocks.getCopms({ filterParams })
    commit(GET_SYSTEM_COMPS_SUCCESS, result)
  }
}

export default actions
