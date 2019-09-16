
import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import Vue from 'vue';
import Cube from 'cube-ui';


import {
  ButtonTab, ButtonTabItem, Calendar, Card, CellFormPreview, CheckIcon, Checker,
  CheckerItem, Checklist, Confirm, ConfirmPlugin, Datetime, DatetimeRange, DatetimeView,
  Divider, Drawer, Flexbox, FlexboxItem, FormPreview, Grid, GridItem, Group, Icon, InlineLoading,
  InlineXSwitch, LoadingPlugin, Radio, Tabbar, TabbarItem, Timeline, ToastPlugin, TransferDom,
  XButton, XDialog, XHeader, XImg, XInput, XProgress, XSwitch, XTable, Cell, CellBox, Tab, Swiper,
  TabItem, SwiperItem
} from 'vux';
import { DatetimePlugin } from 'vux'
Vue.use(DatetimePlugin)
import App from './App.vue';
import './errorLog'; // error log
import './icons'; // icon
import './permission'; // permission control
import router from './router/router';
import store from './store/index';
import { xutil } from './utils/xutil';




Vue.use(Cube)

Vue.component('icon', Icon)
Vue.component('divider', Divider)
Vue.component('grid', Grid)
Vue.component('grid-item', GridItem)
Vue.component('x-input', XInput)
Vue.component('x-button', XButton)
Vue.component('calendar', Calendar)
Vue.component('cell-form-preview', CellFormPreview)
Vue.component('check-icon', CheckIcon)
Vue.component('checklist', Checklist)
Vue.component('datetime-view', DatetimeView)
Vue.component('datetime-range', DatetimeRange)
Vue.component('datetime', Datetime)
Vue.component('form-preview', FormPreview)
Vue.component('group', Group)
Vue.component('inline-x-switch', InlineXSwitch)
Vue.component('radio', Radio)
Vue.component('card', Card)
Vue.component('x-table', XTable)
Vue.component('x-progress', XProgress)
Vue.component('x-img', XImg)
Vue.use(ConfirmPlugin)
Vue.component('inline-loading', InlineLoading)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.component('timeline', Timeline)
Vue.component('drawer', Drawer)
Vue.component('tabbar', Tabbar)
Vue.component('tabbar-item', TabbarItem)
Vue.component('x-header', XHeader)
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('x-dialog', XDialog)
Vue.component('checker', Checker)
Vue.component('checker-item', CheckerItem)
Vue.component('x-switch', XSwitch)
Vue.component('button-tab', ButtonTab)
Vue.component('button-tab-item', ButtonTabItem)
Vue.component('confirm', Confirm)
Vue.component('v-transfer-dom', TransferDom)
Vue.component('cell-form-preview', CellFormPreview)
Vue.component('cell', Cell)
Vue.component('cell-box', CellBox)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('swiper', Swiper)
Vue.component('swiper-item', SwiperItem)




// register globnal utility filters.
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, (filters as any)[key])
// })

Vue.config.productionTip = false

const vue = new Vue({
  el: '#app',
  router: router,
  store: store,
  template: '<App/>',
  components: { App: App }
})

xutil.init(vue)

