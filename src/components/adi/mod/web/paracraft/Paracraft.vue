<script>
/*doc
---
title: Paracraft Mod
name: Paracraft Mod
category: Adi Mod
---

This is the Paracraft Mod for usage.

```@Paracraft
styleID: // 样式ID
preview:
  src: // 预览图来源地址链接
  link: // 预览图点击跳转链接
  target: // 链接从新窗口打开或本窗口打开
desc:
  data: //作品描述内容
worldName:
  name: // 作品标题名称
  link: // 作品标题链接
  target: // 链接从新窗口打开或本窗口打开
author:
  text: // 作者名称
  desc: // 作者label描述
  link: // 作者链接
  target: // 链接从新窗口打开或本窗口打开
version:
  text: // 版本号
  desc: // 版本label描述
  link: // 版本链接
  target: // 链接从新窗口打开或本窗口打开
updateTime:
  text: // 更新时间
  link: // 更新链接
  target: // 链接从新窗口打开或本窗口打开
viewTimesImg:
  src: // 图片来源地址链接
  link: // 图片点击跳转链接
  target: // 链接从新窗口打开或本窗口打开
viewTimes:
  text: // 浏览次数
  desc: // 浏览描述
  link: // 浏览链接
  target: // 链接从新窗口打开或本窗口打开
size:
  text: // 大小
  desc: // 大小描述
  link: // 大小链接
  target: // 链接从新窗口打开或本窗口打开
download:
  name: // 下载按钮名称
  link: // 下载按钮名称链接
  target: // 链接从新窗口打开或本窗口打开
enter:
  name: // 进入按钮名称
  link: // 进入按钮链接
  target: // 链接从新窗口打开或本窗口打开
innerModal:
  hidden: //内部模态框隐藏与否
paracraftInfo:
  text: // 未安装Paracraft客户端提示文字
  link: // 下载Paracraft客户端链接
  target: // 链接从新窗口打开或本窗口打开

```

*/
import _ from 'lodash'
import baseMixin from '../../base/base.mixin'
import { mapGetters } from 'vuex'

export default {
  mixins: [baseMixin],
  data() {
    return {
      isShowInnerModal: false
    }
  },
  computed: {
    ...mapGetters({
      token: 'user/token'
    })
  },
  methods: {
    compWrapperOptions(name) {
      let self = this

      const innerModalComponent = {
        name: 'InnerModalComponent',
        render() {
          return (
            <div style="text-align: center;">
              <p style="font-size: 18px;margin-top: 40px;width: 100%;">
                {self.modData.paracraftInfo.desc_info
                  ? self.modData.paracraftInfo.desc_info
                  : '如果您的设备没有自动使用Paracraft启动3D世界，请安装Paracraft'}
              </p>
              <el-button on-click={this.downloadUrl} plain>
                {self.modData.paracraftInfo.download_info
                  ? self.modData.paracraftInfo.download_info
                  : '点击下载'}
              </el-button>
            </div>
          )
        },
        methods: {
          downloadUrl() {
            let downloadUrl = self.modData.paracraftInfo.client_url
              ? self.modData.paracraftInfo.client_url
              : 'http://www.paracraft.cn'
            window.open(downloadUrl)
          }
        }
      }

      let options = {}

      options = _.merge(options, this.generateOptionsStyle(name))

      if (name == 'innerModal') {
        return _.merge(
          {},
          options,
          { innerModalComponent },
          {
            isShowInnerModal: self.isShowInnerModal,
            hideModal: () => {
              self.isShowInnerModal = false
            }
          }
        )
      } else if (name == 'enter') {
        return _.merge({}, options, {
          clickEvent: true,
          callback: () => {
            let urlprotocol = self.modData.urlprotocol
            let protocol =
              urlprotocol && urlprotocol.protocol
                ? urlprotocol.protocol
                : 'paracraft'
            let paramA =
              urlprotocol && urlprotocol.paramA
                ? JSON.stringify(urlprotocol.paramA)
                : ''
            let paramB =
              urlprotocol && urlprotocol.paramB
                ? JSON.stringify(urlprotocol.paramB)
                : ''
            let token = this.token ? this.token : ''
            let link = self.modData.enter.link
              ? self.modData.enter.link
              : self.style.options.config.enter.emptyLink

            let url =
              protocol +
              ':// protocol="' +
              protocol +
              '" paramA="' +
              paramA +
              '" paramB="' +
              paramB +
              '" usertoken="' +
              token +
              '" cmd/loadworld ' +
              link

            window.open(url)

            self.isShowInnerModal = true
          }
        })
      } else {
        return options
      }
    }
  }
}
</script>
