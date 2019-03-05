import _ from 'lodash'
import moment from 'moment'
const getters = {
  userinfo: state => state.userinfo,
  userIdenity: (state, { userinfo }) => _.get(userinfo, 'identify'),
  tutorService: (state, { userinfo }) => _.get(userinfo, 'tutorService'),
  isPurchasedTutor: (state, { tutorService }) => {
    if (!tutorService) {
      return false
    }
    let { startTime, endTime } = tutorService
    let nowDate = new Date()
    return nowDate.valueOf() >= startTime && nowDate.valueOf() <= endTime
  },
  teacherInfo: (state, { userinfo }) => _.get(userinfo, 'teacher'),
  isTeacher: (state, { teacherInfo, userIdenity }) => {
    if (!teacherInfo) {
      return userIdenity === 2
    }
    let { startTime, endTime } = teacherInfo
    let nowDate = new Date()
    return nowDate.valueOf() >= startTime && nowDate.valueOf() <= endTime
  },
  allianceInfo: (state, { userinfo }) => _.get(userinfo, 'allianceMember'),
  isAlliance: (state, { allianceInfo, isTeacher }) => {
    if (!allianceInfo || isTeacher) {
      return false
    }
    let { startTime, endTime } = allianceInfo
    let nowDate = new Date()
    return nowDate.valueOf() >= startTime && nowDate.valueOf() <= endTime
  },
  isLearner: (state, { isTeacher, isAlliance }) => {
    return !isTeacher && !isAlliance
  },
  learnDayCount: (state, { userinfo }) =>
    _.get(userinfo, 'extra.learn.learnDayCount', 0),
  lastLearnDate: (state, { userinfo }) =>
    _.get(userinfo, 'extra.learn.lastLearnDate', ''),
  today: state => moment().format('YYYYMMDD'),
  howManyDays: (state, { today, lastLearnDate, learnDayCount }) => {
    return lastLearnDate.toString() === today.toString()
      ? learnDayCount
      : learnDayCount + 1
  },
  userId: (state, { userinfo }) => _.get(userinfo, 'id', ''),
  lockCoin: (state, { userinfo }) => _.get(userinfo, 'lockCoin', 0),
  packagesList: (state) => state.packagesList,
  packageDetail: state => ({ packageId }) =>
    _.get(state.packagesDetail, packageId),
  lessonDetail: state => ({ lessonId }) => _.get(state.lessonsDetail, lessonId),
  skills: state => state.skills,
  subjects: state => state.subjects,
  isShowLoginDialog: state => state.isShowLoginDialog,
  previewFlag: state => state.previewFlag
}

export default getters
