/*doc
---
title: Storage V0 API
name: Storage V0 API
category: API
---
*/
import _ from 'lodash'
import createEndpoint from './common/endpoint'

export const endpoint = createEndpoint({
  baseURL: process.env.STORAGE_GATEWAY_BASE_URL
})

export const {
  get,
  post,
  put,
  delete: destroy
} = endpoint

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
  async (payload, ...args) => get(`/files${payload.id ? '/' + encodeURIComponent(payload.id) : ''}`, payload, ...args),
  {
    list: async (payload, ...args) => post(`/files/list`, payload, ...args),
    update: async (payload, ...args) => post(`/files`, payload, ...args),
    delete: async (payload, ...args) => destroy(`/files/${encodeURIComponent(payload.id)}`, payload, ...args),
    token: async (payload, ...args) => get(`/files/${encodeURIComponent(payload.key)}/token`, payload, ...args),
    statistics: async (payload, ...args) => get('/files/statistics', payload, ...args)
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
    let url = await post(`/siteFiles/url`, payload, ...args)
    return process.env.GATEWAY_BASE_URL + url
  }
}

export default {
  files,
  siteFiles
}
