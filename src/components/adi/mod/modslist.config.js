import ModHeader from './web/header'
import ModTitle from './web/title'
import ModBoard from './web/board'
import ModText from './web/text'
import ModQQ from './web/qq'
import ModMixPositon from './web/mixPosition'
import ModImgLoop from './web/imgLoop'
import ModParacraft from './web/paracraft'
import ModVipRead from './web/vipRead'
import ModComment from './web/comment'

var modsList = [
  {
    id: 1,
    label: '全部',
    mods: [
      ModHeader,
      ModTitle,
      ModBoard,
      ModImgLoop,
      ModText,
      ModParacraft,
      ModQQ,
      ModMixPositon,
      ModVipRead,
      ModComment
    ]
  }
  // {
  //   id: 2,
  //   label: '常用',
  //   children: [
  //     {
  //       id: 3,
  //       label: '测试',
  //       mods: []
  //     }
  //   ]
  // }
]
export default modsList
