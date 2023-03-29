<script setup lang="ts">
import NewsSliderView from '@/components/NewsSliderView.vue'
import BannerView from '@/components/BannerView.vue'
import { useNewsStore } from '@/stores/NewsStore'
import LoadingView from '@/components/LoadingView.vue'
import type { NewsBanner } from '@/types'
import { reactive, onMounted } from 'vue'

const newsStore = useNewsStore()

const state = reactive<{ loaded: boolean; news: NewsBanner[] }>({
  loaded: false,
  news: []
})

onMounted(async () => {
  state.loaded = false
  try {
    const news = await newsStore.getNews()
    state.news = news || []
  } catch (error) {
    console.log('load news fails', error)
  } finally {
    state.loaded = true
  }
})
</script>

<template>
  <section>
    <BannerView />
  </section>
  <div class="container px-3 py-4">
    <h1 class="text-primary fw-bold fs-4">ประชาสัมพันธ์</h1>
    <NewsSliderView :items="state.news" v-if="state.news.length > 0" />
    <div v-else>
      <div>ไม่มีข้อมูล</div>
    </div>
  </div>
  <LoadingView v-if="!state.loaded" />
</template>
