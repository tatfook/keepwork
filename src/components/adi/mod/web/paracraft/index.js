import { generateProperties } from '@/components/adi/mod/base/base.utils'
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
  paracraftInfo: 'AdiLabel'
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

export default { mod, name, components, properties, styles, templates }
