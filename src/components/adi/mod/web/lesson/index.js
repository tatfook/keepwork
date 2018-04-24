import { generateProperties } from '@/components/adi/mod/base/base.utils'

import styles from './lesson.styles'
import templates from './lesson.templates'
import mod from './Lesson'
import axios from 'axios'

const name = 'ModLesson'

const components = {
  // 这里的 `Adi*` 会指向 src/components/adi/common
  lesson: 'AdiLesson'
}

const lessonHost = 'http://127.0.0.1:3000'
// propertis 为页面上的默认值
const properties = generateProperties(name, components)
const init = function() {
  console.log('init invoke.')
  let vuex = {}
  if (localStorage && localStorage.vuex) {
    vuex = JSON.parse(localStorage.vuex)
  }
  if (vuex.user && vuex.user.info && vuex.user.info.userinfo.username) {
    axios.get(lessonHost + '/api/member/auth', {
      params: {
        username: vuex.user.info.userinfo.username
      }
    }).then(function(response) {
      let r = response.data
      if (r.data && r.data.vipDay >= 0) {
        properties.lesson.vip = true
      } else {
        properties.lesson.vip = false
      }
    })
  } else {
    properties.lesson.vip = false
  }
}
init()
export default { mod, name, components, properties, styles, templates }
