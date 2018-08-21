/*doc
---
title: API
name: Lesson API
category: API
---
*/
import createEndpoint from './common/endpoint'

export const endpoint = createEndpoint({
  baseURL: process.env.LESSON_API_PREFIX
})

export const { get, post, put } = endpoint

export const admin = {}

export const packages = {
  packagesList: async params => get('packages/search', params || {}),
  packageDetail: async ({ packageId }) => get(`packages/${packageId}/detail`),
  subscribe: async ({ packageId }) => post(`packages/${packageId}/subscribe`)
}

export const lessons = {
  lessonContent: async ({ lessonId }) => get(`lessons/${lessonId}/contents`),
  lessonContentByVersion: async ({ lessonId, version = 1 }) =>
    get(`lessons/${lessonId}/contents?version=${version}`)
}

export const users = {
  getUserDetail: (...args) => get('users', ...args),
  userSubscribes: args => get(`users/${args.userId}/subscribes`),
  userSkills: args => get(`users/${args.userId}/skills`),
  toBeTeacher: ({ userId, key, config }) =>
    post(`users/${userId}/teacher`, { key }, config)
}

export const classrooms = {
  join: ({ payload, config }) => post('classrooms/join', payload, config),
  begin: ({ payload, config }) => post(`classrooms`, payload, config),
  dismiss: ({ classId, config }) =>
    put(`classrooms/${classId}/dismiss`, null, config),
  learnRecords: ({ classId, config }) =>
    get(`classrooms/${classId}/learnRecords`, null, config),
  uploadLearnRecords: ({ classId, learnRecords, config }) =>
    put(`learnRecords/${classId}`, { extra: learnRecords }, config),
  getUserDetail: async () => get('users'),
  userSubscribes: async ({ userId }) => get(`users/${userId}/subscribes`),
  userSkills: async ({ userId }) => get(`users/${userId}/skills`),
  toBeTeacher: async ({ userId, key }) =>
    post(`users/${userId}/teacher`, {
      key
    })
}

export const lesson = {
  users,
  packages,
  lessons,
  admin,
  classrooms
}

export default lesson
