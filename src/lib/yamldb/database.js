import { es, GitAPI } from '@/api'
import uuid from '@/lib/utils/uuid'
import yaml from 'js-yaml'

const DB_FOLDER = '__data__'
const DB_FILE_EXTENSION = '.yml'
const SPLIT_CHAR = '.'
const DEFAULT_TABLE_CONFIG = {
  prefix: 'kw',
  version: 'v0'
}

/*doc
---
title: database
name: database
category: YamlDB
---

### Useage

```
import { YamlDB } from '@/lib/yamldb'

const gitConfig = {
  url: 'http://git.release.keepwork.com',
  projectId: ***,
  projectName: '****',
  branch: 'master',
  ref: 'master',
  externalUsername: '*******',
  token: '*******'
}

const tableConfig = {
  prefix: 'demo',
  version: 'v1'
}

const testDB = new YamlDB(gitConfig, tableConfig) // if tableConfig is null, will use default table config instead

testDB.create('tablename', {hello: world})
testDB.find('tablename', key)
```

*/

export class YamlDB {
  constructor(gitConfig, tableConfig) {
    this.tableConfig = tableConfig || DEFAULT_TABLE_CONFIG
    this.gitClient = new GitAPI(gitConfig)
  }

  newKey() {
    return uuid()
  }

  tableIndex(tableName) {
    const t = this.tableConfig
    return [t.prefix, tableName, t.version].join(SPLIT_CHAR)
  }

  path(tableName, key) {
    const tableIndex = this.tableIndex(tableName)
    key = key || this.newKey()
    return `${DB_FOLDER}/${tableIndex}/${key}${DB_FILE_EXTENSION}`
  }

  fullPath(tableName, key) {
    this.gitClient.getFileGitUrl(this.path(tableName, key))
  }

  yamlData(data) {
    return yaml.safeDump(data)
  }

  async create(tableName, data) {
    return this.upsert(tableName, data)
  }

  async update(tableName, data) {
    if (!data || !data.key) return
    return this.upsert(tableName, data)
  }

  async upsert(tableName, data) {
    if (!tableName || !data) return
    data.key = data.key || this.newKey()
    await this.gitClient.upsertFile(this.path(tableName, data.key), {
      content: this.yamlData(data)
    })
    return data
  }

  async delete(tableName, key) {
    if (!tableName || !key) return
    return this.gitClient.deleteFile(this.path(tableName, key))
  }

  async find(tableName, key) {
    if (!tableName || !key) return
    const content = await this.gitClient.getContent(this.path(tableName, key))
    return yaml.safeLoad(content)
  }

  async query(tableName, esQueryBody) {
    const result = await es.search({
      index: this.tableIndex(tableName),
      type: tableName,
      body: esQueryBody || ''
    })
    if (result && result.hits) {
      return {
        total: result.hits.total,
        list: result.hits.hits.map(val => ({ ...val._source, id: val._id }))
      }
    }

    return { total: 0, list: [] }
  }
}

export default YamlDB
