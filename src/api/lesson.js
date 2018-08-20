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
  let { url, payload, config, returnOriginalData = true } = args
  return keepworkEndpoint
    .post(url, payload, config)
    .then(res => (returnOriginalData ? res.data : res.data.data))
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
  lessonContent: args => get(`lesson/${args.lessonId}/contents`),
  lessonContentByVersion: args =>
    get(`lesson/${args.lessonId}/contents?version=${args.version || 1}`)
}

export const users = {
  getUserDetail: (...args) => get('users', ...args),
  userSubscribes: args => get(`users/${args.userId}/subscribes`),
  userSkills: args => get(`users/${args.userId}/skills`),
  toBeTeacher: ({userId, key, config}) => post(`users/${userId}/teacher`, {key}, config)
}

export const classrooms = {
  join: args => post('classrooms/join', ...args),
  begin: args => _post('classrooms', args)
}

export const lesson = {
  users,
  packages,
  lessons,
  admin,
  classrooms
}

export default lesson
