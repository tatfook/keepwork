import BaseCompProperties from '@/components/adi/common/comp.properties'

const properties = {
  modType: 'AdiHeader',
  styleID: 0,
  data: {
    menu: {
      componentType: 'AdiMenu',
      data: BaseCompProperties.menu
    },
    media: {
      componentType: 'AdiMedia',
      data: BaseCompProperties.media
    },
    label: {
      componentType: 'AdiLabel',
      data: BaseCompProperties.label
    }
  }
}

export default properties
