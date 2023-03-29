<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
import { useNewsStore } from '@/stores/NewsStore'
import { useRoute } from 'vue-router'

const store = useNewsStore()
const route = useRoute()

const { id } = route.params
const item = store.news?.find((i) => `${i.seq}` === id)
</script>

<template>
  <div class="container px-3 py-4">
    <BackButton class="mb-3" to="/" />
    <img
      :src="item?.image"
      :alt="item?.title"
      class="img-fluid d-block w-100 mb-4"
    />
    <h1 class="text-primary fw-bold fs-4 mb-4">{{ item?.title }}</h1>
    <div class="content">{{ item?.detail }}</div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  img {
    display: block;
    height: auto;
    max-width: 100%;
    margin: 1rem auto;
  }
}
</style>
