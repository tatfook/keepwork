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
import ModLesson from './web/lesson'
import ModQuiz from './web/quiz'
import ModTeachers from './web/teachers'
import ModLessonShare from './web/lessonShare'
import ModLessonPackage from './web/lessonPackage'
import ModTextBoard from './web/textBoard'
import ModPageList from './web/pageList'
import ModToc from './web/toc'
import ModBigFile from './web/bigFile'
import ModPagePath from './web/pagePath'
import ModTab from './web/tab'
import ModButton from './web/button'

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
  ModLesson,
  ModQuiz,
  ModTeachers,
  ModLessonShare,
  ModLessonPackage,
  ModTextBoard,
  ModPageList,
  ModToc,
  ModBigFile,
  ModPagePath,
  ModTab,
  ModButton
}

export const load = modName => {
  return modList[modName]
}

export default {
  load
}
