import YamlDB from './database'

/*doc
---
title: table
name: table
category: YamlDB
---

### Useage

```
import { YamlTable } from '@/lib/yamldb'

const gitConfig = {
  url: 'http://git.release.keepwork.com',
  projectId: ***,
  projectName: '****',
  branch: 'master',
  ref: 'master',
  externalUsername: '*******',
  token: '*******'
}

const table = new YamlTable('tablename', gitConfig)
// or
const testDB = new YamlDB(gitConfig)
const table = new YamlTable('tablename', null, null, testDB)

table.create({hello: world})
table.find(key)
```

*/
export class YamlTable {
  constructor(tableName, gitConfig, tableConfig, yamlDB) {
    this.tableName = tableName
    this.yamlDB = yamlDB || new YamlDB(gitConfig, tableConfig)
  }

  path(key) {
    return this.yamlDB.path(this.tableName, key)
  }

  fullPath(key) {
    return this.yamlDB.fullPath(this.tableName, key)
  }

  async create(data) {
    return this.yamlDB.create(this.tableName, data)
  }

  async update(data) {
    return this.yamlDB.update(this.tableName, data)
  }

  async upsert(data) {
    return this.yamlDB.upsert(this.tableName, data)
  }

  async delete(key) {
    return this.yamlDB.delete(this.tableName, key)
  }

  async find(key) {
    return this.yamlDB.find(this.tableName, key)
  }

  async query(esQueryBody) {
    return this.yamlDB.query(this.tableName, esQueryBody)
  }
}

export default YamlTable
