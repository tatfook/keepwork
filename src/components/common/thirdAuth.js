import Vue from 'vue'
import vueAxios from 'vue-axios'
import VueAuthenticate from 'vue-authenticate'
import axios from 'axios'
Vue.use(vueAxios, axios)
Vue.use(VueAuthenticate, {
  providers: {
    github: {
      name: 'github',
      clientId: '2219fe9cb6d105dd30fb',
      scope: ['user:email'],
      url: `${window.location.origin}/api/wiki/auth/github`,
      redirectUri: `${window.location.origin}/api/wiki/auth/github` // Your client app URL
    }
  }
})
