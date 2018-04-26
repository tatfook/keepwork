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

#button
- name :  //按钮名称
- link :  //按钮点击跳转链接
- target :  //链接从新窗口打开或本窗口打开

#media2
- src  : //当前图片地址
- link : //当前图片跳转链接

#title2
- name : //当前标题内容
- link : //当前标题跳转链接

#subtitle2
- name : //当前副标题内容
- link : //当前副标题跳转链接

#paragraph2
- data : //当前文档内容

#button2
- name :  //按钮名称
- link :  //按钮点击跳转链接
- target :  //链接从新窗口打开或本窗口打开
```
*/

import baseMixin from '../../base/base.mixin'
import index from 'vue'

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
    for (let i = 0; i < 11; i++) {
      responsiveMode(i).title = mixLayerArrColor
      responsiveMode(i).subtitle = mixLayerArrColor
      responsiveMode(i).paragraph = mixLayerArrColor
    }
    for (let i = 9; i < 11; i++) {
      responsiveMode(i).title2 = mixLayerArrColor
      responsiveMode(i).subtitle2 = mixLayerArrColor
      responsiveMode(i).paragraph2 = mixLayerArrColor
    }

    // this.conf.styles[9].data[
    //   '@media only screen and (max-width: 768px)'
    // ].subtitle = {
    //   'margin-top': '8px',
    //   'margin-bottom': '19px'
    // }

    // this.conf.styles[10].data[
    //   '@media only screen and (max-width: 768px)'
    // ].subtitle = {
    //   'margin-top': '8px',
    //   'margin-bottom': '19px'
    // }
  },
  methods: {
    compWrapperOptions(name) {
      let options = {}

      options = _.merge(options, this.generateOptionsStyle(name))

      if (this.modData.styleID == '9' || this.modData.styleID == '10') {
        return _.merge(
          {},
          options,
          (this.modData.media.src = require('@/../static/adi/mixLayer/schoolOne.png')),
          (this.modData.media2.src = require('@/../static/adi/mixLayer/schoolTwo.png'))
        )
      } else {
        return options
      }
    }
  }
}
</script>