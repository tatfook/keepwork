import { generateProperties } from '@/components/adi/mod/base/base.utils'
// import mod from '@/components/adi/mod/base/Base'
import styles from './paracraft.styles'
import templates from './paracraft.templates'
import mod from './Paracraft'

const name = 'ModParacraft'

const components = {
  preview: 'AdiMedia',
  desc: 'AdiMarkdown',
  worldName: 'AdiTitle',
  author: 'AdiDescLabel',
  version: 'AdiDescLabel',
  updateTime: 'AdiLabel',
  viewTimesImg: 'AdiMedia',
  viewTimes: 'AdiDescLabel',
  size: 'AdiDescLabel',
  download: 'AdiButton',
  enter: 'AdiButton',
  innerModal: 'AdiInnerModal',
  paracraft_info: 'AdiLabel'
}

// let imgsPath    = config.wikiModPath + 'adi/assets/imgs/';
// let showModal = false
// let editorMode = 'editor'//wikiblock.editorMode
// let downloadImg = imgsPath + 'down.png'

// let token = localStorage.getItem('satellizer_token')

// function checkEngine() {
//   showModal = true

//   window.open('paracraft:// usertoken="' + token + '" cmd/loadworld ') // + $scope.params.link_world_url.text
// }

// function clickDownload() {
//   showModal = false
//   let url = 'test' //$scope.params.paracraft_info && $scope.params.paracraft_info.client_url ? $scope.params.paracraft_info.client_url : "http://www.paracraft.cn"

//   window.open(url)
// }

// function closeModal() {
//   showModal = false
// }

// let viewTimes = 0
// let viewTimesUrl = '/api/mod/worldshare/models/worlds/getOneOpus'
// let params = {} //{link_opus_id: $scope.params.link_opus_id.text};

// util.http("POST", viewTimesUrl, params, function (response) {
//   $scope.viewTimes = response.viewTimes;
// }, function (response) { });

// function getSize(size) {
//   if (size <= 1048576) {
//     return parseInt(size / 1024) + 'KB'
//   } else {
//     return parseInt(size / 1024 / 1024) + 'M'
//   }
// }

// $scope.subMarkdownRender = util.subMarkdownRender;

// function convert() {
//   let params_text = '' //wikiblock.blockCache.block.content.replace(/```@paracraft/, "");
//   params_text = params_text.replace(/```/, '')

//   let isJSON = true

//   try {
//     JSON.parse(params_text)
//   } catch (error) {
//     isJSON = false
//   }

//   if (isJSON) {
//     let oldParams = JSON.parse(params_text)
//     let newParams = {}

//     newParams['design'] = { text: 'style1' }

//     for (key in oldParams) {
//       if (key == 'logoUrl') {
//         let logoUrl = JSON.parse(oldParams.logoUrl)

//         for (x in logoUrl) {
//           newParams[key] = { text: {} }

//           for (y in logoUrl[x]) {
//             newParams[key].text[x] = {
//               id: Date.now(),
//               name: y,
//               url: logoUrl[x][y]
//             }
//           }
//         }
//       } else {
//         newParams[key] = { text: oldParams[key] }
//       }
//     }

//     params = newParams

//     // wikiblock.applyModParams(mdconf.jsonToMd(newParams));
//   }
// }

const properties = generateProperties(name, components)

properties.preview.src =
  'http://git.keepwork.com/gitlab_rls_testv2/world_base32_5g5zr2foutszbdpfvwltg/raw/master/preview.jpg'

properties.worldName.name = '默认名字'

properties.author.text = '你的名字'
properties.author.desc = '作者:'

properties.version.text = '0.0.0'
properties.version.desc = '版本'

properties.updateTime.text = '2018-1-10-14-30'
properties.updateTime.link = '#'

properties.viewTimesImg.src =
  'http://keepwork.com/wiki/js/mod/adi/assets/imgs/icon/world3D_eye.png'

properties.viewTimes.text = '0'
properties.viewTimes.desc = '浏览量'

properties.size.text = '31KB'
properties.size.desc = '大小'

properties.download.name = '下载'
properties.download.link = 'http://keepwork.com'

properties.enter.name = '进入'
properties.enter.link = 'http://keepwork.com'

properties.desc.data = `作品简介：
从来都记忆模糊，记不得都去了哪些地方，看了哪些风景，遇到哪些人。尽管同学说，去旅行不在于记忆，而在于当时餐，午餐，晚餐。或许吃得不好，可是却依旧为对方擦去嘴角的油渍。风景如何，其实并不重要。`

export default { mod, name, components, properties, styles, templates }
