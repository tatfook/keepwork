import VueSocketIO from 'vue-socket.io'
import { Notification } from 'element-ui'

export const socket = new VueSocketIO({
  debug: true,
  connection: process.env.SOCKET_PREFIX,
  options: {
    query: {

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
      Notification({
        type: 'info',
        title: '收到系统消息',
        offset: 50
      })
      this.socketMessage = data
    }
  }
}
