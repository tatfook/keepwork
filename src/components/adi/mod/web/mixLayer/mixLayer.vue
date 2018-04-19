<script>
/*doc
---
title: mixLayer Mod
name: mixLayer Mod
category: Adi Mod
---

## @mixLayer

## 参数说明

```
- styleID : //当前样式id

#media
- src  : //当前图片地址
- link : //当前图片跳转链接

#title
- name : //当前标题内容
- link : //当前标题跳转链接

#subtitle
- name : //当前副标题内容
- link : //当前副标题跳转链接

#paragraph
- data : //当前文档内容
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