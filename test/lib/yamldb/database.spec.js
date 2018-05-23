import sinon from 'sinon'
import YamlDB from '@/lib/yamldb/database'
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

const testDB = new YamlDB(gitConfig)

describe('Yaml database', () => {
  let sandbox
  before(() => {
    sandbox = sinon.createSandbox()
    sandbox.stub(GitAPI.prototype, 'upsertFile').returns(true)
  })
  after(() => {
    sandbox.restore()
  })
  it('should create instance with new key', async () => {
    let result = await testDB.create('test', { hello: 'world' })
    expect(result.key).to.be.a('string')
  })
  it('should failed to update instance without a key', async () => {
    let result = await testDB.update('test', { hello: 'world' })
    expect(!result).to.equal(true)
  })
  it('should upserct instance with new key', async () => {
    let result = await testDB.create('test', { hello: 'world' })
    expect(result.key).to.be.a('string')
  })
})
