import compFactory from '@/components/adi/common/comp.factory'

const template1 = {
  render: (h, mod) => {
    return (
      <div class="mod-header">
        <div class="mod-header-media">
          {compFactory.create(h, mod, 'media')}
        </div>
        <div class="mod-header-menu">{compFactory.create(h, mod, 'menu')}</div>
      </div>
    )
  }
}

const template2 = {
  render: (h, mod) => {
    return (
      <div class="mod-header">
        <div class="mod-header-menu">{compFactory.create(h, mod, 'menu')}</div>
        <div class="mod-header-media">
          {compFactory.create(h, mod, 'media')}
        </div>
      </div>
    )
  }
}

const templates = {
  template1,
  template2
}

export default templates
