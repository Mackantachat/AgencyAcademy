<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Pagination, Autoplay } from 'swiper'
import type { NewsBanner } from '@/types'

import 'swiper/css/pagination'
defineProps<{ items: NewsBanner[] }>()
const router = useRouter()

const bannerClick = (item: NewsBanner) => {
  if (item.url) {
    window.open(item.url, '_top"')
  } else {
    router.push({ name: 'NewsDetail', params: { id: item.seq } })
  }
}
</script>
<template>
  <v-swiper
    :slides-per-view="1"
    :space-between="0"
    :autoplay="{
      delay: 6000
    }"
    navigation
    :modules="[Pagination, Autoplay]"
    :pagination="{
      clickable: true
    }"
  >
    <v-swiper-slide v-for="item in items" :key="item.seq">
      <div
        class="thumbnail"
        :style="{
          backgroundImage: `url(${item.image})`
        }"
        @click="bannerClick(item)"
      ></div>
    </v-swiper-slide>
  </v-swiper>
</template>

<style lang="scss" scoped>
.thumbnail {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  display: block;
  position: relative;
  cursor: pointer;
  &:before {
    content: '';
    display: block;
    padding-top: 75%;
  }
}
</style>
