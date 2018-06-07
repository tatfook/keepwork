const ModMarkdown = () => import('./common/markdown')
const ModIFrame = () => import('./common/iframe')
const ModTitle = () => import('./web/title')
const ModMixPosition = () => import('./web/mixPosition')
const ModMixLayer = () => import('./web/mixLayer')
const ModImg = () => import('./web/img')
const ModMenu = () => import('./web/menu')
const ModImgLoop = () => import('./web/imgLoop')
const ModParacraft = () => import('./web/paracraft')
const ModQQ = () => import('./web/qq')
const ModText = () => import('./web/text')
const ModVipRead = () => import('./web/vipRead')
const ModComment = () => import('./web/comment')
const ModBoard = () => import('./web/board')
const ModTextBoard = () => import('./web/textBoard')
const ModPageList = () => import('./web/pageList')
const ModToc = () => import('./web/toc')
const ModBigFile = () => import('./web/bigFile')
const ModPagePath = () => import('./web/pagePath')
const ModTab = () => import('./web/tab')
const ModButton = () => import('./web/button')
const ModLesson = () => import('./web/lesson')
const ModQuiz = () => import('./web/quiz')
const ModTeachers = () => import('./web/teachers')
const ModLessonShare = () => import('./web/lessonShare')
const ModLessonPackage = () => import('./web/lessonPackage')

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
  ModVipRead,
  ModComment,
  ModBoard,
  ModTextBoard,
  ModPageList,
  ModToc,
  ModBigFile,
  ModPagePath,
  ModTab,
  ModButton,
  ModLesson,
  ModQuiz,
  ModTeachers,
  ModLessonShare,
  ModLessonPackage
}

export const load = async modName => {
  const mod = modList[modName]

  if (mod) return mod()
}

export default {
  load
}
