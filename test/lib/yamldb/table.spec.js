import sinon from 'sinon'
import YamlTable from '@/lib/yamldb/table'
import { GitAPI } from '@/api/gitlab'

const gitConfig = {
  url: 'http://git.release.keepwork.com',
  projectId: 626,
  projectName: 'keepworkheader',
  branch: 'master',
  ref: 'master',
  externalUsername: 'placeintime',
  token: 'fjKLK9aSv4nMU1_bsej2'
}

const testTasble = new YamlTable('test', gitConfig)

describe('Yaml table', () => {
  let sandbox
  before(() => {
    sandbox = sinon.createSandbox()
    sandbox.stub(GitAPI.prototype, 'upsertFile').returns(true)
  })
  after(() => {
    sandbox.restore()
  })
  it('should create instance with new key', async () => {
    let result = await testTasble.create({ hello: 'world' })
    expect(result.key).to.be.a('string')
  })
  it('should failed to update instance without a key', async () => {
    let result = await testTasble.update({ hello: 'world' })
    expect(!result).to.equal(true)
  })
  it('should upserct instance with new key', async () => {
    let result = await testTasble.create({ hello: 'world' })
    expect(result.key).to.be.a('string')
  })
})
