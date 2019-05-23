import createLayout from './layout';
const tpl = '<div id="app"><slot></slot></div>';
export default createLayout('Layout', { }, tpl);
