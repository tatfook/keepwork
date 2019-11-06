<template>
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

    <!-- Background of PhotoSwipe. 
         It's a separate element as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>

    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">

      <!-- Container that holds slides. 
            PhotoSwipe keeps only 3 of them in the DOM to save memory.
            Don't modify these 3 pswp__item elements, data is added later on. -->
      <div class="pswp__container">
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
      </div>

      <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
      <div class="pswp__ui pswp__ui--hidden">

        <div class="pswp__top-bar">

          <!--  Controls are self-explanatory. Order can be changed. -->

          <div class="pswp__counter"></div>

          <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

          <button class="pswp__button pswp__button--share" title="Share"></button>

          <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

          <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

          <!-- Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR -->
          <!-- element will get class pswp__preloader--active when preloader is running -->
          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
          <div class="pswp__share-tooltip"></div>
        </div>

        <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
        </button>

        <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
        </button>

        <div class="pswp__caption">
          <div class="pswp__caption__center"></div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default'
export default {
  name: 'PhotoPreview',
  props: {
    slides: {
      type: Array,
      default() {
        return []
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    const pswpElement = document.querySelector('.pswp')
    const options = {
      index: this.index,
      shareButtons: [
        {
          id: 'download',
          label: '下载图片',
          url: '{{raw_image_url}}',
          download: true
        }
      ]
    }
    const gallery = new PhotoSwipe(
      pswpElement,
      PhotoSwipeUIDefault,
      this.slides,
      options
    )
    gallery.listen('close', () => this.$emit('close'))

    gallery.listen('imageLoadComplete', (index, item) => {
      const img = item.container.lastChild
      const { naturalHeight, naturalWidth } = img
      const { clientHeight, clientWidth } = document.body
      const ratio = naturalWidth / naturalHeight
      const minLength = Math.min(clientWidth, clientHeight)
      const maxLength = Math.max(clientHeight, clientWidth)
      const imgIsVertical = naturalHeight > naturalWidth
      const browserIsVertical = clientHeight > clientWidth
      if (naturalHeight < clientHeight && naturalWidth < clientWidth) {
        item.w = naturalWidth
        item.h = naturalHeight
      } else {
        if (imgIsVertical) {
          item.w = minLength
          item.h = minLength / ratio
        } else {
          item.w = maxLength
          item.h = maxLength / ratio
        }
      }
      gallery.updateSize()
    })

    gallery.init()
  }
}
</script>

<style scoped>
@import '~photoswipe/dist/photoswipe.css';
@import '~photoswipe/dist/default-skin/default-skin.css';
</style>