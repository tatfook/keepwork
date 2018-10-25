
const getUrl = ({ protocol = 'paracraft', paramA = '', paramB = '', usertoken = '', link = '' }) => {
  let actualUrl = `protocol="${protocol}" paramA="${paramA}" paramB="${paramB}" usertoken="${usertoken}" cmd/loadworld ${link}`
  let encodeUrl = encodeURIComponent(actualUrl)
  return `${protocol}://${encodeUrl}`
}
export default {
  getUrl
}
