<script setup lang="ts">
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { Pagination } from 'swiper'
import CourseListView from './CourseListView.vue'

import { useCourseStore } from '@/stores/CourseStore'
import { reactive, onMounted } from 'vue'
import Icon from '@/components/icons/Index.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import LoadingView from '@/components/LoadingView.vue'
import type { TrainingStatus } from '@/types'

const tabNames = ['คอร์สอบรมทั้งหมด', 'คอร์สอบรมของคุณ']
const courseStore = useCourseStore()
const router = useRouter()
const route = useRoute()

const state = reactive<{
  loading: boolean
  activeTab: number
  trainingFilter: { searchText?: string }
  historyFilter: { searchText?: string; statusCode?: string }
}>({
  activeTab: 0,
  loading: false,
  trainingFilter: { searchText: '' },
  historyFilter: { searchText: '', statusCode: '' }
})

let swiperRef: any

onBeforeRouteUpdate((r) => {
  console.log('before route update', r.query.tab)
  moveToActiveTab(r)
})

onMounted(async () => {
  // Get items from store.
  await fetchFilteredTrainings()
  await fetchFilteredHistory()

  if (courseStore.trainingStatusList.length == 0) {
    await courseStore.fetchTrainingStatusList()
  }
  moveToActiveTab()
})

const moveToActiveTab = (r?: any) => {
  state.activeTab = (r ? r.query.tab : route.query.tab) === 'history' ? 1 : 0
  console.log('move to tab', state.activeTab)
  swiperRef.slideTo(state.activeTab)
}

const onSwiperInit = (swiper: any) => {
  swiperRef = swiper
}

const onSlideChange = (swiper: any) => {
  if (swiper.activeIndex === 1) {
    router.replace({ query: { tab: 'history' } })
  } else {
    router.replace({ query: {} })
  }
}

const fetchFilteredTrainings = async () => {
  try {
    state.loading = true
    await courseStore.fetchTrainings(state.trainingFilter.searchText)
  } finally {
    state.loading = false
  }
}

const fetchFilteredHistory = async () => {
  try {
    state.loading = true
    const { searchText, statusCode } = state.historyFilter
    await courseStore.fetchTrainingHistory(searchText, statusCode)
  } finally {
    state.loading = false
  }
}

const viewTraining = (id: string) => {
  console.log('view course', id)
  router.push({ name: 'CourseDetail', params: { id } })
}

const viewTrainingHistory = (id: string) => {
  router.push({ name: 'CourseHistoryDetail', params: { id } })
}

const createBullet = (index: number, className: String) => {
  return `<div class="${className}"><span class="py-1">${tabNames[index]}</span></div>`
}
</script>

<template>
  <div class="container px-3 py-4">
    <h1 class="text-primary fw-bold fs-4">คอร์สอบรม</h1>
    <div class="course-navigation mb-4" role="tablist"></div>

    <v-swiper
      :initialSlide="state.activeTab"
      :cssMode="false"
      :centeredSlides="true"
      :autoHeight="false"
      :spaceBetween="20"
      :modules="[Pagination]"
      :pagination="{
        el: '.course-navigation',
        clickable: true,
        renderBullet: createBullet
      }"
      @afterInit="onSwiperInit"
      @slideChange="onSlideChange"
    >
      <v-swiper-slide>
        <CourseListView
          :items="courseStore.upcomingList.items"
          @item-click="viewTraining"
        >
          <template #header>
            <!-- Filter by keyword -->
            <div class="col-12">
              <div class="input-group">
                <input
                  type="search"
                  class="form-control"
                  name="search"
                  placeholder="ค้นหา"
                  autocomplete="off"
                  v-model="state.trainingFilter.searchText"
                />
                <button
                  class="btn btn-primary"
                  type="button"
                  @click.prevent="fetchFilteredTrainings"
                >
                  <Icon :width="18" :height="18">
                    <IconSearch />
                  </Icon>
                </button>
              </div>
            </div>
          </template>
        </CourseListView>
      </v-swiper-slide>
      <v-swiper-slide>
        <CourseListView
          :items="courseStore.historyList.items"
          @item-click="viewTrainingHistory"
        >
          <template #header>
            <!-- Filter by keyword -->
            <div class="col-12">
              <div class="input-group">
                <input
                  type="search"
                  class="form-control"
                  name="search"
                  placeholder="ค้นหา"
                  autocomplete="off"
                  v-model="state.historyFilter.searchText"
                />
                <button
                  class="btn btn-primary"
                  type="button"
                  @click.prevent="fetchFilteredHistory"
                >
                  <Icon :width="18" :height="18">
                    <IconSearch />
                  </Icon>
                </button>
              </div>
            </div>
            <!-- Filter by status -->
            <div class="col-12">
              <select
                class="form-select"
                aria-label="Select status"
                name="status"
                v-model="state.historyFilter.statusCode"
              >
                <option value="">ทุกสถานะ</option>
                <option
                  v-for="status in courseStore.trainingStatusList"
                  :key="status.statusCode"
                  :value="status.statusCode"
                >
                  {{ status.statusText }}
                </option>
              </select>
              <!-- <v-select
                :options="courseStore.trainingStatusList"
                :reduce="(s: TrainingStatus) => s.statusCode"
                label="statusText"
                :searchable="false"
                :clearable="false"
                v-model="state.historyFilter.status"
              ></v-select> -->
            </div>
          </template>
        </CourseListView>
      </v-swiper-slide>
    </v-swiper>
  </div>
  <LoadingView v-if="state.loading" />
</template>

<style lang="scss" scoped>
.course-contains {
  min-height: 500px;
}
</style>

<style lang="scss">
.swiper-pagination-bullet,
.swiper-pagination-bullet-active {
  background: none;
}

.course-navigation {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  .swiper-pagination-bullet {
    flex: 1;
    text-align: center;
    span {
      color: $primary;
      cursor: pointer;
      display: inline-block;
      font-size: 1.2rem;
      position: relative;
      &:after {
        content: '';
        background-color: transparent;
        bottom: 0;
        display: block;
        height: 3px;
        left: 0;
        position: absolute;
        width: 0;
        transition: all 0.3s ease-in-out;
      }
    }
    &.swiper-pagination-bullet-active {
      span {
        &:after {
          background-color: $primary;
          width: 100%;
        }
      }
    }
  }
}
</style>
