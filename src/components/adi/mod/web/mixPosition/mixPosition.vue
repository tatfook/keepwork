<script>
/*doc
---
title: mixPositioin Mod
name: mixPosition Mod
category: Adi Mod
---

This is the mixPosition Mod for usage.

## @mixPosition

## 参数说明

```
- styleID :  //当前样式id

# media //图像
- src :  //图像地址
- link :  //图像点击跳转链接

# title  //标题
- name :  //标题名称
- link :  //标题点击跳转链接
- target :  //链接从新窗口打开或本窗口打开

# subtitle  //子标题
- name :  //子标题名称
- link :  //子标题点击跳转链接
- target :  //链接从新窗口打开或本窗口打开

# paragraph  //段落文本
- data :  //文本数据内容

# button  //按钮
- name :  //按钮名称
- link :  //按钮点击跳转链接
- target :  //链接从新窗口打开或本窗口打开

# media2 //图像2
- src :  //图像地址
- link :  //图像点击跳转链接

# title2  //标题2
- name :  //标题名称
- link :  //标题点击跳转链接
- target :  //链接从新窗口打开或本窗口打开

# subtitle2  //子标题2
- name :  //子标题名称
- link :  //子标题点击跳转链接
- target :  //链接从新窗口打开或本窗口打开

# paragraph2  //段落文本2
- data :  //文本数据内容

# button2  //按钮2
- name :  //按钮名称
- link :  //按钮点击跳转链接
- target :  //链接从新窗口打开或本窗口打开
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
      } else if (this.modData.styleID == '5' || this.modData.styleID == '6') {
        return _.merge(
          {},
          options,
          (this.modData.media.src = require('@/../static/adi/mixPosition/tripOne.png')),
          (this.modData.title.name = '国外旅行感受'),
          (this.modData.media2.src = require('@/../static/adi/mixPosition/tripTwo.png')),
          (this.modData.title2.name = '国外旅行感受')
        )
      } else {
        return options
      }
    }
  }
}
</script>