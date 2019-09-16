import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { Route } from 'vue-router'
import store from '@/store'

export interface ITagView extends Partial<Route> {
  title?: string
}

export interface ITagsViewState {
  visitedViews: ITagView[]
  cachedViews: (string | undefined)[]
}

@Module({ dynamic: true, store, name: 'tagsView' })
class TagsView extends VuexModule implements ITagsViewState {
  public visitedViews: ITagView[] = []
  public cachedViews: (string | undefined)[] = []

  @Mutation
  private ADD_VISITED_VIEWS(view: ITagView) {
    if (this.visitedViews.some(v => v.path === view.path)) return
    this.visitedViews.push({
      name: view.name,
      path: view.path,
      title: view.meta.title || 'no-name'
    })
    if (view.meta.noCache) {
      this.cachedViews.push(view.name)
    }
  }

  @Mutation
  private DEL_VISITED_VIEWS(view: ITagView) {
    for (const [i, v] of this.visitedViews.entries()) {
      if (v.path === view.path) {
        this.visitedViews.splice(i, 1)
        break
      }
    }
    for (const i of this.cachedViews) {
      if (i === view.name) {
        const index = this.cachedViews.indexOf(i)
        this.cachedViews.splice(index, 1)
        break
      }
    }
  }

  @Mutation
  private DEL_OTHERS_VIEWS(view: ITagView) {
    for (const [i, v] of this.visitedViews.entries()) {
      if (v.path === view.path) {
        this.visitedViews = this.visitedViews.slice(i, i + 1)
        break
      }
    }

    for (const i of this.cachedViews) {
      if (i === view.name) {
        const index = this.cachedViews.indexOf(i)
        this.cachedViews = this.cachedViews.slice(index, index + 1)
        break
      }
    }
  }

  @Mutation
  private DEL_ALL_VIEWS() {
    this.visitedViews = []
    this.cachedViews = []
  }

  @Action
  public addVisitedViews(view: ITagView) {
    this.ADD_VISITED_VIEWS(view)
  }

  @Action
  public delVisitedViews(view: ITagView) {
    return new Promise((resolve) => {
      this.DEL_VISITED_VIEWS(view)
      resolve([...this.visitedViews])
    })
  }

  @Action
  public delOthersViews(view: ITagView) {
    return new Promise((resolve) => {
      this.DEL_OTHERS_VIEWS(view)
      resolve([...this.visitedViews])
    })
  }

  @Action
  public delAllViews() {
    return new Promise((resolve) => {
      this.DEL_ALL_VIEWS()
      resolve([...this.visitedViews])
    })
  }
}

export const TagsViewModule = getModule(TagsView)
