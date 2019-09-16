import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getLocale } from '@/lang'
import store from '@/store'
import { sessionStorageSetItem } from '@/utils'
export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  language: string
  size: string
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: sessionStorage.getItem("sidebar_status") !== 'closed',
    withoutAnimation: false
  }
  public device = DeviceType.Desktop
  public language = getLocale()
  public size = sessionStorage.getItem("size") || 'medium'

  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
    if (this.sidebar.opened) {
      sessionStorageSetItem('sidebar_status', 'opened')
    } else {
      sessionStorageSetItem('sidebar_status', 'closed')
    }
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
    sessionStorageSetItem('sidebar_status', 'closed')
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device
  }

  @Mutation
  private SET_LANGUAGE(language: string) {
    this.language = language
    sessionStorageSetItem('language', this.language)
  }

  @Mutation
  private SET_SIZE(size: string) {
    this.size = size
    sessionStorageSetItem('size', this.size)
  }

  @Action
  public ToggleSideBar(withoutAnimation: boolean) {
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }

  @Action
  public CloseSideBar(withoutAnimation: boolean) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  @Action
  public ToggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device)
  }

  @Action
  public SetLanguage(language: string) {
    this.SET_LANGUAGE(language)
  }

  @Action
  public SetSize(size: string) {
    this.SET_SIZE(size)
  }
}

export const AppModule = getModule(App)
