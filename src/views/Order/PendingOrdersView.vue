<script setup lang="ts">
import Loading from '@/components/LoadingView.vue'
import OrderItemView from '@/components/OrderItemView.vue'
import { listPendingOrders } from '@/services/AcademyService'
import { onMounted, reactive } from 'vue'

const state = reactive<{ items: any[]; isLoaded: boolean }>({
  items: [],
  isLoaded: true
})

// Load pending orders from api
onMounted(async () => {
  state.isLoaded = false
  try {
    const items = await listPendingOrders()
    if (items) {
      state.items = items
    }
  } finally {
    state.isLoaded = true
  }
})
</script>

<template>
  <div class="page" v-if="state.isLoaded">
    <div class="container px-3 py-4">
      <h1 class="text-primary fw-bold fs-4">รายการรอชำระเงิน</h1>
      <div v-if="!state.items.length">
        <img
          src="@/assets/img/P_BEE_MAI_A.svg"
          class="d-block mx-auto my-4 img-fluid"
          alt="P_BEE_MAI_A"
        />
        <p class="text-center text-primary mb-2">ไม่มีรายการรอชำระเงิน</p>
      </div>
      <div
        class="my-2 py-4 border-bottom"
        v-for="item in state.items"
        :key="item.id"
      >
        <OrderItemView :item="item" />
      </div>
    </div>
  </div>
  <Loading v-else />
</template>
