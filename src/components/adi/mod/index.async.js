const ModMarkdown = () => import('./common/markdown')
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
const ModLesson = () => import('./web/lesson')
const ModQuiz = () => import('./web/quiz')
const ModTeachers = () => import('./web/teachers')
const ModLessonGet = () => import('./web/lessonGet')
const ModLessonPackage = () => import('./web/lessonPackage')
const ModTextBoard = () => import('./web/textBoard')
const ModPageList = () => import('./web/pageList')
const ModToc = () => import('./web/toc')
const ModBigFile = () => import('./web/bigFile')

export const modList = {
  ModMarkdown,
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
  ModLesson,
  ModQuiz,
  ModTeachers,
  ModLessonGet,
  ModLessonPackage,
  ModTextBoard,
  ModPageList,
  ModToc,
  ModBigFile
}

export const load = async modName => {
  const mod = modList[modName]

  if (mod) return mod()
}

export default {
  load
}
