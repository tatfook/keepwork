import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'

const name = 'ModMarkdown'

const components = {
  md: 'AdiMarkdown'
}

const styles = [
  {
    theme: {
      root: [],
      rootRow: ['mod-full-width']
    },
    options: {
      config: {
        md: {
          emptyData: 'adi.markdown.markdown'
        }
      }
    },
    useImage: true,
    cover: require('@/../static/adi/markdown.png')
  }
]
const templates = [[{ colMarkdown: 'md' }]]

const properties = generateProperties(name, components)
properties.styleID = undefined

export default { mod, name, components, properties, styles, templates }
