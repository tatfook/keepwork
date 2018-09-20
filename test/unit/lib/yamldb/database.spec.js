import sinon from 'sinon'
import YamlDB from '@/lib/yamldb/database'
import { GitAPI } from '@/api/git'

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
  beforeEach(() => {
    sandbox = sinon.createSandbox()
    sandbox.stub(GitAPI.prototype, 'upsertFile').returns(true)
  })
  afterEach(() => {
    sandbox.restore()
  })
  test('should create instance with new key', async () => {
    let result = await testDB.create('test', { hello: 'world' })
    expect(typeof (result.key)).toBe('string')
  })
  test('should failed to update instance without a key', async () => {
    let result = await testDB.update('test', { hello: 'world' })
    expect(!result).toEqual(true)
  })
  test('should upserct instance with new key', async () => {
    let result = await testDB.create('test', { hello: 'world' })
    expect(typeof (result.key)).toBe('string')
  })
})
