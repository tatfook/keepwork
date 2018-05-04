import BasicMaxWidth from './BasicMaxWidth'
import BasicFullScreen from './BasicFullScreen'

import HeaderMaxWidth from './HeaderMaxWidth'
import HeaderFullScreen from './HeaderFullScreen'

import HeaderSidebar from './HeaderSidebar'
import HeaderSidebarFooter from './HeaderSidebarFooter'

import HeaderFooterMaxWidth from './HeaderFooterMaxWidth'
import HeaderFooterFullScreen from './HeaderFooterFullScreen'
import HeaderFooterSidebar from './HeaderFooterSidebar'

import Sidebar from './Sidebar'
import SidebarHeader from './SidebarHeader'
import SidebarHeaderFooter from './SidebarHeaderFooter'

export default {
  basic: BasicMaxWidth, // default maxwidth
  basic_fullscreen: BasicFullScreen,

  header: HeaderMaxWidth, // default maxwidth
  header_fullscreen: HeaderFullScreen,

  header_footer: HeaderFooterMaxWidth, // default maxwidth
  header_footer_fullscreen: HeaderFooterFullScreen,
  header_footer_sidebar: HeaderFooterSidebar,

  header_sidebar: HeaderSidebar,
  header_sidebar_footer: HeaderSidebarFooter,

  sidebar: Sidebar,
  sidebar_header: SidebarHeader,
  sidebar_header_footer: SidebarHeaderFooter
}
