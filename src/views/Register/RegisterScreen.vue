<script setup lang="ts">
import ProgressStep from '@/components/ProgressStep.vue'
import BackButton from '@/components/BackButton.vue'
import { useRoute, useRouter } from 'vue-router'
import { reactive } from 'vue'

const router = useRouter()
const route = useRoute()
const state = reactive(route.meta)

router.afterEach((to, from) => {
  console.log('after each ', to, from)
  state.step = to.meta?.step
  state.title = to.meta?.title
})
</script>

<template>
  <div class="full-page pt-4">
    <div class="container px-3">
      <div class="row align-items-center">
        <div class="col-6">
          <BackButton to="/" title="ลงทะเบียน" />
        </div>
        <div class="col-6 text-end fs-6">
          <small>ขั้นตอนที่ {{ state.step }} / 4</small>
        </div>
      </div>
      <ProgressStep
        :current="parseInt(state.step as string)"
        :total="4"
        :title="state.title as string"
      />
      <RouterView />
    </div>
  </div>
</template>
