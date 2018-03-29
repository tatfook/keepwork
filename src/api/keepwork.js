import axios from 'axios'

export const keepworkEndpoint = axios.create({
  baseURL: process.env.KEEPWORK_API_PREFIX
})

export const post = (...args) => keepworkEndpoint.post(...args).then(res => res.data.data)

export const user = {
  login: (...args) => post('/user/login', ...args),
  getProfile: (...args) => post('/user/getProfile', ...args)
}

/*doc
  website
  getDetailInfo payload {"username":"kaitlyn","sitename":"site"}
*/
export const website = {
  getAllByUsername: (...args) => post('website/getAllByUsername', ...args),
  getDetailInfo: (...args) => post('website/getDetailInfo', ...args)
}

export const siteDataSource = {
  getByUsername: (...args) => post('site_data_source/getByUsername', ...args)
}

/*doc
  websiteComment
  create payload {"url":"/kaitlyn/site/index", "websiteId":90, "userId":4, "content":"范德萨范德萨分"}
  getByPageUrl payload {"url":"/kaitlyn/site/index", "pageSize":10000000}
*/
export const websiteComment = {
  create: (...args) => post('website_comment/create', ...args),
  getByPageUrl: (...args) => post('website_comment/getByPageUrl', ...args),
  deleteById: (...args) => post('website_comment/deleteById', ...args)
}

export const sensitiveWords = {
  query: (...args) => post('sensitive_words/query', ...args)
}

export const keepwork = {
  user,
  website,
  siteDataSource,
  websiteComment,
  sensitiveWords
}

export default keepwork
