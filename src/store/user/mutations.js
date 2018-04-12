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

export const props = {
  LOGIN_SUCCESS,
  GET_PROFILE_SUCCESS,
  GET_ALL_WEBSITE_SUCCESS,
  GET_SITE_DATASOURCE_SUCCESS,
  CREATE_COMMENT_SUCCESS,
  DELETE_COMMENT_SUCCESS,
  GET_COMMENTS_BY_PAGE_URL_SUCCESS,
  GET_SITE_DETAIL_INFO_SUCCESS,
  GET_CONTRIBUTED_WEBSITE_SUCCESS
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
  }
}

export default mutations
