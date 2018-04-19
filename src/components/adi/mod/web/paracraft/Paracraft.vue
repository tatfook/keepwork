<script>
/*doc
---
title: Paracraft Mod
name: Paracraft Mod
category: Adi Mod
---
## @Paracraft

## 参数说明

```

- styleID :  //样式ID

# preview
- src : // Paracraft世界预览图
- link : // 预览图链接

# worldName
- name : // 世界名称
- link : // 世界链接

# author
- text : // 作者名称
- desc : // 作者label 描述
- link : // 作者链接

# version
- text : // 版本号
- desc : // 版本label 描述
- link : // 版本链接

# updateTime
- text : // 更新时间
- link : // 更新链接

# viewTimesImg
- src : // 图片地址
- link : // 图片链接

# viewTimes
- text : // 浏览次数
- desc : // 浏览次数label
- link : // 浏览次数链接

# size
- text : // 世界大小
- desc : // 世界大小label 描述
- link : // 世界大小链接

# download
- name : // 下载按钮名称
- link : // 下载按钮链接

# enter
- name : // 进入按钮名称
- link : // 进入按钮链接

# paracraft_info
- text : // 未安装Paracraft客户端提示文字
- link : // 下载Paracraft客户端链接

```
*/
import _ from 'lodash'
import baseMixin from '../../base/base.mixin'
import { mapGetters } from 'vuex';

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
            let protocol = urlprotocol && urlprotocol.protocol ? urlprotocol.protocol : 'paracraft'
            let paramA = urlprotocol && urlprotocol.paramA ? JSON.stringify(urlprotocol.paramA) : ''
            let paramB = urlprotocol && urlprotocol.paramB ? JSON.stringify(urlprotocol.paramB) : ''
            let token = this.token ? this.token : ''
            let link = self.modData.enter.link ? self.modData.enter.link : self.style.options.config.enter.emptyLink

            let url = protocol + ':// protocol="' + protocol + '" paramA="' + paramA + '" paramB="' + paramB + '" usertoken="' + token + '" cmd/loadworld ' + link

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
