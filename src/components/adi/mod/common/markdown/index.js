import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'

const name = 'ModMarkdown'

const components = {
  md: 'AdiMarkdown'
}

const styles = [{
  theme: {
    root: ['mod-space'],
    rootRow: ['mod-full-width']
  },
  options: {
    config: {
      md: {
        emptyData: 'adi.markdown.markdown'
      }
    }
  },
  cover: require('@/../static/adi/markdown.jpeg')
}]
const templates = [[{ colMarkdown: 'md' }]]

const properties = generateProperties(name, components)
properties.styleID = undefined

console.log(properties)

export default { mod, name, components, properties, styles, templates }
