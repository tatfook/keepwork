import ModMarkdown from './common/markdown'
import ModTitle from './web/title'
import ModBoard from './web/board'
import ModText from './web/text'
import ModQQ from './web/qq'
import ModMixLayer from './web/mixLayer'
import ModMixPositon from './web/mixPosition'
import ModImg from './web/img'
import ModImgLoop from './web/imgLoop'
import ModParacraft from './web/paracraft'
import ModVipRead from './web/vipRead'
import ModComment from './web/comment'
import ModMenu from './web/menu'
import ModTextBoard from './web/textBoard'
// import ModPageList from './web/pageList'
// import ModToc from './web/toc'

var modsList = [
  {
    id: 1,
    label: 'modList.recent',
    children: [
      {
        id: '1-1',
        label: 'modList.markdown',
        mods: [ModMarkdown]
      },
      {
        id: '1-2',
        label: 'modList.board',
        mods: [ModBoard]
      }
    ]
  },
  {
    id: 2,
    label: 'modList.navigation',
    children: [
      {
        id: '2-1',
        label: 'modList.menu',
        mods: [ModMenu]
      },
      {
        id: '2-2',
        label: 'modList.headNavigation',
        mods: [ModTitle]
      }
    ]
  },
  {
    id: 3,
    label: 'modList.graphic',
    children: [
      {
        id: '3-1',
        label: 'modList.carousel',
        mods: [ModImgLoop]
      },
      {
        id: '3-2',
        label: 'modList.widescreenImage',
        mods: [ModImg]
      },
      {
        id: '3-3',
        label: 'modList.board',
        mods: [ModBoard]
      }
    ]
  },
  {
    id: 4,
    label: 'modList.text',
    children: [
      {
        id: '4-1',
        label: 'modList.markdown',
        mods: [ModMarkdown]
      },
      // {
      //   id: '4-2',
      //   label: 'modList.toc',
      //   mods: [ModToc]
      // },
      {
        id: '4-2',
        label: 'modList.text',
        mods: [ModText]
      },
      {
        id: '4-3',
        label: 'modList.menu',
        mods: [ModMenu]
      }
      // {
      //   id: '4-5',
      //   label: 'modList.pageList',
      //   mods: [ModPageList]
      // }
    ]
  },
  {
    id: 5,
    label: 'modList.interative',
    children: [
      {
        id: '5-1',
        label: 'modList.comment',
        mods: [ModComment]
      },
      // {
      //   id: '5-2',
      //   label: 'modList.pageList',
      //   mods: [ModPageList]
      // },
      {
        id: '5-2',
        label: 'modList.qq',
        mods: [ModQQ]
      }
    ]
  },
  {
    id: 6,
    label: 'modList.mixAndMatch',
    children: [
      {
        id: '6-1',
        label: 'modList.headNavigation',
        mods: [ModTitle]
      },
      {
        id: '6-2',
        label: 'modList.text',
        mods: [ModText]
      },
      {
        id: '6-3',
        label: 'modList.mixPosition',
        mods: [ModMixPositon]
      },
      {
        id: '6-4',
        label: 'modList.mixLayer',
        mods: [ModMixLayer]
      },
      {
        id: '6-5',
        label: 'modList.paracraft',
        mods: [ModParacraft]
      },
      {
        id: '6-6',
        label: 'modList.textBoard',
        mods: [ModTextBoard]
      }
    ]
  },
  {
    id: 7,
    label: 'modList.other',
    children: [
      {
        id: '7-1',
        label: 'modList.paracraft',
        mods: [ModParacraft]
      },
      {
        id: '7-2',
        label: 'modList.vipRead',
        mods: [ModVipRead]
      }
    ]
  }
]
export default modsList
