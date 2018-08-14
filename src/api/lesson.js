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
  packageDetail: args => get(`packages/${args.id}/detail`),
  subscribe: args => post(`packages/${args.id}/subscribe`)
}

export const users = {
  getUserDetail: args => get('users'),
  userSubscribes: args => get(`users/${args.id}/subscribes`),
  userSkills: args => get(`users/${args.id}/skills`)
}

export const classrooms = {
  join: args => post('classrooms/join', ...args)
}

// const _get = ({ url, params, config, returnOriginalData = true }) =>
//   keepworkEndpoint
//     .get(url, {
//       ...config,
//       params
//     })
//     .then(res => (returnOriginalData ? res.data : res.data.data))

const fakerGet = async ({ lessonId }) => {
  const faker = {
    1: 'https://git-stage.keepwork.com/gitlab_www_kevinxft/keepwork333333333333333/raw/master/kevinxft/333333333333333/%E8%AF%BE%E7%A8%8B------------------.md',
    2: 'https://git-stage.keepwork.com/gitlab_www_kevinxft/keepwork333333333333333/raw/master/kevinxft/333333333333333/%E2%9C%94%EF%B8%8F%E2%9C%94%EF%B8%8F%E2%9C%94%EF%B8%8F%E2%9C%94%EF%B8%8F%E2%9C%94%EF%B8%8F%E2%9C%94%EF%B8%8F%E2%9C%94%EF%B8%8F.md',
    3: 'https://git-stage.keepwork.com/gitlab_www_kevinxft/keepwork333333333333333/raw/master/kevinxft/333333333333333/212.md?_random=0.5285638094528637'
  }
  return axios
    .get(`${faker[lessonId]}?_random=${Math.random()}`)
    .then(res => res.data)
}

export const fetchLessonData = args => fakerGet(args)

export const lesson = {
  users,
  packages,
  admin,
  fetchLessonData,
  classrooms
}

export default lesson
