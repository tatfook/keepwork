/*doc
---
title: API
name: Keepwork API
category: API
---
*/
import createEndpoint from './common/endpoint'
import axios from 'axios'
import { event } from 'vue-analytics'

export const keepworkEndpoint = createEndpoint({
  baseURL: process.env.KEEPWORK_API_PREFIX
})

const withoutParseEndpoint = createEndpoint({
  baseURL: process.env.KEEPWORK_API_PREFIX
}, false)

const {post, put} = keepworkEndpoint

export const user = {
  login: async (...args) => {
    const res = await withoutParseEndpoint.post('/user/login', ...args)
    event('account', 'sign_in', 'keepwork', res.data.userinfo._id)
    return res
  },
  getProfile: async (...args) => post('/user/getProfile', ...args),
  getDetailByName: async (...args) => post('/user/getDetailByName', ...args),
  updateUserInfo: async (...args) => put('/user/updateUserInfo', ...args),
  update: async (...args) => put('/user/update', ...args),
  changepw: async (...args) => post('/user/changepw', ...args),
  getByEmail: async (...args) => withoutParseEndpoint.post('/user/getByEmail', ...args),
  verifyEmailOne: async (...args) => post('/user/verifyEmailOne', ...args),
  verifyEmailTwo: async (...args) => post('/user/verifyEmailTwo', ...args),
  verifyCellphoneOne: async (...args) => withoutParseEndpoint.post('/user/verifyCellphoneOne', ...args),
  verifyCellphoneTwo: async (...args) => withoutParseEndpoint.post('/user/verifyCellphoneTwo', ...args),
  unbindCellphone: async (...args) => post('/user/unbindCellphone', ...args),
  unbindEmail: async (...args) => post('/user/unbindEmail', ...args),
  register: async (...args) => {
    const res = await post('/user/register', ...args)
    event('account', 'sign_up', 'keepwork', 0)
    return res
  },
  bindThreeService: async (...args) => post('user/bindThreeService', ...args),
  verifyToken: async ({ token }) => {
    let instance = axios.create({
      baseURL: process.env.KEEPWORK_API_PREFIX
    })
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return instance.post('user/getProfile')
  }
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
  upsert: async (...args) => post('website/upsert', ...args),
  getByName: async (...args) => post('website/getByName', ...args),
  getAllByUsername: async (...args) => post('website/getAllByUsername', ...args),
  getDetailInfo: async (...args) => post('website/getDetailInfo', ...args),
  updateByName: async (...args) => post('website/updateByName', ...args)
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
  getSiteListByMemberName: async (...args) => post('site_user/getSiteListByMemberName', ...args)
}

export const siteDataSource = {
  getByUsername: async (...args) => post('site_data_source/getByUsername', ...args)
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
  create: async (...args) => post('website_comment/create', ...args),
  getByPageUrl: async (...args) => post('website_comment/getByPageUrl', ...args),
  deleteById: async (...args) => post('website_comment/deleteById', ...args)
}

export const sensitiveWords = {
  query: async (...args) => post('sensitive_words/query', ...args)
}

export const bigfile = {
  upload: async (...args) => post('bigfile/upload', ...args),
  getByUsername: async (...args) => post('bigfile/getByUsername', ...args),
  getUserStoreInfo: async (...args) => post('bigfile/getUserStoreInfo', ...args),
  deleteById: async (...args) => post('bigfile/deleteById', ...args),
  updateById: async (...args) => post('bigfile/updateById', ...args),
  getByFilenameList: async (...args) => post('bigfile/getByFilenameList', args),
  changeFilename: async (...args) => post('bigfile/changeFilename', ...args),
  getDownloadUrlById: async (...args) => post('bigfile/getDownloadUrlById', ...args),
  getDownloadUrlByKey: async (...args) => post('bigfile/getDownloadUrlByKey', ...args)
}

export const qiniu = {
  uploadToken: async (...args) => post('qiniu/uploadToken', ...args),
  deleteFile: async (...args) => post('qiniu/deleteFile', ...args),
  getUid: async (...args) => post('qiniu/getUid', ...args)
}

export const userThreeService = {
  getByUsername: async (...args) => post('user_three_service/getByUsername', ...args),
  deleteById: async (...args) => post('user_three_service/deleteById', ...args),
  unbind: async (...args) => post('user_three_service/unbind', ...args)
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
  bigfile
}

export default keepwork
