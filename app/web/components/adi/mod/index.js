import ModMarkdown from './common/markdown'
import ModIFrame from './common/iframe'
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
import ModPageList from './web/pageList'
import ModToc from './web/toc'
import ModBigFile from './web/bigFile'
import ModTab from './web/tab'
import ModButton from './web/button'
import ModPagePath from './web/pagePath'
import ModCategoryList from './web/categoryList'
import ModPageSwitching from './web/pageSwitching'
import ModLesson from './web/lesson'
import ModQuiz from './web/quiz'
import ModHint from './web/hint'
import ModProject from './web/project'
import ModIframe from './common/iframe'
import ModPpt from './web/ppt'

export const modList = {
  ModMarkdown,
  ModIFrame,
  ModTitle,
  ModMixPosition,
  ModMixLayer,
  ModImg,
  ModMenu,
  ModImgLoop,
  ModParacraft,
  ModQQ,
  ModText,
  ModBoard,
  ModVipRead,
  ModComment,
  ModTextBoard,
  ModPageList,
  ModToc,
  ModBigFile,
  ModTab,
  ModButton,
  ModPagePath,
  ModCategoryList,
  ModPageSwitching,
  ModLesson,
  ModQuiz,
  ModHint,
  ModProject,
  ModIframe,
  ModPpt
}

export const load = modName => {
  return modList[modName]
}

export default {
  load
}
