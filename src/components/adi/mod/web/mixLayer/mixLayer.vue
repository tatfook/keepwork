<script>
/*doc
---
title: MixLayer Mod
name: MixLayer Mod
category: Adi Mod
---

This is the MixLayer Mod for usage.

```@MixLayer
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

```

*/

import baseMixin from '../../base/base.mixin'

export default {
  mixins: [baseMixin],
  created() {
    let mixLayerArrColor = { color: this.themeData('color_4') }
    let self = this
    function responsiveMode(index) {
      return self.conf.styles[index].data[
        '@media only screen and (max-width: 768px)'
      ]
    }
    for (let i = 0; i < 9; i++) {
      responsiveMode(i).title = mixLayerArrColor
      responsiveMode(i).subtitle = mixLayerArrColor
      responsiveMode(i).paragraph = mixLayerArrColor
    }
  }
}
</script>