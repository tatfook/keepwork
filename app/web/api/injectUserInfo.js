import { keepwork } from '@/api'
import _ from 'lodash'

async function injectUserInfo(params) {
  const { data, appendKey = 'user', searchField = 'username', fieldValueKey } = params
  const searchParams = buildParams(params)
  const users = await fetchUserInfo(searchParams)
  const res = await injectData({
    data,
    users,
    appendKey,
    searchField,
    fieldValueKey
  })
  return res
}

function buildParams({ data, searchField = 'username', fieldValueKey }) {
  const params = {}
  fieldValueKey = fieldValueKey || searchField
  const arr = _.map(data, item => _.get(item, fieldValueKey))
  _.set(params, [searchField, '$in'], arr)
  return params
}
async function fetchUserInfo(params) {
  const users = await keepwork.user.searchByField(params)
  return users.rows
}

async function injectData({ data, users, appendKey, searchField, fieldValueKey }) {
  fieldValueKey = fieldValueKey || searchField
  const res = _.map(data, item => {
    const findUser = _.find(users, user => user[searchField] === _.get(item, fieldValueKey))
    if (findUser) {
      if (appendKey) {
        _.set(item, appendKey, findUser)
      } else {
        item = { ...item, ...findUser }
      }
    }
    return item
  })
  return res
}


export default injectUserInfo
