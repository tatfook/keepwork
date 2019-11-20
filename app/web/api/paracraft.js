import createEndpoint from './common/endpoint'

export const paracraftEndpoint = createEndpoint({
  baseURL: process.env.KEEPWORK_API_PREFIX
})

export const paracraftOrgEndpoint = createEndpoint({
  baseURL: process.env.LESSON_API_PREFIX
})

const { get, post } = paracraftEndpoint

export const pBlocks = {
  getClassifies: async () => get('pBlocks/systemClassifies'),
  getCopms: async () => get('pBlocks/system'),
  updateUsedCount: async ({ id }) => post(`pBlocks/${id}/use`),
}

export const org = {
  joinOrganization: async params => paracraftOrgEndpoint.post('lessonOrganizationActivateCodes/activate', params),
  getOrganizationList: async () => paracraftOrgEndpoint.get('lessonOrganizations')
}

export const paracraft = {
  pBlocks,
  org
}
export default paracraft
