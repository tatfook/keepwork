import _ from 'lodash'
import Vue from 'vue'

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS'
const GET_ALL_WEBSITE_SUCCESS = 'GET_ALL_WEBSITE_SUCCESS'
const GET_SITE_DATASOURCE_SUCCESS = 'GET_SITE_DATASOURCE_SUCCESS'
const CREATE_COMMENT_SUCCESS = 'CREATE_COMMENT_SUCCESS'
const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS'
const GET_COMMENTS_BY_PAGE_URL_SUCCESS = 'GET_COMMENTS_BY_PAGE_URL_SUCCESS'
const GET_SITE_DETAIL_INFO_SUCCESS = 'GET_SITE_DETAIL_INFO_SUCCESS'
const GET_CONTRIBUTED_WEBSITE_SUCCESS = 'GET_CONTRIBUTED_WEBSITE_SUCCESS'
const UPSERT_WEBSITE_SUCCESS = 'UPSERT_WEBSITE_SUCCESS'
const GET_WEB_TEMPLATE_CONFIG_SUCCESS = 'GET_WEB_TEMPLATE_CONFIG_SUCCESS'
const GET_WEB_TEMPLATE_FILELIST_SUCCESS = 'GET_WEB_TEMPLATE_FILELIST_SUCCESS'
const GET_WEB_TEMPLATE_FILE_SUCCESS = 'GET_WEB_TEMPLATE_FILE_SUCCESS'
const SET_PAGE_STAR_DETAIL = 'SET_PAGE_STAR_DETAIL'
const GET_SITE_LAYOUT_CONFIG_SUCCESS = 'GET_SITE_LAYOUT_CONFIG_SUCCESS'
const SAVE_SITE_LAYOUT_CONFIG_SUCCESS = 'SAVE_SITE_LAYOUT_CONFIG_SUCCESS'
const GET_FROM_SKY_DRIVE_SUCCESS = 'GET_FROM_SKY_DRIVE_SUCCESS'

export const props = {
  LOGIN_SUCCESS,
  GET_PROFILE_SUCCESS,
  GET_ALL_WEBSITE_SUCCESS,
  GET_SITE_DATASOURCE_SUCCESS,
  CREATE_COMMENT_SUCCESS,
  DELETE_COMMENT_SUCCESS,
  GET_COMMENTS_BY_PAGE_URL_SUCCESS,
  GET_SITE_DETAIL_INFO_SUCCESS,
  GET_CONTRIBUTED_WEBSITE_SUCCESS,
  UPSERT_WEBSITE_SUCCESS,
  GET_WEB_TEMPLATE_CONFIG_SUCCESS,
  GET_WEB_TEMPLATE_FILELIST_SUCCESS,
  GET_WEB_TEMPLATE_FILE_SUCCESS,
  SET_PAGE_STAR_DETAIL,
  GET_SITE_LAYOUT_CONFIG_SUCCESS,
  SAVE_SITE_LAYOUT_CONFIG_SUCCESS,
  GET_FROM_SKY_DRIVE_SUCCESS
}

const doNothing = state => {
  // nothing todo with
}

const mutations = {
  [LOGIN_SUCCESS](state, payload) {
    Vue.set(state, 'info', payload)
  },
  [GET_PROFILE_SUCCESS](state, payload) {
    Vue.set(state, 'profile', payload)
  },
  [GET_ALL_WEBSITE_SUCCESS](state, {username, list}) {
    Vue.set(state, 'website', {
      ...state.website,
      [username]: _.keyBy(list, 'name')
    })
  },
  [GET_CONTRIBUTED_WEBSITE_SUCCESS](state, {username, list}) {
    let targetList = list.map(({siteinfo, siteuser}) => ({
      ...siteinfo,
      ...siteuser,
      _id: siteinfo._id,
      rootPath: `${siteinfo.username}/${siteinfo.name}`,
      projectId: siteinfo.dataSource.projectId
    }))
    Vue.set(state, 'contributedWebsite', {
      ...state.siteDataSource,
      [username]: _.keyBy(targetList, 'rootPath')
    })
  },
  [GET_SITE_DATASOURCE_SUCCESS](state, {username, list}) {
    Vue.set(state, 'siteDataSource', {
      ...state.siteDataSource,
      [username]: _.keyBy(list, 'sitename')
    })
  },
  [CREATE_COMMENT_SUCCESS]: doNothing,
  [DELETE_COMMENT_SUCCESS]: doNothing,
  [UPSERT_WEBSITE_SUCCESS]: doNothing,
  [GET_COMMENTS_BY_PAGE_URL_SUCCESS](state, {url, commentList}) {
    Vue.set(state, 'comments', {
      ...state.comments,
      [url]: commentList
    })
  },
  [GET_SITE_DETAIL_INFO_SUCCESS](state, {username, sitename, detailInfo}) {
    Vue.set(state, 'siteDetailInfo', {
      ...state.siteDetailInfo,
      [`${username}/${sitename}`]: detailInfo
    })
  },
  [GET_WEB_TEMPLATE_CONFIG_SUCCESS](state, {config}) {
    Vue.set(state, 'webTemplateConfig', config)
  },
  [GET_WEB_TEMPLATE_FILELIST_SUCCESS](state, {webTemplate, fileList}) {
    Vue.set(webTemplate, 'fileList', fileList)
  },
  [GET_WEB_TEMPLATE_FILE_SUCCESS](state, {file, content}) {
    Vue.set(file, 'content', content)
  },
  [SET_PAGE_STAR_DETAIL](state, { starred, starredCount }) {
    Vue.set(state, 'activePageStarInfo', { starred, starredCount })
  },
  [GET_SITE_LAYOUT_CONFIG_SUCCESS](state, { sitePath, config }) {
    Vue.set(state, 'siteLayoutConfigs', {
      ...state.siteLayoutConfigs,
      [sitePath]: config
    })
  },
  [SAVE_SITE_LAYOUT_CONFIG_SUCCESS](state, { sitePath, config }) {
    Vue.set(state, 'siteLayoutConfigs', {
      ...state.siteLayoutConfigs,
      [sitePath]: config
    })
  },
  [GET_FROM_SKY_DRIVE_SUCCESS](state, payload) {
    let { username } = payload
    Vue.set(state, 'skyDrive', {
      ...state.skyDrive,
      [username]: {
        ..._.get(state, ['skyDrive', username]),
        ...payload
      }
    })
  }
}

export default mutations
