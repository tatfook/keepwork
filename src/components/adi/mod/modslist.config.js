import ModHeader from './web/header'
import ModTitle from './web/title'
// import ModBoard from './web/board'
import ModText from './web/text'
import ModQQ from './web/qq'
// import ModMixPositon from './web/mixPosition'
import ModImgLoop from './web/imgLoop'
// import ModParacraft from './web/paracraft'
// import ModVipRead from './web/vipRead'
// import ModComment from './web/comment'

var modsList = [
  {
    id: 1,
    label: '常用',
    children: [
      {
        id: '1-1',
        label: '导航菜单',
        mods: [ModHeader]
      },
      {
        id: '1-2',
        label: '文本',
        mods: [ModText]
      },
      {
        id: '1-3',
        label: '图文轮播',
        mods: [ModImgLoop]
      }
    ]
  },
  {
    id: '2',
    label: '图形',
    children: [
      {
        id: '2-1',
        label: '图文轮播',
        mods: [ModImgLoop]
      }
    ]
  },
  {
    id: '3',
    label: '文本',
    children: [
      {
        id: '3-1',
        label: '文本',
        mods: [ModText]
      }
    ]
  },
  {
    id: '4',
    label: '交互',
    children: [
      {
        id: '4-1',
        label: '调用QQ聊天',
        mods: [ModQQ]
      }
    ]
  },
  {
    id: '5',
    label: '混合搭配',
    children: [
      {
        id: '5-1',
        label: '标题',
        mods: [ModTitle, ModText]
      }
    ]
  },
  {
    id: '6',
    label: '特殊表现',
    children: [
      {
        id: '6-1',
        label: '图文轮播',
        mods: [ModImgLoop]
      }
    ]
  },
  {
    id: '7',
    label: '设置',
    children: [
      {
        id: '7-1',
        label: '调用QQ聊天',
        mods: [ModQQ]
      }
    ]
  }
]
export default modsList
