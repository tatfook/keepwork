import ModHeader from './web/header'
import ModLogo from './web/logo'
import ModMarkdown from './web/markdown'
var modsList = [
  {
    id: 1,
    label: '全部',
    mods: [ModHeader, ModLogo, ModMarkdown]
  },
  {
    id: 2,
    label: '常用',
    children: [{
      id: 3,
      label: '标题',
      mods: [ModHeader]
    }, {
      id: 4,
      label: '导航菜单',
      mods: [ModLogo]
    }, {
      id: 5,
      label: '文本',
      mods: [ModMarkdown]
    }]
  }
]
export default modsList
