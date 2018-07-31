/*doc
---
title: API
name: Lesson API
category: API
---
*/
import axios from 'axios'

export const keepworkEndpoint = axios.create({
  baseURL: process.env.LESSON_API_PREFIX
})

export const post = (...args) => {
  let [url, payload, config, returnOriginalData = false] = args
  return keepworkEndpoint.post(url, payload, config).then(
    res => returnOriginalData ? res.data : res.data.data
  )
}

export const put = (...args) => {
  let [url, payload, config, returnOriginalData = false] = args
  return keepworkEndpoint.put(url, payload, config).then(
    res => returnOriginalData ? res.data : res.data.data
  )
}

/**
 * Be careful about the endpoint[method]'s args
 * get and _delete is a little different with post and put
 * https://github.com/axios/axios#instance-methods
 */

export const get = (...args) => {
  let [url, payload, config, returnOriginalData = false] = args
  return keepworkEndpoint.get(url, {
    ...config,
    params: payload
  }).then(
    res => returnOriginalData ? res.data : res.data.data
  )
}

export const _delete = (...args) => {
  let [url, , config, returnOriginalData = false] = args
  return keepworkEndpoint.delete(url, config).then(
    res => returnOriginalData ? res.data : res.data.data
  )
}

export const admin = {
  packages: (...args) => get('admin/packages', ...args)
}

export const packages = {
}

export const lesson = {
  packages,
  admin
}

export default lesson
