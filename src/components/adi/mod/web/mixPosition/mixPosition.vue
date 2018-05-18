<script>
/*doc
---
title: MixPositioin Mod
name: MixPosition Mod
category: Adi Mod
---

This is the MixPosition Mod for usage.

```@MixPosition
styleID: // 样式ID
media:
  src: // 图片来源地址链接
  link: // 图片点击跳转链接
  target: // 链接从新窗口打开或本窗口打开
title:
  name: // 标题名称
  link: // 标题点击跳转链接
  target: // 链接从新窗口打开或本窗口打开
subtitle:
  name: // 副标题名称
  link: // 副标题点击跳转链接
  target: // 链接从新窗口打开或本窗口打开
paragraph:
  data: // 文档内容
button:
  name: // 按钮名称
  link: // 按钮点击跳转链接
  target: // 链接从新窗口打开或本窗口打开

```

*/

import _ from 'lodash'
import baseMixin from '../../base/base.mixin'

export default {
  mixins: [baseMixin],
  methods: {
    compWrapperOptions(name) {
      let options = {}

      options = _.merge(options, this.generateOptionsStyle(name))

      if (this.modData.styleID == '3' || this.modData.styleID == '4') {
        return _.merge(
          {},
          options,
          (this.modData.media.src = require('@/../static/adi/mixPosition/stitching.png'))
        )
      } else {
        return options
      }
    }
  }
}
</script>