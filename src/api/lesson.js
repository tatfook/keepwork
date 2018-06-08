import axios from 'axios'
import qs from 'qs'

export const lessonHost = process.env.LESSON_API_PREFIX

const client = axios.create({
  baseURL: lessonHost,
  withCredentials: true
})

export const auth = async () => {
  const result = await client.get('/api/member/auth')
  return result.data
}

export const addSubscribe = async (packageId) => {
  const result = await client.post('/api/subscribe/add', qs.stringify({
    packageId: packageId
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return result.data
}

export const subscribeState = async (packageId) => {
  const result = await client.get('/api/subscribe/state', {
    params: {
      packageId: packageId
    }
  })
  return result.data
}

export const shareRecord = async (lessonUrl, username) => {
  const result = await client.get('/api/record/share', {
    params: {
      lessonUrl: lessonUrl,
      username: username
    }
  })
  return result.data
}

export const studyRecord = async (sn) => {
  const result = await client.post('/api/record/study', qs.stringify({
    sn: sn
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return result.data
}

export const resurmeClass = async (object) => {
  const result = await client.post('/api/class/resurme', qs.stringify(object), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return result.data
}

export const performanceClass = async (object) => {
  const result = await client.post('/api/class/performance', qs.stringify(object), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return result.data
}

export const upsertRecord = async (object) => {
  const result = await client.post('/api/record/saveOrUpdate', qs.stringify(object), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return result.data
}

export const learnRecordDetail = async (sn) => {
  const result = await client.get('/api/record/learnDetailBySn', {
    params: {
      sn: sn
    }
  })
  return result.data
}

export const beginClass = async (object) => {
  const result = await client.post('/api/class/begin', qs.stringify(object), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return result.data
}

export const finishClass = async (object) => {
  const result = await client.post('/api/class/finish', qs.stringify(object), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return result.data
}

export const upsertPackage = async (object) => {
  const result = await client.post('/api/package/createOrUpdate', qs.stringify(object), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return result.data
}

export const lessonList = async () => {
  const result = await client('/api/class/lesson')
  return result.data
}

export const enterClass = async (object) => {
  const result = await client.post('/api/class/enter', qs.stringify(object), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return result.data
}

export const replayClass = async (object) => {
  const result = await client.post('/api/class/replay', qs.stringify(object), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return result.data
}

export default {
  auth,
  addSubscribe,
  subscribeState,
  shareRecord,
  studyRecord,
  resurmeClass,
  performanceClass,
  upsertRecord,
  learnRecordDetail,
  beginClass,
  finishClass,
  upsertPackage,
  lessonList,
  lessonHost,
  enterClass,
  replayClass
}
