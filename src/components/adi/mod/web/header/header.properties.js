import defaultMenuProperies from '@/components/adi/common/menu/menu.properties'
import defaultMediaProperies from '@/components/adi/common/media/media.properties'

const properties = {
  modType: 'AdiHeader',
  styleID: 1,
  data: {
    menu: {
      componentType: 'AdiMenu',
      data: defaultMenuProperies
    },
    media: {
      componentType: 'AdiMedia',
      data: defaultMediaProperies
    }
  }
}

export default properties
