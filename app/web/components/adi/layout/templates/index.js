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
import SideBarMaxWidth from './SidebarMaxWidth'

export default {
  basic: {
    header: false,
    sidebar: false,
    footer: false,
    component: BasicMaxWidth
  },
  // default maxwidth
  basic_fullscreen: {
    header: false,
    sidebar: false,
    footer: false,
    component: BasicFullScreen
  },

  header: {
    header: true,
    sidebar: false,
    footer: false,
    component: HeaderMaxWidth
  }, // default maxwidth
  header_fullscreen: {
    header: true,
    sidebar: false,
    footer: false,
    component: HeaderFullScreen
  },

  header_footer: {
    header: true,
    sidebar: false,
    footer: true,
    component: HeaderFooterMaxWidth
  }, // default maxwidth
  header_footer_fullscreen: {
    header: true,
    sidebar: false,
    footer: true,
    component: HeaderFooterFullScreen
  },
  header_footer_sidebar: {
    header: true,
    sidebar: true,
    footer: true,
    component: HeaderFooterSidebar
  },

  header_sidebar: {
    header: true,
    sidebar: true,
    footer: false,
    component: HeaderSidebar
  },
  header_sidebar_footer: {
    header: true,
    sidebar: true,
    footer: true,
    component: HeaderSidebarFooter
  },

  sidebar: {
    header: false,
    sidebar: true,
    footer: false,
    component: Sidebar
  },
  sidebar_header: {
    header: true,
    sidebar: true,
    footer: false,
    component: SidebarHeader
  },
  sidebar_header_footer: {
    header: true,
    sidebar: true,
    footer: true,
    component: SidebarHeaderFooter
  },
  sidebar_max_width: {
    header: false,
    sidebar: true,
    footer: false,
    component: SideBarMaxWidth
  }
}
