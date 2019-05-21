import VueSocketIO from 'vue-socket.io'
import { Notification } from 'element-ui'
import Cookies from 'js-cookie'
import jsrsasign from 'jsrsasign'

const token = Cookies.get('token') || ''
let userId = ''
try {
  if (token) {
    const jwtInfo = jsrsasign.KJUR.jws.JWS.readSafeJSONString(
      jsrsasign.b64utoutf8(token.split('.')[1])
    )
    userId = jwtInfo.userId
  }
} catch (error) {
  console.error(error)
}

export const socket = new VueSocketIO({
  debug: true,
  // connection: process.env.SOCKET_WS_PREFIX,
  connection: 'https://socket-stage.keepwork.com',
  // connection: 'https://socket.keepwork.com',
  options: {
    query: {
      // token,
      // userId
    },
    transports: ['websocket']
  }
})

export const socketMixin = {
  data() {
    return {
      socketMessage: ''
    }
  },
  sockets: {
    connect() {
      console.warn('sockets connect 💡')
    },
    async broadcast(data) {
      // Notification({
      //   type: 'info',
      //   title: '收到系统消息',
      //   offset: 50
      // })
      this.socketMessage = data
    }
  }
}
