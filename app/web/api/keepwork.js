/*doc
---
title: API
name: Keepwork API
category: API
---
*/
import createEndpoint from './common/endpoint'
import { event } from 'vue-analytics'

export const keepworkEndpoint = createEndpoint({
  baseURL: process.env.KEEPWORK_API_PREFIX
})

const withoutParseEndpoint = createEndpoint(
  {
    baseURL: process.env.KEEPWORK_API_PREFIX
  },
  false
)

const { get, post, put, delete: deleteMethod } = keepworkEndpoint

export const user = {
  login: async (...args) => withoutParseEndpoint.post('/users/login', ...args),
  getUser: async username => get(`users/${username}`),
  getProfile: async () => get('/users/profile'),
  getDetailById: async ({ userId }) => get(`users/${userId}`),
  getDetailWithRankByIdOrUsername: async ({ userKey }) => get(`users/${userKey}/detail`),
  getDetailByName: async args => get(`/users/${args.username}`),
  updateUserInfo: async (...args) => put('/users/updateUserInfo', ...args),
  update: async ({ userId, userInfo }) => put(`/users/${userId}`, userInfo),
  changepw: async (...args) => post('/user/changepw', ...args),
  changePassword: async (...args) => put('/users/pwd', ...args),
  getByEmail: async args => get(`/users?email=${args.email}`),
  getByCellphone: async args => get(`/users?cellphone=${args.cellphone}`),
  getResetCodeByEmail: async args => get(`/users/email_captcha?email=${args.email}`),
  getResetCodeByCellphone: async args => get(`/users/cellphone_captcha?cellphone=${args.cellphone}`),
  passwordReset: async args => post('/users/reset_password', args),
  // getUserByEmail: async args => get(`/users/?email=${args.email}`),
  verifyEmailOne: async args => get(`/users/email_captcha?email=${args.email}`),
  verifyEmailTwo: async args => post('/users/email_captcha', args),
  // verifyCellphoneOne: async (...args) => post('/user/verifyCellphoneOne', ...args),
  verifyCellphoneOne: async args =>
    get(`/users/cellphone_captcha?cellphone=${args.cellphone}`),
  verifyCellphoneTwo: async (...args) =>
    post('/users/cellphone_captcha', ...args),
  unbindCellphone: async args => post('/users/cellphone_captcha', args),
  unbindEmail: async args => post('/users/email_captcha', args),
  register: async args => {
    const res = await post('/users/register', args)
    event('account', 'sign_up', 'keepwork', 0)
    return res
  },
  bindThreeService: async (...args) => post(`oauth_users/${args.serviceName}`, ...args),
  searchUsersByUsernames: async ({ username }) => post('users/search', { username }),
  searchByField: async args => post('users/search', args),

}

export const account = {
  getBalance: async () => get('/users/account'),
  getTrades: async () => get('/trades'),
  getDiscounts: async () => get('/discounts'),
  createRechargeOrder: async args => post('/orders', args),
  getRechargeOrderState: async args => get(`/orders/${args.id}`)
}

/*doc
---
title: website
name: website
category: API
parent: Keepwork API
---

**upsert:**
```
payload
{
  name,
  domain: name,
  visibility : "public",
  userId: 2,
  username : "dukes",
  defaultDataSourceName : "内置gitlab",
  // actually, the info below is not necessary for current usage
  // we keep it to prevent any surprise with old version keepwork
  categoryName : "个 人",
  type : "personal",
  templateName : "空模板",
  styleName : "默认样式",
  logoUrl : "http://keepwork.com/wiki/assets/imgs/wiki_blank_template.png"
}
res data
{
  ...websiteInfo,
  dataSource: { projectId }
}
```

**getDetailInfo:**
```
payload: {
  "username":"kaitlyn",
  "sitename":"site"
}
```
*/
export const website = {
  // upsert: async (...args) => post('website/upsert', ...args),
  upsert: async args => post('sites', args),
  getByName: async (...args) => post('website/getByName', ...args),
  // getAllByUsername: async (...args) => post('website/getAllByUsername', ...args),
  getAllSites: async () => get('sites'),
  getSiteGroups: async ({ siteId }) => get(`sites/${siteId}/groups`),
  createSiteGroup: async ({ siteId, groupId, level }) => post(`sites/${siteId}/groups`, { groupId, level }),
  deleteSiteGroup: async ({ siteId, groupId }) => deleteMethod(`sites/${siteId}/groups?groupId=${groupId}`),
  getAllSitesByName: async name => get(`users/${name}/sites`),
  getSiteDetail: async ({ siteId }) => get(`sites/${siteId}`),
  getDetailInfo: async args =>
    get(`sites/getByName?username=${args.username}&sitename=${args.sitename}`),
  // getDetailInfo: async (...args) => post('website/getDetailInfo', ...args),
  updateByName: async (...args) => post('website/updateByName', ...args),
  updateById: async args => put(`sites/${args.id}`, args),
  getUserPrivilege: async ({ siteId }) => get(`sites/${siteId}/privilege`)
}

/*doc
---
title: pages
name: pages
category: API
parent: Keepwork API
---

**star:**
```
payload: {
  url: 'kaitlyn/a1/newfolder/index',
  visitor: 'kaitlyn2'
}
```

**getDetail:**
```
payload: {
  url: 'kaitlyn/a1/newfolder/index',
  visitor: 'kaitlyn2' // username of login user or ''
}
```
*/
export const pages = {
  star: async (...args) => post('pages/star', ...args),
  insert: async (...args) => post('pages/insert', ...args),
  getDetail: async (...args) => post('pages/getDetail', ...args)
}

export const siteUser = {
  getSiteListByMemberName: async (...args) =>
    post('site_user/getSiteListByMemberName', ...args),
  getContributeSites: async () => get('sites?owned=false&membership=true')
}

export const siteDataSource = {
  getByUsername: async (...args) =>
    post('site_data_source/getByUsername', ...args)
}

/*doc
---
title: websiteComment
name: websiteComment
category: API
parent: Keepwork API
---

**create:**
```
payload: {
  "url":"/kaitlyn/site/index",
  "websiteId":90, "userId":4,
  "content":"范德萨范德萨分"
}
```

**getByPageUrl:**
```
payload: {
  "url":"/kaitlyn/site/index",
  "pageSize":10000000
}
```
*/
export const websiteComment = {
  create: async args => post('comments', args),
  getByPageUrl: async args => get(`comments?objectType=${args.objectType}&objectId=${args.objectId}&x-per-page=10&x-page=${args.page}&x-order=updatedAt-desc`),
  deleteById: async args => deleteMethod(`comments/${args.id}`)
}

export const sensitiveWords = {
  query: async () => get('sensitiveWords?x-per-page=100000')
}

export const bigfile = {
  upload: async (...args) => post('bigfile/upload', ...args),
  getByUsername: async (...args) => post('bigfile/getByUsername', ...args),
  getUserStoreInfo: async (...args) =>
    post('bigfile/getUserStoreInfo', ...args),
  deleteById: async (...args) => post('bigfile/deleteById', ...args),
  updateById: async (...args) => post('bigfile/updateById', ...args),
  getByFilenameList: async (...args) => post('bigfile/getByFilenameList', args),
  changeFilename: async (...args) => post('bigfile/changeFilename', ...args),
  getDownloadUrlById: async (...args) =>
    post('bigfile/getDownloadUrlById', ...args),
  getDownloadUrlByKey: async (...args) =>
    post('bigfile/getDownloadUrlByKey', ...args)
}

export const qiniu = {
  uploadToken: async (...args) => post('qiniu/uploadToken', ...args),
  deleteFile: async (...args) => post('qiniu/deleteFile', ...args),
  getUid: async (...args) => post('qiniu/getUid', ...args)
}

export const userThreeService = {
  getOauthUsers: async args => get('oauth_users'),
  // getByUsername: async (...args) => post('user_three_service/getByUsername', ...args),
  deleteById: async (...args) => post('user_three_service/deleteById', ...args),
  // unbind: async (...args) => post('user_three_service/unbind', ...args)
  unbind: async (args) => deleteMethod(`oauth_users/${args.id}?password=${args.password}`)
}

export const favorites = {
  existFavorite: async ({ objectId, objectType }) =>
    get(`favorites/exist?objectId=${objectId}&objectType=${objectType}`),
  favoriteObject: async ({ objectId, objectType }) =>
    post('favorites', { objectId, objectType }),
  unFavoriteObject: async ({ objectId, objectType }) =>
    deleteMethod(`favorites?objectId=${objectId}&objectType=${objectType}`),
  getUserFavorites: async ({ objectType, userId }) => get('favorites', { params: { objectType, userId } }),
  getUserFollows: async ({ objectType, objectId }) => get(`favorites/follows?objectId=${objectId}&objectType=${objectType}`),
  getUserSearchAllFavorites: async (args) => post('favorites/search', args)
}

export const projects = {
  getProjects: async (args) => post('projects/search', args),
  getProjectDetail: async ({ projectId }) =>
    get(`projects/${projectId}/detail`),
  updateProject: async ({ projectId, updatingProjectData }) =>
    put(`projects/${projectId}`, updatingProjectData),
  getUserProjects: async ({ userId }) => post('projects/search', { userId }),
  createProject: async ({
    description,
    name,
    privilege,
    type,
    visibility,
    siteId,
    tags
  }) =>
    post('projects', {
      description,
      name,
      privilege,
      type,
      visibility,
      siteId,
      tags
    }),
  getStarState: async ({ projectId }) => get(`projects/${projectId}/star`),
  starProject: async ({ projectId }) => post(`projects/${projectId}/star`),
  getPersonalProjects: async () => get('projects'),
  getPersonalProjectsByUserId: async ({ userId }) => get(`projects?userId=${userId}`),
  getContributeProjects: async () => get('projects/join'),
  getContributeProjectsByUserId: async ({ userId }) => get(`projects/join?userId=${userId}`),
  unStarProject: async ({ projectId }) => post(`projects/${projectId}/unstar`),
  visitProject: async (projectId) => get(`projects/${projectId}/visit`)
}

export const applies = {
  getApplyList: async ({ objectId, objectType, applyType }) =>
    get(
      `applies?objectId=${objectId}&objectType=${objectType}&applyType=${applyType}`
    ),
  updateApplyState: async ({ id, state }) =>
    put(`applies/${id}`, { id, state }),
  getApplyState: async ({ objectType, objectId, applyType, applyId }) =>
    get(
      `applies/state?objectType=${objectType}&objectId=${objectId}&applyId=${applyId}&applyType=${applyType}`
    ),
  applyProjectMember: async ({
    objectType,
    objectId,
    applyType,
    applyId,
    legend,
    extra
  }) => post('applies', { objectType, objectId, applyType, applyId, legend, extra })
}

export const members = {
  getProjectMembersList: async ({ objectId, objectType }) =>
    get(`members?objectId=${objectId}&objectType=${objectType}`),
  deleteMember: async ({ id }) => deleteMethod(`members/${id}`),
  isMemberExist: async ({ objectId, objectType, memberId }) =>
    get(
      `members/exist?objectId=${objectId}&objectType=${objectType}&memberId=${memberId}`
    )
}

export const comments = {
  getComments: async ({
    objectType,
    objectId,
    xPage = 1,
    xPerPage = 200,
    xOrder = 'updatedAt-desc'
  }) =>
    get(
      `comments?objectType=${objectType}&objectId=${objectId}&x-per-page=${xPerPage}&x-page=${xPage}&x-order=${xOrder}`
    ),
  createComment: async ({ objectType, objectId, content }) =>
    post('comments', { objectType, objectId, content }),
  deleteComment: async ({ commentId }) => deleteMethod(`comments/${commentId}`),
  updateComment: async ({ commentId, content }) =>
    put(`comments/${commentId}`, { content })
}

export const issues = {
  createIssue: async (...args) => post('issues', ...args),
  getSingleProjectIssues: async params => post('issues/search', params),
  updateIssue: async ({ objectId, params }) =>
    put(`issues/${objectId}`, { ...params }),
  getSingleIssue: async ({ issueId }) => get(`issues/${issueId}`)
}

export const groups = {
  getAllGroups: async () => get('groups'),
  createGroup: async ({ groupname, members, description }) => post('groups', { groupname, members, description }),
  updateGroup: async ({ id, members, description }) => put(`groups/${id}`, { members, description }),
  deleteGroup: async ({ id }) => deleteMethod(`groups/${id}`),
  addMemberToGroup: async ({ groupId, memberName }) => post(`groups/${groupId}/members`, { memberName })
}

export const keepwork = {
  user,
  website,
  siteUser,
  siteDataSource,
  websiteComment,
  sensitiveWords,
  pages,
  qiniu,
  userThreeService,
  favorites,
  projects,
  applies,
  members,
  comments,
  bigfile,
  issues,
  groups,
  account
}

export default keepwork
