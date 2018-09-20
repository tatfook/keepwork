import _ from 'lodash'
import moment from 'moment'
const getters = {
  userinfo: state => state.userinfo,
  learnDayCount: (state, { userinfo }) =>
    _.get(userinfo, 'extra.learn.learnDayCount', 1),
  lastLearnDate: (state, { userinfo }) =>
    _.get(userinfo, 'extra.learn.lastLearnDate', ''),
  today: state => moment().format('YYYYMMDD'),
  howManyDays: (state, { today, lastLearnDate, learnDayCount }) =>
    lastLearnDate === today ? learnDayCount : learnDayCount + 1,
  userId: (state, { userinfo }) => _.get(userinfo, 'id', ''),
  lockCoin: (state, { userinfo }) => _.get(userinfo, 'lockCoin', 0),
  packageDetail: state => ({ packageId }) =>
    _.get(state.packagesDetail, packageId),
  lessonDetail: state => ({ lessonId }) => _.get(state.lessonsDetail, lessonId),
  skills: state => state.skills,
  subjects: state => state.subjects,
  isShowLoginDialog: state => state.isShowLoginDialog
}

export default getters
