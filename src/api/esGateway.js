import axios from 'axios'
import Cookies from 'js-cookie'

const client = axios.create({
  baseURL: process.env.ES_GATEWAY_BASE_URL
})

// TODO
// FIXME, should pass token through the options parameter
const tokenConfig = () => {
  return { headers: { Authorization: 'Bearer ' + Cookies.get('token') } }
}

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
  const result = await client.post('es/search', options, tokenConfig())
  return result.data
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
  return client.post('git/commit', {path, action, content, options}, tokenConfig())
}

export default {
  search,
  submitGitData
}
