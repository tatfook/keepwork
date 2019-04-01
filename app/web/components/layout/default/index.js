/* global isBrowser */
export default {
  name: 'Layout',
  props: ['title', 'description', 'keywords'],
  components: {},
  computed: {
    vTitle() {
      return this.$root.title || this.title || 'KeepWork'
    },
    vKeywords() {
      return this.$root.keywords || this.keywords || 'KeepWork'
    },
    vDescription() {
      return this.$root.description || this.description || 'KeepWork'
    },
    baseClass() {
      return this.$root.baseClass
    }
  },
  template: EASY_ENV_IS_BROWSER ? '<div id="app"><slot></slot></div>' : `<!DOCTYPE html>
                  <html lang="en">
                    <head>
                      <title>{{vTitle}}</title>
                      <meta name="keywords" :content="vKeywords">
                      <meta name="description" :content="vDescription">
                      <meta http-equiv="content-type" content="text/html;charset=utf-8">
                      <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
                      <link rel="stylesheet" href="//at.alicdn.com/t/font_667420_3v4yfrlsa58.css">
                    </head>
                    <body :class="baseClass">
                    <div id="app">
                     <slot></slot>
                    </div>
                    </body>
                  </html>`

}