<script>
/*doc
---
title: QQ Mod
name: QQ Mod
category: Adi Mod
---

This is the QQ Mod for usage.

```@QQ
styleID: // 样式ID
qq:
  number: // 填写QQ号码
pic:
  src: // 图片来源地址链接
  link: // 图片点击跳转链接
  target: // 链接从新窗口打开或本窗口打开
desc:
  name: // 描述名称
  link: // 描述点击跳转链接
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

      let qqUrl =
        'http://wpa.qq.com/msgrd?v=3&uin=' +
        this.modData.qq.number +
        '&site=qq&menu=yes'

      if (this.modData.qq.number == null) {
        this.modData.pic.link = ''
      } else {
        this.modData.pic.link = qqUrl
      }

      if (this.editMode) {
        this.style.data.root.position = 'relative'
        this.style.data.colGroup.position = 'relative'
        this.style.data.colGroup.top = 'unset'
      }

      if (this.modData.styleID == '1') {
        return _.merge(
          {},
          options,
          (this.modData.pic.src = './static/adi/qq/qqTwo.svg')
        )
      } else {
        return options
      }
    }
  }
}
</script>