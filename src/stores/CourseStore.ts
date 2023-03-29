import type { AcademyTraining, TrainingStatus } from '@/types'
import { defineStore } from 'pinia'
import {
  listTrainingHistory,
  listTrainings,
  listTrainingStatus
} from '@/services/AcademyService'

interface CourseListState {
  items?: AcademyTraining[]
  filterOptions?: { searchText?: string; status?: string }
}

interface CourseStore {
  historyList: CourseListState
  upcomingList: CourseListState
  trainingStatusList: TrainingStatus[]
}

export const useCourseStore = defineStore('CourseStore', {
  state: (): CourseStore => ({
    historyList: {},
    upcomingList: {},
    trainingStatusList: []
  }),
  actions: {
    // Fetch upcoming trainings
    async fetchTrainings(
      searchText?: string
    ): Promise<AcademyTraining[] | undefined> {
      this.upcomingList.items = await listTrainings({
        searchText
      })

      return this.upcomingList.items
    },

    // Fetch training history
    async fetchTrainingHistory(
      searchText?: string,
      status?: string
    ): Promise<AcademyTraining[] | undefined> {
      this.historyList.items = await listTrainingHistory({ searchText, status })

      return this.historyList.items
    },

    // Fetch Training status list
    async fetchTrainingStatusList(): Promise<TrainingStatus[] | undefined> {
      const result = await listTrainingStatus()
      this.trainingStatusList = result || []
      return this.trainingStatusList
    }
  }
})
