<template>
  <div class="comp-item">
    <div class="comp-item-cover">
      <span class="comp-item-badge">{{compDetail.code}}</span>
      <img :src="compDetail.cover" :alt="compDetail.name">
    </div>
    <div class="comp-item-info">
      <div class="comp-item-info-left">
        <div class="comp-item-type-name">
          <span class="comp-item-type">{{compDetail.type}}</span>
          {{compDetail.name}}
        </div>
        <div class="comp-item-author">贡献者：{{compDetail.author}}</div>
      </div>
      <el-button @click="useComp">使用</el-button>
    </div>
  </div>
</template>

<script>
const THREE = require('three')
window.THREE = THREE
require('three/examples/js/loaders/GLTFLoader')
export default {
  name: 'CompItem',
  props: {
    compDetail: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.renderCompCover()
  },
  computed: {
    downloadUrl() {
      return _.get(this.compDetail, 'downloadUrl')
    }
  },
  methods: {
    useComp() {
      alert(this.downloadUrl)
    },
    renderCompCover() {
      var scene = new THREE.Scene()
      var camera = new THREE.PerspectiveCamera(
        80,
        window.innerWidth / window.innerHeight,
        0.01,
        20000
      )
      // camera.position.set(0, 0, 0)
      camera.position.set(1, 0, 1)

      var light = new THREE.PointLight(0xffffcc, 20, 200)
      light.position.set(4, 30, -20)
      scene.add(light)

      var light2 = new THREE.AmbientLight(0x20202a, 20, 100)
      light2.position.set(30, -10, 30)
      scene.add(light2)

      var renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.body.appendChild(renderer.domElement)

      var loader = new THREE.GLTFLoader()
      loader.load(
        'https://api.keepwork.com/storage/v0/siteFiles/4389/raw#Duck.glb',
        function(gltf) {
          console.log(gltf)
          var object = gltf.scene
          // gltf.scene.scale.set(2, 2, 2)
          // gltf.scene.position.x = 0 //Position (x = right+ left-)
          // gltf.scene.position.y = 0 //Position (y = up+, down-)
          // gltf.scene.position.z = 0 //Position (z = front +, back-)
          scene.add(gltf.scene)
        },
        undefined,
        function(error) {
          console.error(error)
        }
      )

      // renderer.render(scene, camera)
      function render() {
        requestAnimationFrame(render)
        renderer.render(scene, camera)
      }
      render()
    }
    // renderCompCover() {
    //   // const backgroundColor = 0x000000
    //   var renderCalls = []
    //   function render() {
    //     requestAnimationFrame(render)
    //     renderCalls.forEach(callback => {
    //       callback()
    //     })
    //   }
    //   render()

    //   var scene = new THREE.Scene()
    //   var camera = new THREE.PerspectiveCamera(
    //     200,
    //     window.innerWidth / window.innerHeight,
    //     0.1,
    //     2000
    //   )
    //   camera.position.set(1, 0, 1)

    //   var renderer = new THREE.WebGLRenderer({ antialias: true })
    //   renderer.setPixelRatio(window.devicePixelRatio)
    //   renderer.setSize(window.innerWidth, window.innerHeight)
    //   // renderer.setClearColor(backgroundColor) //0x );

    //   renderer.toneMapping = THREE.LinearToneMapping
    //   renderer.toneMappingExposure = Math.pow(0.94, 5.0)
    //   renderer.shadowMap.enabled = true
    //   renderer.shadowMap.type = THREE.PCFShadowMap

    //   window.addEventListener(
    //     'resize',
    //     function() {
    //       camera.aspect = window.innerWidth / window.innerHeight
    //       camera.updateProjectionMatrix()
    //       renderer.setSize(window.innerWidth, window.innerHeight)
    //     },
    //     false
    //   )

    //   document.body.appendChild(renderer.domElement)

    //   function renderScene() {
    //     renderer.render(scene, camera)
    //   }
    //   renderCalls.push(renderScene)
    //   var light = new THREE.PointLight(0xffffcc, 20, 200)
    //   light.position.set(4, 30, -20)
    //   scene.add(light)

    //   var light2 = new THREE.AmbientLight(0x20202a, 20, 100)
    //   light2.position.set(30, -10, 30)
    //   scene.add(light2)

    //   /* ////////////////////////////////////////////////////////////////////////// */

    //   var loader = new THREE.GLTFLoader()
    //   loader.crossOrigin = true
    //   loader.load(
    //     'https://api.keepwork.com/storage/v0/siteFiles/4389/raw#Duck.glb',
    //     // 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/39255/ladybug.gltf',
    //     function(data) {
    //       var object = data.scene
    //       // object.position.set(5, -5, -0.75)
    //       scene.add(object)
    //     }
    //   )
    // }
  }
}
</script>
<style lang="scss" scoped>
.comp-item {
  padding: 12px;
  background-color: #fff;
  &-cover {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    font-size: 0;
    img {
      width: 100%;
    }
  }
  &-badge {
    position: absolute;
    left: 0;
    top: 0;
    padding: 0 6px;
    height: 24px;
    line-height: 24px;
    color: #fff;
    font-size: 12px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }
  &-info {
    display: flex;
    align-items: center;
    margin-top: 8px;
    &-left {
      flex: 1;
    }
    .el-button {
      font-size: 14px;
      padding: 0 12px;
      height: 28px;
      line-height: 26px;
      color: #2397f3;
      border-color: #2397f3;
      border-radius: 28px;
    }
  }
  &-type-name {
    font-size: 14px;
    color: #303133;
  }
  &-type {
    font-size: 12px;
    color: #fff;
    background-color: #e6a23c;
    display: inline-block;
    border-radius: 4px;
    padding: 2px;
    min-width: 24px;
    text-align: center;
  }
  &-author {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
  }
}
</style>
