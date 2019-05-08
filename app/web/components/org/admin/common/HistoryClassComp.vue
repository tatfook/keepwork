<template>
  <div class="historical-class-comp">
    <div class="historical-class-comp-header">
      <el-breadcrumb class="historical-class-comp-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'HistoricalData' }">{{$t('org.historicalData')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{nowPageText}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="historical-class-comp-header-operate">
        <el-button v-if="!isDetailPage" size="medium" @click="toClassListPage">{{$t('common.Cancel')}}</el-button>
        <el-button v-if="!isDetailPage" size="medium" type="primary" @click="save" :disabled="!isClassDataValid">{{$t('common.Save')}}</el-button>
      </div>
    </div>
    <div class="historical-class-comp-form">
      <div class="historical-class-comp-form-item">
        <div class="historical-class-comp-form-label">{{$t('org.ClassNameLabel')}}</div>
        <el-input :disabled='isDetailPage' placeholder="例如：2019级1班" v-model="classData.name"></el-input>
      </div>
      <div class="historical-class-comp-form-item">
        <div class="historical-class-comp-form-label">{{$t('org.beginClassTime')}}</div>
        <el-date-picker :disabled="isDetailPage" v-model="classTime" type="daterange" range-separator="至" start-placeholder="开班时间" end-placeholder="结束时间" unlink-panels>
        </el-date-picker>
      </div>
      <div class="historical-class-comp-form-item">
        <div class="historical-class-comp-form-label">{{$t('org.LessonPackagesAvailable')}}:</div>
        <el-tree ref="lessonTree" v-loading='isTreeLoading' class="historical-class-comp-form-tree" :data='formatedTreeData' show-checkbox check-on-click-node :expand-on-click-node='false' node-key="id">
        </el-tree>
      </div>
      <div class="historical-class-comp-form-item">
        <p>{{$t('org.teachersName')}}：{{classData.teachersName}}</p>
      </div>
    </div>
    <div class="historical-class-comp-student">
      <p>{{$t('org.studentCunt')}}：{{currentClassStudentsCount}}</p>
      <el-table :data="currentClassStudents" border style="width: 100%">
        <el-table-column prop="realname" :label="$t('org.nameLabel')" width="280">
        </el-table-column>
        <el-table-column prop="users.username" :label="$t('org.usernameLabel')" width="280">
        </el-table-column>
        <el-table-column :label="$t('org.AddedAtLabel')">
          <template slot-scope="scope">{{scope.row.createdAt | formatTime}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
	name: 'ClassComp',
	props: {
		classDetail: Object
	},
	async created() {
		await Promise.all([
			this.initClassData(),
			this.getHistoryClasses({ cache: true })
		])
	},
	data() {
		return {
			classTime: null,
			isTreeLoading: false,
			classData: {
				name: '',
				begin: null,
				end: null,
				packages: []
			}
		}
	},
	computed: {
		...mapGetters({
			currentOrg: 'org/currentOrg',
			getOrgPackagesGraphqlById: 'org/getOrgPackagesGraphqlById',
			orgClassStudents: 'org/teacher/orgClassStudents',
			orgHistoricalClasses: 'org/orgHistoricalClasses'
		}),
		orgId() {
			return _.get(this.currentOrg, 'id')
		},
		isDetailPage() {
			return _.get(this.$route, 'name') === 'OrgHistoryClassDetail'
		},
		isNewPage() {
			return _.get(this.$route, 'name') === 'OrgNewClass'
		},
		isEditPage() {
			return _.get(this.$route, 'name') === 'OrgHistoryEditClass'
		},
		nowClassName() {
			return _.get(this.classDetail, 'name')
		},
		nowPageText() {
			let pageText = ''
			switch (this.$route.name) {
				case 'OrgNewClass':
					pageText = this.$t('org.NewClass')
					break
				case 'OrgHistoryEditClass':
				case 'OrgHistoryClassDetail':
					pageText = this.nowClassName
					break
				default:
					break
			}
			return pageText
		},
		orgAvailablePackages() {
			return this.getOrgPackagesGraphqlById({ id: this.orgId }) || []
		},
		formatedTreeData() {
			return _.map(this.orgAvailablePackages, packageData => {
				let packageId = _.toNumber(_.get(packageData, 'package.id'))
				return {
					id: packageId,
					packageId: packageId,
					label: _.get(packageData, 'package.packageName'),
					disabled: this.isDetailPage,
					children: _.map(packageData.lessons, lesson => {
						let lessonId = _.toNumber(lesson.id)
						let lessonNo = _.toNumber(lesson.lessonNo)
						return {
							id: `${packageId}-${lessonId}`,
							packageId: packageId,
							disabled: this.isDetailPage,
							label: lesson.lessonName,
							lessonId: lessonId,
							lessonNo: lessonNo
						}
					})
				}
			})
		},
		isClassDataValid() {
			let classData = this.classData
			return classData.name && classData.name !== ''
		},
		currentClassStudents() {
			let orgClassMembers = _.get(this.orgHistoricalClasses, 'rows', [])
			let orgClassMembersByClassId = _.find(orgClassMembers, i => i.id === +this.classDetail.id)
			let studentList = _.get(orgClassMembersByClassId, 'lessonOrganizationClassMembers', [])
			return studentList
		},
		currentClassStudentsCount() {
			return this.currentClassStudents.length
		}
	},
	methods: {
		...mapActions({
			getOrgClassPackages: 'org/getOrgClassPackages',
			getOrgPackagesByGraphql: 'org/getOrgPackagesByGraphql',
			getHistoryClasses: 'org/getHistoryClasses'
		}),
		initClassData() {
			this.initTreeData()
			if (this.isDetailPage || this.isEditPage) {
				this.initSelectedLessons()
				let classDetail = this.classDetail
				this.classData = classDetail
				this.classTime = _.isNull(classDetail.begin) ? null : [classDetail.begin, classDetail.end]
			} else {
				this.classData = {
					name: '',
					begin: null,
					end: null,
					packages: []
				}
			}
		},
		async initTreeData() {
			this.isTreeLoading = true
			await this.getOrgPackagesByGraphql({ organizationId: this.orgId })
			this.isTreeLoading = false
		},
		async initSelectedLessons() {
			let classPackages = await this.getOrgClassPackages({
				organizationId: this.orgId,
				classId: this.classDetail.id
			})
			let classLessons = []
			for (let i = 0; i < classPackages.length; i++) {
				const packageItem = classPackages[i]
				let lessons = classPackages[i].lessons
				if (_.isNull(lessons)) {
					break
				}
				for (let j = 0; j < lessons.length; j++) {
					const lesson = lessons[j]
					classLessons.push(`${packageItem.packageId}-${lesson.lessonId}`)
				}
			}
			this.$refs.lessonTree.setCheckedKeys(classLessons)
		},
		toClassListPage() {
			this.$router.push({
				name: 'OrgClassList'
			})
		},
		setSelectedPackages() {
			let selectedLessons = this.$refs.lessonTree.getCheckedNodes(true)
			let groupedPackages = _.groupBy(selectedLessons, 'packageId')
			let packages = []
			_.forIn(groupedPackages, (lessons, packageId) => {
				packages.push({
					packageId: _.toNumber(packageId),
					lessons: _.map(lessons, lesson => {
						return {
							lessonId: lesson.lessonId,
							lessonNo: lesson.lessonNo
						}
					})
				})
			})
			this.classData.packages = packages
		},
		setSelectedTime() {
			if (_.isNull(this.classTime)) {
				this.classData.begin = null
				this.classData.end = null
				return
			}
			this.classData.begin = this.classTime[0]
			this.classData.end = this.classTime[1]
		},
		save() {
			this.setSelectedPackages()
			this.setSelectedTime()
			this.$emit('save', this.classData)
		}
	},
	watch: {
		$route() {
			this.initClassData()
		}
	},
	filters: {
		formatTime(time) {
			return time ? moment(time).format('YYYY/MM/DD') : ''
		}
	}
}
</script>
<style lang="scss">
$borderColor: #e8e8e8;
.historical-class-comp {
	background: #fff;
	&-header {
		display: flex;
		height: 56px;
		border-bottom: 1px solid $borderColor;
		padding: 0 24px;
		align-items: center;
		&-breadcrumb {
			flex: 1;
			font-size: 16px;
			.el-breadcrumb__inner.is-link {
				color: #999;
			}
		}
	}
	&-form {
		width: 384px;
		padding: 24px 24px 0;
		&-label {
			font-size: 14px;
			color: #333;
			margin-bottom: 12px;
		}
		&-danger {
			color: #e31d3e;
			font-size: 12px;
			margin-top: 12px;
		}
		&-item {
			margin-bottom: 40px;
		}
	}
	&-tree {
		border: 1px solid $borderColor;
	}
	&-student {
		padding: 0 24px 24px;
	}
}
</style>
