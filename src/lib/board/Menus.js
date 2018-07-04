import * as DrawioMenus from './drawio/js/Menus'

const DrawioMenu = DrawioMenus.Menu

export class Menu extends DrawioMenu {
  init() {
    this.arrange = (menu, parent) => {
      this.addMenuItems(menu, ['toFront', 'toBack', '-'], parent)
      this.addSubmenu('direction', menu, parent)
      this.addMenuItems(menu, ['turn', '-'], parent)
      this.addSubmenu('align', menu, parent)
      this.addSubmenu('distribute', menu, parent)
      menu.addSeparator(parent)
      this.addSubmenu('navigation', menu, parent)
      this.addSubmenu('insert', menu, parent)
      // this.addSubmenu('layout', menu, parent);
      this.addMenuItems(menu, ['-', 'group', 'ungroup', 'removeFromGroup', '-', 'clearWaypoints', 'autosize'], parent)
    }
  }

  get defaultMenuItems() {
    return ['edit', 'view', 'arrange']
  }
}
