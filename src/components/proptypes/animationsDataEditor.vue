<template>
  <el-dialog class="tree-data-dialog" title="Add animations" :visible.sync="show" width="600px" :before-close="handleClose">
    <draggable element="el-collapse" :list="animationsDataCopy" accordion>
      <el-collapse-item v-for="e in animationsDataCopy" :name="e.id" :key="e.id">
        <template slot="title">
          <img class="cover" :src="e.coverImage"/>
          <span class="title">{{e.title}}</span>
          <a :href="e.animation" target="_blank" class="link">{{e.animation}}</a>
          <span class="delete">
            <el-button type="danger" size="small" icon="el-icon-delete" @click="removeItem(e.id)" circle></el-button>
          </span>
        </template>
        <el-form class="animationForm" label-position="right" label-width="120px" size="mini">
          <el-form-item label="Title">
            <el-input v-model="e.title"></el-input>
          </el-form-item>
          <el-form-item label="Cover Image">
            <el-input v-model="e.coverImage"></el-input>
          </el-form-item>
          <el-form-item label="Animation">
            <el-input v-model="e.animation"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </draggable>
    <div style="margin-top: 20px;">
      <el-button type="primary" icon="el-icon-plus" @click="addAnimation" circle></el-button>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSave()">submit</el-button>
      <el-button @click="handleClose()">cancel</el-button>
    </span>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable'
import _ from 'lodash'

function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

export default {
  name: 'animationsDataEditor',
  props: {
    animationsData: Array,
    show: Boolean
  },
  data() {
    return {
      animationsDataCopy: this.animationsData
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel', null)
    },
    removeItem(id) {
      for(let i = 0; i < this.animationsDataCopy.length; i++) {
        if(this.animationsDataCopy[i].id == id) {
          this.animationsDataCopy.splice(i, 1)
        }
      }
    },
    handleSave() {
      this.handleClose();
      this.$emit('finish', this.animationsDataCopy);
    },
    addAnimation() {
      let uid = uuid(8, 16)
      this.animationsDataCopy.push({
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

</style>
