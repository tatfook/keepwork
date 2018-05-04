import ModMarkdown from './common/markdown'
import ModTitle from './web/title'
import ModMixPosition from './web/mixPosition'
import ModMixLayer from './web/mixLayer'
import ModImg from './web/img'
import ModMenu from './web/menu'
import ModImgLoop from './web/imgLoop'
import ModParacraft from './web/paracraft'
import ModQQ from './web/qq'
import ModText from './web/text'
import ModBoard from './web/board'
import ModVipRead from './web/vipRead'
import ModComment from './web/comment'
import ModTextBoard from './web/textBoard'

export const modList = {
  ModMarkdown,
  ModTitle,
  ModMixPosition,
  ModMixLayer,
  ModImg,
  ModImgLoop,
  ModParacraft,
  ModQQ,
  ModText,
  ModBoard,
  ModVipRead,
  ModComment,
  ModMenu,
  ModTextBoard
}

export const load = modName => {
  return modList[modName]
}

export default {
  load
}
