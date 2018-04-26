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

var modsList = [
  {
    id: 1,
    label: 'modList.recent',
    children: [
      {
        id: '1-1',
        label: 'modList.title',
        mods: [ModTitle]
      },
      {
        id: '1-2',
        label: 'modList.menu',
        mods: [ModMenu]
      },
      {
        id: '1-3',
        label: 'modList.widescreenImage',
        mods: [ModImg]
      },
      {
        id: '1-4',
        label: 'modList.text',
        mods: [ModText]
      },
      {
        id: '1-5',
        label: 'modList.markdown',
        mods: [ModMarkdown]
      },
      {
        id: '1-6',
        label: 'modList.mixPosition',
        mods: [ModMixPositon]
      },
      {
        id: '1-7',
        label: 'modList.mixLayer',
        mods: [ModMixLayer]
      },
      {
        id: '1-8',
        label: 'modList.carousel',
        mods: [ModImgLoop]
      }
    ]
  },
  {
    id: '2',
    label: 'modList.graphic',
    children: [
      {
        id: '2-1',
        label: 'modList.widescreenImage',
        mods: [ModImg]
      },
      {
        id: '2-2',
        label: 'modList.carousel',
        mods: [ModImgLoop]
      },
      {
        id: '2-3',
        label: 'modList.board',
        mods: [ModBoard]
      }
    ]
  },
  {
    id: '3',
    label: 'modList.text',
    children: [
      {
        id: '3-1',
        label: 'modList.text',
        mods: [ModText]
      },
      {
        id: '3-2',
        label: 'modList.markdown',
        mods: [ModMarkdown]
      },
      {
        id: '3-3',
        label: 'modList.menu',
        mods: [ModMenu]
      }
    ]
  },
  {
    id: '4',
    label: 'modList.interative',
    children: [
      {
        id: '4-1',
        label: 'modList.comment',
        mods: [ModComment]
      },
      {
        id: '4-3',
        label: 'modList.qq',
        mods: [ModQQ]
      }
    ]
  },
  {
    id: '5',
    label: 'modList.mixAndMatch',
    children: [
      {
        id: '5-1',
        label: 'modList.title',
        mods: [ModTitle]
      },
      {
        id: '5-2',
        label: 'modList.paracraft',
        mods: [ModParacraft]
      },
      {
        id: '5-3',
        label: 'modList.text',
        mods: [ModText]
      },
      {
        id: '5-4',
        label: 'modList.mixPosition',
        mods: [ModMixPositon]
      },
      {
        id: '5-5',
        label: 'modList.mixLayer',
        mods: [ModMixLayer]
      }
    ]
  },
  {
    id: '6',
    label: 'modList.works',
    children: [
      {
        id: '6-1',
        label: 'modList.paracraft',
        mods: [ModParacraft]
      }
    ]
  },
  {
    id: '7',
    label: 'modList.specialPerformance',
    children: [
      {
        id: '7-1',
        label: 'modList.board',
        mods: [ModBoard]
      },
      {
        id: '7-2',
        label: 'modList.carousel',
        mods: [ModImgLoop]
      },
      {
        id: '7-3',
        label: 'modList.markdown',
        mods: [ModMarkdown]
      }
    ]
  },
  {
    id: '8',
    label: 'modList.setting',
    children: [
      {
        id: '8-1',
        label: 'modList.qq',
        mods: [ModQQ]
      },
      {
        id: '8-3',
        label: 'modList.vipRead',
        mods: [ModVipRead]
      }
    ]
  }
]
export default modsList
