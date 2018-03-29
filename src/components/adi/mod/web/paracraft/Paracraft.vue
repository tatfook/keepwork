<script>
import _ from 'lodash'
import baseMixin from '../../base/base.mixin'

export default {
  mixins: [baseMixin],
  data() {
    return {
      isShowInnerModal: false
    }
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
                {self.modData.paracraft_info.desc_info
                  ? self.modData.paracraft_info.desc_info
                  : '如果您的设备没有自动使用Paracraft启动3D世界，请安装Paracraft'}
              </p>
              <el-button on-click={this.downloadUrl} plain>
                {self.modData.paracraft_info.download_info
                  ? self.modData.paracraft_info.download_info
                  : '点击下载'}
              </el-button>
            </div>
          )
        },
        methods: {
          downloadUrl() {
            let downloadUrl = self.modData.paracraft_info.client_url
              ? self.modData.paracraft_info.client_url
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
