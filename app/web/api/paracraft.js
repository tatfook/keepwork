import createEndpoint from './common/endpoint'

export const paracraftEndpoint = createEndpoint({
  baseURL: process.env.KEEPWORK_API_PREFIX
})

const { get, post } = paracraftEndpoint

export const pBlocks = {
  getClassifies: async () => get('pBlocks/systemClassifies'),
  getCopms: async () => get('pBlocks/system'),
  updateUsedCount: async ({ id }) => post(`pBlocks/${id}/use`)
}

export const paracraft = {
  pBlocks
}
export default paracraft