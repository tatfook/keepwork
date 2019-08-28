import _ from 'lodash'
import Cookies from 'js-cookie'

const getters = {
  systemClassifies: state => state.systemClassifies,
  systemComps: state => state.systemComps,
  userOrgList: state => state.userOrgList,
  paracraftPORT: state => Cookies.get('port') || '8099'
}

export default getters
