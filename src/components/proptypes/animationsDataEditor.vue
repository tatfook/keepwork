<template>
  <el-dialog class="tree-data-dialog" :title="this.$t('field.addReferences')" :visible.sync="show" width="600px" :before-close="handleClose">
    <draggable element="el-collapse" :list="animationsData" accordion>
      <el-collapse-item v-for="e in animationsData" :name="e.id" :key="e.id">
        <template slot="title">
          <img class="cover" :src="e.coverImage"/>
          <span class="title" >{{e.title}}</span>
          <a :href="e.animation" target="_blank" class="link">{{e.animation}}</a>
          <span class="delete">
            <el-button type="danger" size="small" icon="el-icon-delete" @click="removeItem(e.id)" circle></el-button>
          </span>
        </template>
        <el-form class="animationForm" label-position="right" label-width="120px" size="mini">
          <el-form-item :label="$t('field.title2')">
            <el-input v-model="e.title"></el-input>
          </el-form-item>
          <el-form-item :label="$t('field.coverImage')">
            <el-input v-model="e.coverImage"></el-input>
          </el-form-item>
          <el-form-item :label="$t('field.animation')">
            <el-input v-model="e.animation"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </draggable>
    <div style="margin-top: 20px;">
      <el-button type="primary" icon="el-icon-plus" @click="addAnimation" circle></el-button>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSave()">{{this.$t('card.submit')}}</el-button>
      <el-button @click="handleClose()">{{this.$t('card.cancel')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable'
import _ from 'lodash'
import uuid from 'uuid/v1'

export default {
  name: 'animationsDataEditor',
  props: {
    animationsData: Array,
    show: Boolean
  },
  // data() {
  //   return {
  //     animationsData: this.animationsData
  //   }
  // },
  methods: {
    handleClose() {
      this.$emit('cancel', null)
    },
    removeItem(id) {
      for(let i = 0; i < this.animationsData.length; i++) {
        if(this.animationsData[i].id == id) {
          this.animationsData.splice(i, 1)
        }
      }
    },
    handleSave() {
      this.handleClose();
      this.$emit('finish', this.animationsData);
    },
    addAnimation() {
      let uid = uuid()
      this.animationsData.push({
        id: uid,
        title: '',
        coverImage: '',
        animation: ''
      })
    },
  },
  components: {
    draggable
  }
}
</script>

<style>

.el-collapse-item__header {
  display: flex;
  align-items: center;
  padding-right: 45px;
  line-height:18px;
  position: relative;
}

.el-collapse-item__header .delete {
  position: absolute;
  right: 0;
  top: 5px;
  z-index: 2;
}

.animationForm{
  margin: 5px;
  padding: 15px 10px 5px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.tree-data-dialog .cover {
  height: 40px;
  margin-right:10px;
  vertical-align: middle;
}

.tree-data-dialog .link {
  flex:1;
  text-decoration: none;
  margin-left: 10px;
  color: #409eff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tree-data-dialog .title {
  flex:1;
  text-decoration: none;
  margin-left: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>
