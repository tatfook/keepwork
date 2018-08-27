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

export const { get, post, put, delete: deleteMethod } = endpoint

export const admin = {}

export const packages = {
  getUserPackages: async () => get('packages'),
  getHotsPackages: async () => get(`packages/hots`),
  packagesList: async params => get('packages/search', params || {}),
  packageDetail: async ({ packageId }) => get(`packages/${packageId}/detail`),
  subscribe: async ({ packageId }) => post(`packages/${packageId}/subscribe`),
  getTaughtPackages: async () => get(`packages/teach`),
  audit: async ({ packageId, state }) => post(`packages/${packageId}/audit`, { state }),
  release: async ({ packageDetail }) => put(`packages/${packageDetail.id}`, packageDetail),
  delete: async ({ packageId }) => deleteMethod(`packages/${packageId}`),
  getLessonList: async ({ packageId }) => get(`packages/${packageId}/lessons`)
}

export const lessons = {
  lessonContent: async ({ lessonId }) => get(`lessons/${lessonId}/contents`),
  lessonContentByVersion: async ({ lessonId, version = 1 }) =>
    get(`lessons/${lessonId}/contents?version=${version}`),
  getSkills: async ({ lessonId }) => get(`lessons/${lessonId}/skills`)
}

export const users = {
  getUserDetail: () => get('users'),
  userSubscribes: args => get(`users/${args.userId}/subscribes`),
  userSkills: args => get(`users/${args.userId}/skills`),
  toBeTeacher: ({ userId, key, config }) =>
    post(`users/${userId}/teacher`, { key }, config),
  getTeachingRecords: async () => get(`packages`),
  setNickname: ({ nickname, id }) => put(`users/${id}`, { nickname })
}

export const classrooms = {
  join: payload => post('classrooms/join', payload),
  begin: ({ payload, config }) => post(`classrooms`, payload, config),
  leave: () => post(`classrooms/quit`),
  getTeachingListing: async () => get(`classrooms`),
  currentClass: () => get(`classrooms/current`),
  getClassroomById: id => get(`classrooms/${id}`),
  dismiss: ({ classId, config }) =>
    put(`classrooms/${classId}/dismiss`, null, config),
  learnRecords: ({ classId, config }) =>
    get(`classrooms/${classId}/learnRecords`, null, config),
  uploadLearnRecords: ({ classId, learnRecords }) =>
    put(`learnRecords/${classId}`, { extra: learnRecords }),
  getClassroomLearnRecords: id => get(`classrooms/${id}/learnRecords`),
  modifyClassroomLearnRecords: ({ id, learnRecordsArr }) => put(`classrooms/${id}/learnRecords`, learnRecordsArr)
}

export const subjects = {
  getAllSubjects: () => get('subjects')
}

export const lesson = {
  users,
  packages,
  lessons,
  admin,
  classrooms,
  subjects
}

export default lesson
