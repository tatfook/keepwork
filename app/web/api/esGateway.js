import createEndpoint from './common/endpoint'

const client = createEndpoint({
  baseURL: process.env.ES_GATEWAY_BASE_URL
})

const { post, get } = client

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
  return post('es/search', options)
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
  return post('git/commit', { path, action, content, options })
}

export const projects = {
  getProjects: async args => get('projects', { params: args })
}

export const packages = {
  getPackages: async args => get('packages', { params: args })
}

export const users = {
  getUsers: async args => get('users', { params: args })
}

export const webpages = {
  getWebpages: async args => get('pages', { params: args })
}

export const suggestions = {
  getPrefixSuggestions: async args => get('suggestions', { params: args })
}

export default {
  search,
  submitGitData,
  projects,
  packages,
  users,
  webpages,
  suggestions
}
