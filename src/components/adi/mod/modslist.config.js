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
import ModLesson from './web/lesson'
import ModMenu from './web/menu'
import ModQuizz from './web/quizz'

var modsList = [
  {
    id: 1,
    label: '常用',
    children: [
      {
        id: '1-1',
        label: 'Markdown',
        mods: [ModMarkdown]
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
      },
      {
        id: '1-4',
        label: '图文叠加',
        mods: [ModMixLayer]
      },
      {
        id: '1-5',
        label: '图文拼接',
        mods: [ModMixPositon]
      },
      {
        id: '1-6',
        label: '菜单',
        mods: [ModMenu]
      },
      {
        id: '1-7',
        label: '标题',
        mods: [ModTitle]
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
      },
      {
        id: '2-2',
        label: '图像宽屏',
        mods: [ModImg]
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
      },
      {
        id: '5-2',
        label: '图文叠加',
        mods: [ModMixLayer]
      },
      {
        id: '5-3',
        label: '图文拼接',
        mods: [ModMixPositon]
      },
      {
        id: '5-4',
        label: 'Paracraft作品',
        mods: [ModParacraft]
      }
    ]
  },
  {
    id: '6',
    label: '作品',
    children: [
      {
        id: '6-1',
        label: 'Paracraft作品',
        mods: [ModParacraft]
      }
    ]
  },
  {
    id: '7',
    label: '特殊表现',
    children: [
      {
        id: '7-1',
        label: '图文轮播',
        mods: [ModImgLoop]
      },
      {
        id: '7-2',
        label: '绘图板',
        mods: [ModBoard]
      },
      {
        id: '7-3',
        label: 'VIP阅读',
        mods: [ModVipRead]
      },
      {
        id: '7-4',
        label: '评论',
        mods: [ModComment]
      }
    ]
  },
  {
    id: '8',
    label: '设置',
    children: [
      {
        id: '8-1',
        label: '调用QQ聊天',
        mods: [ModQQ]
      }
    ]
  },
  {
    id: '9',
    label: 'Lesson',
    children: [
      {
        id: '9-1',
        label: 'ModLesson',
        mods: [ModLesson]
      },
      {
        id: '9-2',
        label: 'ModQuizz',
        mods: [ModQuizz]
      }
    ]
  }
]
export default modsList
