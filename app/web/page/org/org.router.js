import Vue from 'vue'
import Router from 'vue-router'
const OrgLogin = () => import('@/components/org/OrgLogin')
const OrgPrint = () => import('@/components/org/OrgPrint')
const OrgReport = () => import('@/components/org/OrgReport')
const OrgContact = () => import('@/components/org/OrgContact')
const OrgNotFound = () => import('@/components/org/OrgNotFound')
const OrgMessage = () => import('@/components/org/OrgMessage')
const OrgTeacherContainer = () => import('@/components/org/OrgTeacher')
const OrgTeacher = () => import('@/components/org/teacher/OrgTeacher')
const OrgTeacherTeach = () => import('@/components/org/teacher/OrgTeacherTeach')
const OrgTeacherStatistics = () => import('@/components/org/teacher/OrgTeacherStatistics')
const OrgTeacherMessages = () => import('@/components/org/teacher/OrgTeacherMessages')
const TeacherMessageList = () => import('@/components/org/teacher/TeacherMessageList')
const TeacherNewMessage = () => import('@/components/org/teacher/TeacherNewMessage')
const OrgTeacherClass = () => import('@/components/org/teacher/OrgTeacherClass')
const OrgTeacherClassLastUpdate = () => import('@/components/org/teacher/OrgTeacherClassLastUpdate')
const OrgTeacherReports = () => import('@/components/org/teacher/OrgTeacherReports')
const OrgTeacherReportEvaluation = () => import('@/components/org/teacher/OrgTeacherReportEvaluation')
const OrgTeacherReportEmpty = () => import('@/components/org/teacher/OrgTeacherReportEmpty')
const OrgTeacherReportComment = () => import('@/components/org/teacher/OrgTeacherReportComment')
const OrgTeacherReportList = () => import('@/components/org/teacher/OrgTeacherReportList')
const OrgTeacherReportDetail = () => import('@/components/org/teacher/OrgTeacherReportDetail')
const OrgTeacherReportCommentEdit = () => import('@/components/org/teacher/OrgTeacherReportCommentEdit')
const OrgTeacherReportCommentDetail = () => import('@/components/org/teacher/OrgTeacherReportCommentDetail')
const OrgTeacherClassPackage = () => import('@/components/org/teacher/OrgTeacherClassPackage')
const OrgTeacherClassPackageLesson = () => import('@/components/org/teacher/OrgTeacherClassPackageLesson')
const OrgTeacherLessonPlan = () => import('@/components/org/teacher/OrgTeacherLessonPlan')
const OrgTeacherCourseware = () => import('@/components/org/teacher/OrgTeacherCourseware')
const OrgStudentContainer = () => import('@/components/org/OrgStudent')
const OrgStudent = () => import('@/components/org/student/OrgStudent')
const OrgStudentClass = () => import('@/components/org/student/OrgStudentClass')
const OrgStudentClassSelect = () => import('@/components/org/student/OrgStudentClassSelect')
const StudentEvaluations = () => import('@/components/org/student/StudentEvaluations')
const StudentEvaluationDetail = () => import('@/components/org/student/StudentEvaluationDetail')
const JoinOrg = () => import('@/components/org/student/JoinOrg')
const OrgStudentClassLastUpdate = () => import('@/components/org/student/OrgStudentClassLastUpdate')
const OrgStudentPackage = () => import('@/components/org/student/OrgStudentPackage')
const OrgStudentPackageLesson = () => import('@/components/org/student/OrgStudentPackageLesson')
const OrgAdmin = () => import('@/components/org/OrgAdmin')
const OrgPackages = () => import('@/components/org/admin/OrgPackages')
const PackageDetail = () => import('@/components/org/admin/PackageDetail')
const OrgAdminCourseware = () => import('@/components/org/admin/OrgAdminCourseware')
const OrgAdminLessonPlan = () => import('@/components/org/admin/OrgAdminLessonPlan')
const OrgAdminPackageLesson = () => import('@/components/org/admin/OrgAdminPackageLesson')
const OrgClasses = () => import('@/components/org/admin/OrgClasses')
const OrgMessages = () => import('@/components/org/admin/OrgMessages')
const MessageList = () => import('@/components/org/admin/MessageList')
const AdminNewMessage = () => import('@/components/org/admin/AdminNewMessage')
const OrgEvaluation = () => import('@/components/org/admin/OrgEvaluation')
const EvaluationReport = () => import('@/components/org/admin/EvaluationReport')
const ClassEvaluation = () => import('@/components/org/admin/ClassEvaluation')
const OrgSetting = () => import('@/components/org/admin/OrgSetting')
const ClassList = () => import('@/components/org/admin/ClassList')
const NewClass = () => import('@/components/org/admin/NewClass')
const EditClass = () => import('@/components/org/admin/EditClass')
const ClassMembers = () => import('@/components/org/admin/ClassMembers')
const ClassDetail = () => import('@/components/org/admin/ClassDetail')
const NewTeacher = () => import('@/components/org/admin/NewTeacher')
const TeacherList = () => import('@/components/org/admin/TeacherList')
const StudentList = () => import('@/components/org/admin/StudentList')
const UseFormalCode = () => import('@/components/org/admin/UseFormalCode')
const EditMember = () => import('@/components/org/admin/EditMember')
const InvitationCode = () => import('@/components/org/admin/InvitationCode')
const NewInvitationCode = () => import('@/components/org/admin/NewInvitationCode')
const PrintInvitationCode = () => import('@/components/org/admin/PrintInvitationCode')
const HistoricalData = () => import('@/components/org/admin/HistoricalData')
const HistoricalMember = () => import('@/components/org/admin/HistoricalMember')
const OrgHistoryClassDetail = () => import('@/components/org/admin/OrgHistoryClassDetail')
const OrgForms = () => import('@/components/org/admin/OrgForms')
const NewForm = () => import('@/components/org/admin/NewForm')
const EditForm = () => import('@/components/org/admin/EditForm')
const FormFeedback = () => import('@/components/org/admin/FormFeedback')
const OrgFormDetail = () => import('@/components/org/OrgFormDetail')
const OrgLogs = () => import('@/components/org/common/OrgLogs')
const OrgFirstView = () => import('@/components/org/admin/OrgFirstView')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/org',
  routes: [
    {
      path: '*',
      component: OrgNotFound,
    },
    {
      path: '/:orgLoginUrl',
      redirect: { name: 'OrgLogin' },
    },
    {
      path: '/:orgLoginUrl/contact',
      name: 'OrgContact',
      component: OrgContact,
    },
    {
      path: '/:orgLoginUrl/notfound',
      name: 'OrgNotFound',
      component: OrgNotFound,
    },
    {
      path: '/:orgLoginUrl/login',
      name: 'OrgLogin',
      component: OrgLogin,
    },
    {
      path: '/:orgLoginUrl/message',
      name: 'orgMessage',
      component: OrgMessage,
    },
    {
      path: '/:orgLoginUrl/print',
      name: 'OrgPrint',
      component: OrgPrint,
    },
    {
      path: '/:orgLoginUrl/report',
      name: 'OrgReport',
      component: OrgReport,
    },
    {
      path: '/:orgLoginUrl/student',
      name: 'OrgStudentContainer',
      component: OrgStudentContainer,
      redirect: { name: 'OrgStudent' },
      children: [
        {
          path: '/',
          name: 'OrgStudent',
          component: OrgStudent,
          children: [
            {
              path: 'OrgStudentClassSelect',
              name: 'OrgStudentClassSelect',
              component: OrgStudentClassSelect,
            },
            {
              path: 'OrgStudentClass/:classId',
              name: 'OrgStudentClassDetail',
              component: OrgStudentClass,
            },
            {
              path: 'orgClassLastUpdate/:classId',
              name: 'OrgStudentClassLastUpdate',
              component: OrgStudentClassLastUpdate,
            },
            {
              path: 'evaluations/:classId',
              name: 'OrgStudentEvaluations',
              component: StudentEvaluations,
            },
            {
              path: 'evaluations/:classId/detail',
              name: 'OrgStudentEvaluationDetail',
              component: StudentEvaluationDetail,
            },
            {
              path: 'joinOrg',
              name: 'JoinOrg',
              component: JoinOrg,
            },
          ],
        },
        {
          path: 'package/:packageId',
          name: 'OrgStudentPackage',
          component: OrgStudentPackage,
        },
        {
          path: 'package/:packageId/lesson/:lessonId',
          name: 'OrgStudentPackageLesson',
          component: OrgStudentPackageLesson,
        },
      ],
    },
    {
      path: '/:orgLoginUrl/teacher',
      name: 'OrgTeacherContainer',
      component: OrgTeacherContainer,
      redirect: { name: 'OrgTeacher' },
      children: [
        {
          path: '/',
          name: 'OrgTeacher',
          component: OrgTeacher,
          redirect: { name: 'OrgTeacherTeach' },
          children: [
            {
              path: 'teach',
              name: 'OrgTeacherTeach',
              component: OrgTeacherTeach,
            },
            {
              path: 'statistics',
              name: 'OrgTeacherStatistics',
              component: OrgTeacherStatistics,
            },
            {
              path: 'messages',
              component: OrgTeacherMessages,
              children: [
                {
                  path: '/',
                  name: 'TeacherMessageList',
                  component: TeacherMessageList,
                },
                {
                  path: 'new',
                  name: 'TeacherNewMessage',
                  component: TeacherNewMessage,
                },
              ],
            },
            {
              path: 'classes',
              name: 'OrgTeacherClass',
              component: OrgTeacherClass,
            },
            {
              path: 'lastUpdate',
              name: 'OrgTeacherLastUpdate',
              component: OrgTeacherClassLastUpdate,
            },
            {
              path: 'reports',
              name: 'OrgTeacherReports',
              component: OrgTeacherReports,
              redirect: { name: 'OrgTeacherReportList' },
              children: [
                {
                  path: 'evaluation',
                  name: 'OrgTeacherReportEvaluation',
                  component: OrgTeacherReportEvaluation,
                },
                {
                  path: 'empty',
                  name: 'OrgTeacherReportEmpty',
                  component: OrgTeacherReportEmpty,
                },
                {
                  path: 'comment',
                  name: 'OrgTeacherReportComment',
                  component: OrgTeacherReportComment,
                },
                {
                  path: 'list',
                  name: 'OrgTeacherReportList',
                  component: OrgTeacherReportList,
                },
                {
                  path: 'detail',
                  name: 'OrgTeacherReportDetail',
                  component: OrgTeacherReportDetail,
                },
                {
                  path: 'commentEdit',
                  name: 'OrgTeacherReportCommentEdit',
                  component: OrgTeacherReportCommentEdit,
                },
                {
                  path: 'commentDetail',
                  name: 'OrgTeacherReportCommentDetail',
                  component: OrgTeacherReportCommentDetail,
                },
              ],
            },
            {
              path: 'logs',
              name: 'OrgTeacherLogs',
              component: OrgLogs,
            },
          ],
        },
        {
          path: '/:orgLoginUrl/teacher/teach/class/:classId/package/:packageId',
          name: 'OrgTeacherClassPackage',
          component: OrgTeacherClassPackage,
        },
        {
          path: '/:orgLoginUrl/teacher/teach/class/:classId/package/:packageId/lesson/:lessonId',
          name: 'OrgTeacherClassPackageLesson',
          component: OrgTeacherClassPackageLesson,
          redirect: { name: 'OrgTeacherLessonPlan' },
          children: [
            {
              path: 'lessonPlan',
              name: 'OrgTeacherLessonPlan',
              component: OrgTeacherLessonPlan,
            },
            {
              path: 'courseware',
              name: 'OrgTeacherCourseware',
              component: OrgTeacherCourseware,
            },
          ],
        },
      ],
    },
    {
      path: '/:orgLoginUrl/admin',
      name: 'OrgAdmin',
      component: OrgAdmin,
      children: [
        {
          path: 'packages',
          name: 'OrgPackages',
          component: OrgPackages,
        },
        {
          path: 'package/:packageId',
          name: 'OrgAdminPackageDetail',
          component: PackageDetail,
        },
        {
          path: 'package/:packageId/lesson/:lessonId',
          name: 'OrgAdminPackageLesson',
          component: OrgAdminPackageLesson,
          redirect: { name: 'OrgAdminLessonPlan' },
          children: [
            {
              path: 'lessonPlan',
              name: 'OrgAdminLessonPlan',
              component: OrgAdminLessonPlan,
            },
            {
              path: 'courseware',
              name: 'OrgAdminCourseware',
              component: OrgAdminCourseware,
            },
          ],
        },
        {
          path: 'firstView',
          name: 'OrgFirstView',
          component: OrgFirstView,
        },
        {
          path: 'classes',
          component: OrgClasses,
          redirect: { name: 'OrgClassList' },
          children: [
            {
              path: 'class',
              name: 'OrgClassList',
              component: ClassList,
            },
            {
              path: 'class/new',
              name: 'OrgNewClass',
              component: NewClass,
            },
            {
              path: 'class/edit',
              name: 'OrgEditClass',
              component: EditClass,
            },
            {
              path: 'class/members',
              name: 'OrgClassMembers',
              component: ClassMembers,
            },
            {
              path: 'class/detail',
              name: 'OrgClassDetail',
              component: ClassDetail,
            },
            {
              path: 'teacher',
              name: 'OrgTeacherList',
              component: TeacherList,
            },
            {
              path: 'teacher/new',
              name: 'OrgNewTeacher',
              component: NewTeacher,
            },
            {
              path: 'teacher/edit',
              name: 'OrgEditTeacher',
              component: EditMember,
            },
            {
              path: 'student',
              name: 'OrgStudentList',
              component: StudentList,
            },
            {
              path: 'student/edit',
              name: 'OrgEditStudent',
              component: EditMember,
            },
            {
              path: 'student/UseFormalCode',
              name: 'OrgUseFormalCode',
              component: UseFormalCode,
            },
          ],
        },
        {
          path: 'evaluations',
          component: OrgEvaluation,
          children: [
            {
              path: '/',
              name: 'EvaluationReport',
              component: EvaluationReport,
            },
            {
              path: ':classId',
              name: 'ClassEvaluation',
              component: ClassEvaluation,
            },
          ],
        },
        {
          path: 'messages',
          component: OrgMessages,
          children: [
            {
              path: '/',
              name: 'MessageList',
              component: MessageList,
            },
            {
              path: 'new',
              name: 'NewMessage',
              component: AdminNewMessage,
            },
          ],
        },
        {
          path: 'invitationCode',
          name: 'InvitationCode',
          component: InvitationCode,
        },
        {
          path: 'newInvitationCode',
          name: 'NewInvitationCode',
          component: NewInvitationCode,
        },
        {
          path: 'printInvitationCode',
          name: 'PrintInvitationCode',
          component: PrintInvitationCode,
        },
        {
          path: 'historicalData',
          name: 'HistoricalData',
          component: HistoricalData,
        },
        {
          path: 'HistoricalMember',
          name: 'HistoricalMember',
          component: HistoricalMember,
        },
        {
          path: 'orgHistoryClassDetail',
          name: 'OrgHistoryClassDetail',
          component: OrgHistoryClassDetail,
        },
        {
          path: 'forms',
          name: 'OrgForms',
          component: OrgForms,
        },
        {
          path: 'forms/new',
          name: 'NewForm',
          component: NewForm,
        },
        {
          path: 'forms/:id/edit',
          name: 'EditForm',
          component: EditForm,
        },
        {
          path: 'forms/:id/feedback',
          name: 'FormFeedback',
          component: FormFeedback,
        },
        {
          path: 'setting',
          name: 'OrgSetting',
          component: OrgSetting,
        },
        {
          path: 'logs',
          name: 'OrgAdminLogs',
          component: OrgLogs,
        },
      ],
    },
    {
      path: '/:orgLoginUrl/form/:id',
      name: 'OrgFormDetail',
      component: OrgFormDetail,
    },
    {
      path: '/:orgLoginUrl/*',
      component: OrgNotFound,
    },
  ],
})
