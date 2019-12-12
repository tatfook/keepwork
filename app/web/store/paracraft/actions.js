import _ from 'lodash'
import axios from 'axios'
import { paracraft } from '@/api'
import { props } from './mutations'
import { Message } from 'element-ui'

let { GET_CLASSIFIES_SUCCESS, GET_SYSTEM_COMPS_SUCCESS, GET_ORG_LIST_SUCCESS } = props

const errMsg = {
  0: '失败,未知错误',
  1: '邀请码已失效',
  2: '无效的邀请码',
  3: '班级已结束',
  4: '班级未开始',
  5: '人数已达上限',
  6: '已经是该班级的学生',
  7: '不是该机构的邀请码',
}

const actions = {
  async getSystemClassifies({ commit }) {
    let result = await paracraft.pBlocks.getClassifies()
    commit(GET_CLASSIFIES_SUCCESS, result)
  },
  async getSystemComps({ commit }, params) {
    let result = await paracraft.pBlocks.getCopms(params)
    commit(GET_SYSTEM_COMPS_SUCCESS, result)
  },
  async updateUsedCount(state, { id }) {
    await paracraft.pBlocks.updateUsedCount({ id })
  },
  async useCompToParacraft({ dispatch }, { port, fileType, fileName, downloadUrl, id }) {
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
  },
  async getUserOrgList({ commit }) {
    const orgList = await paracraft.org.getOrganizationList()
    commit(GET_ORG_LIST_SUCCESS, orgList)
  },
  async runParacraftCMD({ getters: { paracraftPORT } }, cmd) {
    const paracraftBaseUrl = `http://127.0.0.1:${paracraftPORT}/ajax/console?action=runcode`
    await axios
      .post(paracraftBaseUrl, { text: `cmd("${cmd}")` })
      .then(() => {})
      .catch(error => {
        return Promise.reject(error)
      })
  },
  async openLink({ dispatch }, { link, isProtocolType }) {
    const cmd = `/open ${link}`
    if (isProtocolType) {
      window.location.href = `paracraft://cmd(${cmd})`
      return
    }
    await dispatch('runParacraftCMD', cmd)
  },
  async joinOrg({ dispatch }, params) {
    try {
      await paracraft.org.joinOrganization(params)
      dispatch('getUserOrgList')
      Message({ type: 'success', message: '加入成功！', offset: 80 })
      return true
    } catch (error) {
      const code = _.get(error, 'response.data.code', 0)
      const message = _.get(errMsg, code, '')
      Message({ type: 'error', message, offset: 80 })
      return false
    }
  },
}

export default actions
