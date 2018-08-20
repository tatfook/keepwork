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
  let [url, payload, config, returnOriginalData = true] = args
  return keepworkEndpoint
    .post(url, payload, config)
    .then(res => (returnOriginalData ? res.data : res.data.data))
}

export const _post = args => {
  const { url, payload, config } = args
  return keepworkEndpoint.post(url, payload, config).then(res => res.data)
}

export const put = (...args) => {
  let [url, payload, config] = args
  return keepworkEndpoint.post(url, payload, config).then(res => res.data)
}

/**
 * Be careful about the endpoint[method]'s args
 * get and _delete is a little different with post and put
 * https://github.com/axios/axios#instance-methods
 */

export const get = (...args) => {
  let [url, payload, config, returnOriginalData = true] = args
  return keepworkEndpoint
    .get(url, {
      ...config,
      params: payload
    })
    .then(res => (returnOriginalData ? res.data : res.data.data))
}

export const _delete = (...args) => {
  let [url, , config] = args
  return keepworkEndpoint.delete(url, config).then(res => res.data)
}

export const admin = {}

export const packages = {
  packagesList: args => get('packages/search'),
  packageDetail: ({ packageId, config }) => get(`packages/${packageId}/detail`, null, config),
  subscribe: ({ packageId, config }) => post(`packages/${packageId}/subscribe`, null, config)
}

export const lessons = {
  lessonContent: ({ lessonId, config }) => {
    return get(`lessons/${lessonId}/contents`, null, config)
  },
  lessonContentByVersion: ({ lessonId, version = 1 }) =>
    get(`lessons/${lessonId}/contents?version=${version}`)
}

export const users = {
  getUserDetail: (...args) => get('users', ...args),
  userSubscribes: args => get(`users/${args.id}/subscribes`),
  userSkills: args => get(`users/${args.id}/skills`)
}

export const classrooms = {
  join: args => post('classrooms/join', ...args),
  begin: ({ payload, config }) => post(`classrooms`, payload, config)
}

export const lesson = {
  users,
  packages,
  lessons,
  admin,
  classrooms
}

export default lesson
