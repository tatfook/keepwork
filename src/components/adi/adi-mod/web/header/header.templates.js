
import { AdiMenu } from '@/components/adi/adi-mod/common'

const template1 = {
  render: (h, data) => {
    return (
      <div class='header-menu-bar'>
        <AdiMenu menu={data.menu}></AdiMenu>
      </div>
    )
  }
}

const templates = [
  template1
]

let RenderTemplate = (h, style, data) => {
  let template = templates[style.templateID - 1]
  return template.render(h, data)
}

export default RenderTemplate
