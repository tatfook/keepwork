/*doc
---
title: API
name: Lesson API
category: API
---
*/
import createEndpoint from './common/endpoint'
import axios from 'axios'
import { event } from 'vue-analytics'

export const endpoint = createEndpoint({
  baseURL: process.env.LESSON_API_PREFIX
})


export const requestWithoutToken = axios.create({
  baseURL: process.env.LESSON_API_PREFIX,
  timeout: 20000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8'
  }
})

export const { get, post, put, delete: deleteMethod } = endpoint

export const admin = {}

export const packages = {
  create: async ({ newPackageData }) => {
    const res = await post('packages', newPackageData)
    event('lesson', 'create_package', 'keepwork', res.id)
    return res
  },
  update: async ({ updatingPackageData }) =>
    put(`packages/${updatingPackageData.id}`, updatingPackageData),
  getUserPackages: async () => get('packages'),
  getHotsPackages: async () => get('packages/hots'),
  packagesList: async ({ perPage, page }) =>
    get(
      `packages/search?x-per-page=${perPage}&x-page=${page}&x-order=auditAt-desc`
    ),
  packageDetail: async ({ packageId }) => get(`packages/${packageId}/detail`),
  subscribe: async ({ packageId }) => {
    const res = await post(`packages/${packageId}/subscribe`)
    event('lesson', 'subscribe_package', 'keepwork', packageId)
    return res
  },
  isSubscribe: async ({ packageId }) =>
    get(`packages/${packageId}/isSubscribe`),
  getTaughtPackages: async () => get('packages/teach'),
  audit: async ({ packageId, state }) =>
    post(`packages/${packageId}/audit`, { state }),
  release: async ({ packageDetail }) =>
    put(`packages/${packageDetail.id}`, packageDetail),
  destroy: async ({ packageId }) => deleteMethod(`packages/${packageId}`),
  addLesson: async ({ packageId, lessonId }) =>
    post(`packages/${packageId}/lessons`, { lessonId }),
  removeLesson: async ({ packageId, lessonId }) => {
    return deleteMethod(`packages/${packageId}/lessons?lessonId=${lessonId}`)
  },
  getLessonList: async ({ packageId }) => get(`packages/${packageId}/lessons`)
}

export const lessons = {
  create: async ({ newLessonData }) => {
    const res = await post('lessons', newLessonData)
    event('lesson', 'create_lesson', 'keepwork', res.id)
    return res
  },
  update: async ({ updatingData }) =>
    put(`lessons/${updatingData.id}`, updatingData),
  release: async ({ id, content }) => {
    const res = await post(`lessons/${id}/contents`, { content })
    event('lesson', 'release_lesson', 'keepwork', id)
    return res
  },
  getUserLessons: async () => get('lessons'),
  lessonContent: async ({ lessonId }) => get(`lessons/${lessonId}/contents`),
  lessonDetail: async ({ lessonId }) => get(`lessons/${lessonId}/detail`),
  lessonDetailByUrl: async params => get('lessons/detail', { params }),
  rewardCoin: async ({ id }) => post(`learnRecords/${id}/reward`),
  isReward: async ({ packageId, lessonId }) =>
    get(`learnRecords/reward?packageId=${packageId}&lessonId=${lessonId}`),
  destroy: async ({ lessonId }) => deleteMethod(`lessons/${lessonId}`),
  lessonContentByVersion: async ({ lessonId, version = 1 }) =>
    get(`lessons/${lessonId}/contents?version=${version}`),
  getSkills: async ({ lessonId }) => get(`lessons/${lessonId}/skills`),
  learnRecords: async ({ lessonId }) => get(`lessons/${lessonId}/learnRecords`),
  getLastLearnRecordById: async ({ lessonId }) => get(`learnRecords?lessonId=${lessonId}&x-per-page=1&x-order=createdAt-desc`),
  getLastLearnRecords: async () => get('learnRecords?x-per-page=1&x-order=createdAt-desc'),
  getPackageLearnRecords: async params => get('learnRecords', { params: { 'x-per-page': 100, 'x-order': 'createdAt-desc', ...params } })
}

export const users = {
  getUserDetail: () => get('users'),
  userSubscribes: args =>
    get(`users/${args.userId}/subscribes`, { params: args }),
  userSkills: args => get(`users/${args.userId}/skills`),
  toBeTeacher: ({ userId, key, school, config }) =>
    post(`users/${userId}/teacher`, { key, school }, config),
  getTeachingRecords: async () => get('packages'),
  setNickname: ({ nickname, id }) => put(`users/${id}`, { nickname }),
  uploadSelfLearnRecords: (id, payload) => put(`learnRecords/${id}`, payload),
  createLearnRecords: async payload => {
    const res = await post('learnRecords', payload)
    event('lesson', 'start_lesson', 'keepwork', payload.lessonId)
    return res
  },
  learnRecords: () => get('learnRecords'),
  verifyToken: ({ token }) => {
    let instance = axios.create({
      baseURL: process.env.LESSON_API_PREFIX
    })
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return instance.post('users')
  }
}

export const classrooms = {
  join: async payload => {
    const res = await post('classrooms/join', payload)
    event('lesson', 'join_class', 'keepwork', payload.classId)
    return res
  },
  begin: async ({ payload, config }) => {
    const res = await post('classrooms', payload, config)
    event('lesson', 'begin_class', 'keepwork', res.id)
    return res
  },
  leave: async () => {
    const res = await post('classrooms/quit')
    event('lesson', 'quit_class', 'keepwork', 0)
    return res
  },
  getTeachingListing: async () => get('classrooms'),
  currentClass: () => get('classrooms/current'),
  learnRecordsById: id => get(`learnRecords/${id}`),
  getClassroomById: id => get(`classrooms/${id}`),
  dismiss: async ({ classId, config }) => {
    const res = await put(`classrooms/${classId}/dismiss`, null, config)
    event('lesson', 'dismiss_class', 'keepwork', classId)
    return res
  },
  learnRecords: ({ classId, config }) =>
    get(`classrooms/${classId}/learnRecords`, null, config),
  uploadLearnRecords: ({ classId, learnRecords, state }) =>
    put(`learnRecords/${classId}`, { extra: learnRecords, state }),
  getClassroomLearnRecords: id => get(`classrooms/${id}/learnRecords`),
  modifyClassroomLearnRecords: ({ id, learnRecordsArr }) =>
    put(`classrooms/${id}/learnRecords`, learnRecordsArr),
  isValidKey: key => get(`classrooms/valid?key=${key}`),
  isValidLessonId: async (...args) => post('packageLessons/search', ...args),
  getTaughtClassroomCourses: async ({ classId }) => get('classrooms', { params: { classId } }),
  getClassroomInfo: async key => get(`classrooms/getByKey?key=${key}`)
}

export const visitor = {
  uploadLearnRecords: ({ token, classId, learnRecords, state }) => {
    let instance = axios.create({
      baseURL: process.env.LESSON_API_PREFIX
    })
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return instance.put(`learnRecords/${classId}`, {
      extra: learnRecords,
      state
    })
  },
  learnRecordsById: (id, token) => {
    let instance = axios.create({
      baseURL: process.env.LESSON_API_PREFIX
    })
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return instance.get(`learnRecords/${id}`)
  }
}

export const subjects = {
  getAllSubjects: () => get('subjects')
}

export const emails = {
  sendEmails: ({ to, subject, html }) => post('emails', { to, subject, html })
}

export const skills = {
  getAllSkills: () => get('skills')
}

export const trades = {
  getTradesList: () => get('trades')
}

export const lesson = {
  users,
  packages,
  lessons,
  visitor,
  admin,
  classrooms,
  emails,
  skills,
  subjects,
  trades
}

export default lesson
