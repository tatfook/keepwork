import _ from 'lodash'
export default {
  messages: state => state.messages,
  unreadMessagesCount: (state, { unreadList }) => {
    return _.reduce(unreadList, (count, item) => {
      count += item.unReadCount
      return count
    }, 0)
  },
  messagesBox: state => state.messagesBox,
  unreadList: state => state.unreadList
}