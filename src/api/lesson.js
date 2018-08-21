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

export const {
  get,
  post,
  put
} = endpoint

export const admin = {}

export const packages = {
  packagesList: async (params) => get('packages/search', params || {}),
  packageDetail: async ({
    packageId
  }) => get(`packages/${packageId}/detail`),
  subscribe: async ({
    packageId
  }) => post(`packages/${packageId}/subscribe`)
}

export const lessons = {
  lessonContent: async ({
    lessonId
  }) => get(`lessons/${lessonId}/contents`),
  lessonContentByVersion: async ({
    lessonId,
    version = 1
  }) =>
    get(`lessons/${lessonId}/contents?version=${version}`)
}

export const users = {
  getUserDetail: async () => get('users'),
  userSubscribes: async ({
    userId
  }) => get(`users/${userId}/subscribes`),
  userSkills: async ({
    userId
  }) => get(`users/${userId}/skills`),
  toBeTeacher: async ({
    userId,
    key
  }) => post(`users/${userId}/teacher`, {
    key
  })
}

export const classrooms = {
  join: async ({
    payload
  }) => post('classrooms/join', payload),
  begin: async ({
    payload
  }) => post(`classrooms`, payload),
  dismiss: async ({
    classId
  }) =>
    put(`classrooms/${classId}/dismiss`),
  learnRecords: async ({
    classId
  }) =>
    get(`classrooms/${classId}/learnRecords`)
}

export const lesson = {
  users,
  packages,
  lessons,
  admin,
  classrooms
}

export default lesson
