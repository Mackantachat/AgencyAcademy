<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'
import BannerJSON from '@/assets/banner.json'
</script>

<template>
  <Vue3Lottie :animationData="BannerJSON" />
</template>

<script lang="ts">
export default {
  components: {
    Vue3Lottie
  },
  data() {
    return {
      BannerJSON
    }
  }
}
</script>
