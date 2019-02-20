import Vue from 'vue'

const TOGGLE_LOGIN_DIALOG = 'TOGGLE_LOGIN_DIALOG'
const GET_ALL_PROJECTS = 'GET_ALL_PROJECTS'
const GET_PROJECT_DETAIL_SUCCESS = 'GET_PROJECT_DETAIL_SUCCESS'
const GET_PROJECT_APPLY_LIST_SUCCESS = 'GET_PROJECT_APPLY_LIST_SUCCESS'
const GET_PROJECT_MEMBERS_SUCCESS = 'GET_PROJECT_MEMBERS_SUCCESS'
const GET_USER_PROJECTS_SUCCESS = 'GET_USER_PROJECTS_SUCCESS'
const GET_PROJECT_FAVORITE_STATE_SUCCESS = 'GET_PROJECT_FAVORITE_STATE_SUCCESS'
const GET_PROJECT_STAR_STATE_SUCCESS = 'GET_PROJECT_STAR_STATE_SUCCESS'
const GET_PROJECT_APPLY_STATE_SUCCESS = 'GET_PROJECT_APPLY_STATE_SUCCESS'
const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS'
const GET_MY_ALL_PROJECTS_SUCCESS = 'GET_MY_ALL_PROJECTS_SUCCESS'
const GET_TYPE_PROJECTS = 'GET_TYPE_PROJECTS'
const GET_EXCELLENT_PROJECTS = ' GET_EXCELLENT_PROJECTS'
const GET_PROJECT_ISSUES_SUCCESS = 'GET_PROJECT_ISSUES_SUCCESS'
const GET_ALL_USERS_SUCCESS = 'GET_ALL_USERS_SUCCESS'
const GET_USER_FOLLOWS = 'GET_USER_FOLLOWS'
const GET_GAMES_LIST = 'GET_GAMES_LIST'
const GET_WORKS_BY_GAMEID = 'GET_WORKS_BY_GAMEID'
const GET_LEGAL_GAMES_PROJECTS = 'GET_LEGAL_GAMES_PROJECTS'

export const props = {
  TOGGLE_LOGIN_DIALOG,
  GET_EXCELLENT_PROJECTS,
  GET_ALL_PROJECTS,
  GET_PROJECT_APPLY_LIST_SUCCESS,
  GET_PROJECT_DETAIL_SUCCESS,
  GET_USER_PROJECTS_SUCCESS,
  GET_PROJECT_MEMBERS_SUCCESS,
  GET_PROJECT_FAVORITE_STATE_SUCCESS,
  GET_PROJECT_STAR_STATE_SUCCESS,
  GET_MY_ALL_PROJECTS_SUCCESS,
  GET_PROJECT_APPLY_STATE_SUCCESS,
  GET_COMMENTS_SUCCESS,
  GET_TYPE_PROJECTS,
  GET_PROJECT_ISSUES_SUCCESS,
  GET_ALL_USERS_SUCCESS,
  GET_USER_FOLLOWS,
  GET_GAMES_LIST,
  GET_WORKS_BY_GAMEID,
  GET_LEGAL_GAMES_PROJECTS
}

const mutations = {
  [TOGGLE_LOGIN_DIALOG](state, status) {
    Vue.set(state, 'isShowLoginDialog', status)
  },
  [GET_EXCELLENT_PROJECTS](state, projects) {
    Vue.set(state, 'excellentProjects', projects)
  },
  [GET_ALL_PROJECTS](state, allProjects) {
    Vue.set(state, 'allProjects', allProjects)
  },
  [GET_TYPE_PROJECTS](state, {
    type,
    projects
  }) {
    Vue.set(state, 'projectsType', {
      ...state.projectsType,
      [type]: projects
    })
  },
  [GET_MY_ALL_PROJECTS_SUCCESS](state, projectsGroup) {
    Vue.set(state, 'myProjects', projectsGroup[0])
    Vue.set(state, 'myContributeProjects', projectsGroup[1])
  },
  [GET_USER_PROJECTS_SUCCESS](state, {
    userId,
    projects
  }) {
    Vue.set(state, 'usersProjects', {
      ...state.usersProjects,
      [userId]: projects
    })
  },
  [GET_PROJECT_DETAIL_SUCCESS](state, {
    projectId,
    projectDetail
  }) {
    Vue.set(state, 'projects', {
      ...state.projects,
      [projectId]: projectDetail
    })
  },
  [GET_PROJECT_APPLY_LIST_SUCCESS](state, {
    projectId,
    projectApplyList
  }) {
    Vue.set(state, 'projectApplyList', {
      ...state.projectApplyList,
      [projectId]: projectApplyList
    })
  },
  [GET_PROJECT_MEMBERS_SUCCESS](state, {
    projectId,
    memberList
  }) {
    Vue.set(state, 'memberList', {
      ...state.memberList,
      [projectId]: memberList
    })
  },
  [GET_PROJECT_APPLY_STATE_SUCCESS](state, {
    objectId,
    applyId,
    applyState
  }) {
    Vue.set(state.projectApplyState, applyId, {
      ...state.projectApplyState[applyId],
      [objectId]: applyState
    })
  },
  [GET_PROJECT_FAVORITE_STATE_SUCCESS](state, {
    projectId,
    isFavorite
  }) {
    Vue.set(state, 'projectsFavoriteState', {
      ...state.projectsFavoriteState,
      [projectId]: isFavorite
    })
  },
  [GET_PROJECT_STAR_STATE_SUCCESS](state, {
    projectId,
    isStared
  }) {
    Vue.set(state, 'projectsStarState', {
      ...state.projectsStarState,
      [projectId]: isStared
    })
  },
  [GET_COMMENTS_SUCCESS](state, {
    projectId,
    commentList
  }) {
    Vue.set(state, 'commentList', {
      ...state.commentList,
      [projectId]: commentList
    })
  },
  [GET_PROJECT_ISSUES_SUCCESS](state, {
    projectIssues,
    projectId
  }) {
    Vue.set(state, 'issuesList', {
      ...state.issuesList,
      [projectId]: projectIssues
    })
  },
  [GET_ALL_USERS_SUCCESS](state, allUsers) {
    Vue.set(state, 'allUsers', allUsers)
  },
  [GET_USER_FOLLOWS](state, follows) {
    Vue.set(state, 'userFollows', follows)
  },
  [GET_GAMES_LIST](state, list) {
    Vue.set(state, 'gamesList', list)
  },
  [GET_WORKS_BY_GAMEID](state, obj) {
    Vue.set(state, 'gameWorks', obj)
  },
  [GET_LEGAL_GAMES_PROJECTS](state, list) {
    Vue.set(state, 'legalGamesProjects', list)
  }
}

export default mutations
