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

export const admin = {}

export const packages = {
  packagesList: async (params) => endpoint.get('packages/search', params || {}),
  packageDetail: async ({
    packageId
  }) => endpoint.get(`packages/${packageId}/detail`),
  subscribe: ({
    packageId
  }) => endpoint.post(`packages/${packageId}/subscribe`)
}

export const lessons = {
  lessonContent: async ({
    lessonId
  }) => endpoint.get(`lessons/${lessonId}/contents`),
  lessonContentByVersion: async ({
    lessonId,
    version = 1
  }) =>
    endpoint.get(`lessons/${lessonId}/contents?version=${version}`)
}

export const users = {
  getUserDetail: async () => endpoint.get('users'),
  userSubscribes: async ({
    userId
  }) => endpoint.get(`users/${userId}/subscribes`),
  userSkills: async ({
    userId
  }) => endpoint.get(`users/${userId}/skills`),
  toBeTeacher: async ({
    userId,
    key
  }) => endpoint.post(`users/${userId}/teacher`, {
    key
  })
}

export const classrooms = {
  join: async ({
    payload
  }) => endpoint.post('classrooms/join', payload),
  begin: async ({
    payload
  }) => endpoint.post(`classrooms`, payload),
  dismiss: async ({
    classId
  }) =>
    endpoint.put(`classrooms/${classId}/dismiss`),
  learnRecords: async ({
    classId
  }) =>
    endpoint.get(`classrooms/${classId}/learnRecords`)
}

export const lesson = {
  users,
  packages,
  lessons,
  admin,
  classrooms
}

export default lesson
