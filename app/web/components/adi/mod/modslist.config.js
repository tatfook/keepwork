import ModMarkdown from './common/markdown'
import ModTitle from './web/title'
import ModBoard from './web/board'
import ModText from './web/text'
import ModQQ from './web/qq'
import ModMixLayer from './web/mixLayer'
import ModMixPosition from './web/mixPosition'
import ModImg from './web/img'
import ModImgLoop from './web/imgLoop'
import ModParacraft from './web/paracraft'
import ModVipRead from './web/vipRead'
import ModComment from './web/comment'
import ModMenu from './web/menu'
import ModTextBoard from './web/textBoard'
import ModIframe from './common/iframe'

import ModLesson from './web/lesson'
import ModQuiz from './web/quiz'
import ModHint from './web/hint'

import ModProject from './web/project'
import ModMixLayerList from './list/mixLayerList'
import ModTextMixLayerList from './group/textMixLayerList'

let modsList = [
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
      },
      {
        id: '1-3',
        label: 'modList.mixlayerlist',
        mods: [ModMixLayerList]
      },
      {
        id: '1-4',
        label: 'modList.textmixlayerlist',
        mods: [ModTextMixLayerList]
      }
    ]
  },
  {
    id: 2,
    label: 'modList.navigation',
    children: [
      {
        id: '2-1',
        label: 'modList.title',
        mods: [ModTitle]
      },
      {
        id: '2-2',
        label: 'modList.menu',
        mods: [ModMenu]
      }
    ]
  },
  {
    id: 3,
    label: 'modList.graphic',
    children: [
      {
        id: '3-1',
        label: 'modList.imgLoop',
        mods: [ModImgLoop]
      },
      {
        id: '3-2',
        label: 'modList.img',
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
        label: 'modList.title',
        mods: [ModTitle]
      },
      {
        id: '6-3',
        label: 'modList.mixPosition',
        mods: [ModMixPosition]
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
    label: 'modList.lesson',
    children: [
      {
        id: '7-1',
        label: 'modList.lesson',
        mods: [ModLesson]
      },
      {
        id: '7-2',
        label: 'modList.quiz',
        mods: [ModQuiz]
      },
      {
        id: '7-3',
        label: 'modList.hint',
        mods: [ModHint]
      }
    ]
  },
  {
    id: 8,
    label: 'modList.project',
    children: [
      {
        id: '8-1',
        label: 'modList.project',
        mods: [ModProject]
      }
    ]
  },
  {
    id: 9,
    label: 'modList.other',
    children: [
      {
        id: '9-1',
        label: 'modList.paracraft',
        mods: [ModParacraft]
      },
      {
        id: '9-2',
        label: 'modList.vipRead',
        mods: [ModVipRead]
      },
      {
        id: '9-3',
        label: 'modList.iframe',
        mods: [ModIframe]
      }
    ]
  }
]
export default modsList
