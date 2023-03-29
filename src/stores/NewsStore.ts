import type { NewsBanner } from '@/types'
import { defineStore } from 'pinia'
import { listNewsBanners } from '@/services/AcademyService'

interface NewsStore {
  news?: NewsBanner[]
}

export const useNewsStore = defineStore('NewsStore', {
  state: (): NewsStore => ({ news: undefined }),
  actions: {
    async getNews(): Promise<NewsBanner[] | undefined> {
      if (!this.news) {
        this.news = await this.fetchNews()
        return this.news
      }
      return this.news
    },

    async fetchNews() {
      return await listNewsBanners()
    }
  }
})
