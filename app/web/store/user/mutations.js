import _ from 'lodash'
import Vue from 'vue'

const TOGGLE_LOGIN_DIALOG = 'TOGGLE_LOGIN_DIALOG'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGOUT = 'LOGOUT'
const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS'
const SET_REAL_AUTH_PHONE_NUM = 'SET_REAL_AUTH_PHONE_NUM'
const GET_ALL_WEBSITE_SUCCESS = 'GET_ALL_WEBSITE_SUCCESS'
const GET_USER_DETAIL_SUCCESS = 'GET_USER_DETAIL_SUCCESS'
const GET_USER_DETAIL_WITH_RANK_SUCCESS = 'GET_USER_DETAIL_WITH_RANK_SUCCESS'
const GET_SITE_DATASOURCE_SUCCESS = 'GET_SITE_DATASOURCE_SUCCESS'
const CREATE_COMMENT_SUCCESS = 'CREATE_COMMENT_SUCCESS'
const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS'
const GET_COMMENTS_BY_PAGE_URL_SUCCESS = 'GET_COMMENTS_BY_PAGE_URL_SUCCESS'
const GET_SITE_DETAIL_INFO_SUCCESS = 'GET_SITE_DETAIL_INFO_SUCCESS'
const GET_SITE_DETAIL_INFO_BY_ID_SUCCESS = 'GET_SITE_DETAIL_INFO_BY_ID_SUCCESS'
const GET_CONTRIBUTED_WEBSITE_SUCCESS = 'GET_CONTRIBUTED_WEBSITE_SUCCESS'
const UPSERT_WEBSITE_SUCCESS = 'UPSERT_WEBSITE_SUCCESS'
const GET_WEB_TEMPLATE_CONFIG_SUCCESS = 'GET_WEB_TEMPLATE_CONFIG_SUCCESS'
const GET_WEBPAGE_TEMPLATE_CONFIG_SUCCESS = 'GET_WEBPAGE_TEMPLATE_CONFIG_SUCCESS'
const GET_WEBPAGE_TEMPLATE_CONTENT_SUCCESS = 'GET_WEBPAGE_TEMPLATE_CONTENT_SUCCESS'
const GET_WEB_TEMPLATE_FILELIST_SUCCESS = 'GET_WEB_TEMPLATE_FILELIST_SUCCESS'
const GET_WEB_TEMPLATE_FILE_SUCCESS = 'GET_WEB_TEMPLATE_FILE_SUCCESS'
const SET_PAGE_STAR_DETAIL = 'SET_PAGE_STAR_DETAIL'
const GET_SITE_LAYOUT_CONFIG_SUCCESS = 'GET_SITE_LAYOUT_CONFIG_SUCCESS'
const UPDATE_SITE_MSG_SUCCESS = 'UPDATE_SITE_MSG_SUCCESS'
const GET_USER_PRIVILEGE_OF_SITE_SUCCESS = 'GET_USER_PRIVILEGE_OF_SITE_SUCCESS'
const GET_SITE_GROUP_SUCCESS = 'GET_SITE_GROUP_SUCCESS'
const GET_USER_GROUPS_SUCCESS = 'GET_USER_GROUPS_SUCCESS'
const SAVE_SITE_LAYOUT_CONFIG_SUCCESS = 'SAVE_SITE_LAYOUT_CONFIG_SUCCESS'
const GET_FROM_SKY_DRIVE_SUCCESS = 'GET_FROM_SKY_DRIVE_SUCCESS'
const GET_SITE_THEME_CONFIG_SUCCESS = 'GET_SITE_THEME_CONFIG_SUCCESS'
const SAVE_SITE_THEME_CONFIG_SUCCESS = 'SAVE_SITE_THEME_CONFIG_SUCCESS'
const USE_FILE_IN_SITE_SUCCESS = 'USE_FILE_IN_SITE_SUCCESS'
const GET_FILE_RAW_URL_SUCCESS = 'GET_FILE_RAW_URL_SUCCESS'
const GET_USER_THREE_SERVICES_SUCCESS = 'GET_USER_THREE_SERVICES_SUCCESS'
const SET_AUTH_CODE_INFO = 'SET_AUTH_CODE_INFO'

export const props = {
  TOGGLE_LOGIN_DIALOG,
  LOGIN_SUCCESS,
  LOGOUT,
  GET_PROFILE_SUCCESS,
  SET_REAL_AUTH_PHONE_NUM,
  GET_ALL_WEBSITE_SUCCESS,
  GET_USER_DETAIL_SUCCESS,
  GET_USER_DETAIL_WITH_RANK_SUCCESS,
  GET_SITE_DATASOURCE_SUCCESS,
  CREATE_COMMENT_SUCCESS,
  DELETE_COMMENT_SUCCESS,
  GET_COMMENTS_BY_PAGE_URL_SUCCESS,
  GET_SITE_DETAIL_INFO_SUCCESS,
  GET_SITE_DETAIL_INFO_BY_ID_SUCCESS,
  GET_CONTRIBUTED_WEBSITE_SUCCESS,
  UPSERT_WEBSITE_SUCCESS,
  GET_WEB_TEMPLATE_CONFIG_SUCCESS,
  GET_WEBPAGE_TEMPLATE_CONFIG_SUCCESS,
  GET_WEBPAGE_TEMPLATE_CONTENT_SUCCESS,
  GET_WEB_TEMPLATE_FILELIST_SUCCESS,
  GET_WEB_TEMPLATE_FILE_SUCCESS,
  SET_PAGE_STAR_DETAIL,
  GET_SITE_LAYOUT_CONFIG_SUCCESS,
  SAVE_SITE_LAYOUT_CONFIG_SUCCESS,
  UPDATE_SITE_MSG_SUCCESS,
  GET_USER_PRIVILEGE_OF_SITE_SUCCESS,
  GET_SITE_GROUP_SUCCESS,
  GET_USER_GROUPS_SUCCESS,
  GET_FROM_SKY_DRIVE_SUCCESS,
  SAVE_SITE_THEME_CONFIG_SUCCESS,
  GET_SITE_THEME_CONFIG_SUCCESS,
  USE_FILE_IN_SITE_SUCCESS,
  GET_FILE_RAW_URL_SUCCESS,
  GET_USER_THREE_SERVICES_SUCCESS,
  SET_AUTH_CODE_INFO
}

const doNothing = state => {
  // nothing todo with
}

const mutations = {
  [TOGGLE_LOGIN_DIALOG](state, status) {
    Vue.set(state, 'isShowLoginDialog', status)
  },
  [LOGIN_SUCCESS](state, profile) {
    // Vue.set(state, 'profile', { ...profile, token })
    Vue.set(state, 'profile', profile)
    Vue.set(state, 'tokenUpdateAt', Date.now())
  },
  [LOGOUT](state) {
    Vue.set(state, 'profile', {})
  },
  [GET_PROFILE_SUCCESS](state, payload) {
    Vue.set(state, 'profile', payload)
  },
  [SET_REAL_AUTH_PHONE_NUM](state, payload) {
    Vue.set(state, 'sendCodeInfo', payload)
  },
  [GET_ALL_WEBSITE_SUCCESS](state, { username, list }) {
    Vue.set(state, 'website', {
      ...state.website,
      [username]: _.keyBy(list, 'sitename')
    })
  },
  [GET_USER_DETAIL_SUCCESS](state, { userId, username, userDetail }) {
    Vue.set(state, 'usersDetail', {
      ...state.usersDetail,
      [userId]: userDetail,
      [username]: userDetail
    })
  },
  [GET_USER_DETAIL_WITH_RANK_SUCCESS](state, { userId, username, userDetailWithRank }) {
    Vue.set(state, 'usersDetailWithRank', {
      ...state.usersDetailWithRank,
      [userId]: userDetailWithRank,
      [username]: userDetailWithRank
    })
  },
  [GET_CONTRIBUTED_WEBSITE_SUCCESS](state, { username, list }) {
    let targetList = list.map(site => ({
      ...site,
      name: site.sitename,
      _id: site.id,
      rootPath: `${site.username}/${site.sitename}`
    }))
    // let targetList = list.map(({ siteinfo, siteuser }) => ({
    //   ...siteinfo,
    //   ...siteuser,
    //   _id: siteinfo._id,
    //   rootPath: `${siteinfo.username}/${siteinfo.name}`,
    //   projectId: siteinfo.dataSource.projectId
    // }))
    Vue.set(state, 'contributedWebsite', {
      // ...state.siteDataSource,
      [username]: _.keyBy(targetList, 'rootPath')
    })
  },
  [GET_SITE_DATASOURCE_SUCCESS](state, { username, list }) {
    Vue.set(state, 'siteDataSource', {
      ...state.siteDataSource,
      [username]: _.keyBy(list, 'sitename')
    })
  },
  [CREATE_COMMENT_SUCCESS]: doNothing,
  [DELETE_COMMENT_SUCCESS]: doNothing,
  [UPSERT_WEBSITE_SUCCESS](state, { site }) {
    Vue.set(state, 'newSiteInfo', site)
  },
  [GET_COMMENTS_BY_PAGE_URL_SUCCESS](state, { url, commentList, commentTotal }) {
    Vue.set(state, 'comments', {
      ...state.comments,
      [url]: { commentList, commentTotal }
    })
  },
  [GET_SITE_DETAIL_INFO_SUCCESS](state, { username, sitename, detailInfo }) {
    Vue.set(state, 'siteDetailInfo', {
      ...state.siteDetailInfo,
      [`${username}/${sitename}`]: {
        siteinfo: _.get(detailInfo, 'site', {}),
        userinfo: _.get(detailInfo, 'user', {})
      }
    })
  },
  [GET_SITE_DETAIL_INFO_BY_ID_SUCCESS](state, { siteId, detailInfo }) {
    Vue.set(state, 'siteDetailInfoById', {
      ...state.siteDetailInfoById,
      [siteId]: detailInfo
    })
  },
  [GET_WEB_TEMPLATE_CONFIG_SUCCESS](state, { config }) {
    Vue.set(state, 'webTemplateConfig', config)
  },
  [GET_WEBPAGE_TEMPLATE_CONFIG_SUCCESS](state, { config }) {
    Vue.set(state, 'webPageTemplateConfig', config)
  },
  [GET_WEBPAGE_TEMPLATE_CONTENT_SUCCESS](state, { template, content }) {
    Vue.set(template, 'content', content)
  },
  [GET_WEB_TEMPLATE_FILELIST_SUCCESS](state, { webTemplate, fileList }) {
    Vue.set(webTemplate, 'fileList', fileList)
  },
  [GET_WEB_TEMPLATE_FILE_SUCCESS](state, { file, content }) {
    Vue.set(file, 'content', content)
  },
  [GET_SITE_GROUP_SUCCESS](state, { siteId, groups }) {
    Vue.set(state, 'sitesGroups', {
      ...state.sitesGroups,
      [siteId]: groups
    })
  },
  [GET_USER_GROUPS_SUCCESS](state, { groups }) {
    Vue.set(state, 'userGroups', groups)
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
  [GET_SITE_THEME_CONFIG_SUCCESS](state, { sitePath, config }) {
    Vue.set(state, 'siteThemeConfigs', {
      ...state.siteThemeConfigs,
      [sitePath]: config
    })
  },
  [SAVE_SITE_THEME_CONFIG_SUCCESS](state, { sitePath, config }) {
    Vue.set(state, 'siteThemeConfigs', {
      ...state.siteThemeConfigs,
      [sitePath]: config
    })
  },
  [UPDATE_SITE_MSG_SUCCESS](state, { newBasicMessage }) {
    let { username, sitename } = newBasicMessage
    Vue.set(state.website, username, {
      ...state.website[username],
      [sitename]: newBasicMessage
    })
  },
  [GET_USER_PRIVILEGE_OF_SITE_SUCCESS](state, { siteId, userId, privilege }) {
    Vue.set(state.userSitePrivilege, userId, {
      ...state.userSitePrivilege[userId],
      [siteId]: privilege
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
  },
  [USE_FILE_IN_SITE_SUCCESS](state, { sitePath, fileId, url }) {
    Vue.set(state, 'siteFiles', {
      ...state.siteFiles,
      [sitePath]: {
        ..._.get(state, ['siteFiles', sitePath]),
        [fileId]: url
      }
    })
  },
  [GET_FILE_RAW_URL_SUCCESS](state, { fileId, url }) {
    Vue.set(state, 'filesRawUrl', {
      ...state.filesRawUrl,
      [fileId]: url
    })
  },
  [SET_AUTH_CODE_INFO](state, payload) {
    Vue.set(state, 'authCodeInfo', payload)
  },
  [GET_USER_THREE_SERVICES_SUCCESS](state, payload) {
    Vue.set(state, 'threeServices', payload)
  }
}

export default mutations
