/*doc
---
title: Storage V0 API
name: Storage V0 API
category: API
---
*/
import axios from 'axios'
import _ from 'lodash'

const keepworkEndpointV0 = axios.create({
  baseURL: process.env.STORAGE_GATEWAY_BASE_URL
})

const httpMethodWrapper = (method, ...args) => {
  let [url, payload, config, returnOriginalData = false] = args

  if (method === 'post' || method === 'put') {
    return keepworkEndpointV0[method](url, payload, config).then(
      res => returnOriginalData ? res.data : res.data.data
    )
  }

  return keepworkEndpointV0[method](url, config).then(
    res => returnOriginalData ? res.data : res.data.data
  )
}

const _post = (...args) => httpMethodWrapper('post', ...args)
const _get = (...args) => httpMethodWrapper('get', ...args)
// const _put = (...args) => httpMethodWrapper('put', ...args) // unused yet
const _delete = (...args) => httpMethodWrapper('delete', ...args)

/*doc
  Files api
  Refs: https://keepwork.com/keepwork/wiki/文档/storage

  update
    key string 文件key url encode
    username string 用户名
    sitename string 站点名 没有站点则不填或填__keepork__, 两者选其一 TODO
    filename string 文件名
    type string 文件类型 方便文件管理
    size number 文件大小
    hash string 文件哈希
*/

export const files = _.assign(
  (payload, ...args) => _get(`/files${payload.id ? '/' + encodeURIComponent(payload.id) : ''}`, payload, ...args),
  {
    list: (payload, ...args) => _post(`/files/list`, payload, ...args),
    update: (payload, ...args) => _post(`/files`, payload, ...args),
    delete: (payload, ...args) => _delete(`/files/${encodeURIComponent(payload.id)}`, payload, ...args),
    token: (payload, ...args) => _get(`/files/${encodeURIComponent(payload.key)}/token`, payload, ...args),
    statistics: (payload, ...args) => _get('/files/statistics', payload, ...args)
  }
)

/*doc
  siteFiles api

  url
    userId number 使用站点的所属用户ID
    siteId number 使用站点的ID
    fileId number 文件Id
*/
export const siteFiles = {
  url: async (payload, ...args) => {
    let url = await _post(`/siteFiles/url`, payload, ...args)
    return process.env.GATEWAY_BASE_URL + url
  }
}

export default {
  files,
  siteFiles
}
