import createEndpoint from './common/endpoint'

const client = createEndpoint({
  baseURL: process.env.ES_GATEWAY_BASE_URL
})

/*doc
---
title: search
name: search
category: elasticsearch gateway
---

> https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-search

```
@options {
  index,
  type,
  body //query body
}
```
*/
export const search = async options => {
  return client.post('es/search', options)
}

/*doc
---
title: submit Git Data
name: submitGitData
category: elasticsearch gateway
---
| Parameter | Type   | Description |
| --------- | ----   | ----------- |
| path      | String | page url path. eg: chenqh/demo/index.md |
| action    | String | create, edit, or delete |
| content   | String | page content |
| options   | Object | extra options for specify services |

*/
export const submitGitData = async (path, action, content, options) => {
  return client.post('git/commit', { path, action, content, options })
}

export default {
  search,
  submitGitData
}
