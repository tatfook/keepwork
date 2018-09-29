import _ from 'lodash'

const formatDate = dateObj => {
  if (!dateObj) {
    dateObj = new Date()
  }

  let year = dateObj.getFullYear()
  let month = _.padStart(dateObj.getMonth() + 1, 2, '0')
  let day = _.padStart(dateObj.getDate(), 2, '0')
  let hour = _.padStart(dateObj.getHours(), 2, '0')
  let minute = _.padStart(dateObj.getMinutes(), 2, '0')
  let second = _.padStart(dateObj.getSeconds(), 2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export default formatDate
