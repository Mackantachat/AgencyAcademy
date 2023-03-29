<script setup lang="ts">
import axios from 'axios'
import Loading from '@/components/LoadingView.vue'
import Header from '@/components/layouts/HeaderView.vue'
import OrderItem from '@/components/OrderItemView.vue'
</script>

<template>
  <Header />
  <div class="page" v-if="isOrdersLoaded">
    <div class="container px-3 py-4">
      <h1 class="text-primary fw-bold fs-4">ประวัติการชำระเงิน</h1>
      <div v-if="!orderItems.length">
        <img
          src="@/assets/img/P_BEE_MAI_A.svg"
          class="d-block mx-auto my-4 img-fluid"
          alt="P_BEE_MAI_A"
        />
        <p class="text-center text-primary mb-2">
          ไม่มีรายการประวัติการชำระเงิน
        </p>
      </div>
      <div
        class="my-2 py-4 border-bottom"
        v-for="item in orderItems"
        :key="item.id"
      >
        <OrderItem :item="item" />
      </div>
    </div>
  </div>
  <Loading v-if="!isLoaded" />
</template>

<script lang="ts">
let orderItems: any[] = []
export default {
  data() {
    return {
      orderItems,
      isOrdersLoaded: false,
      isLoaded: false
    }
  },
  async created() {
    const _vm = this
    const res = await axios.get(`/api/v1/orders`, {
      params: { order_status: 'paid' }
    })
    if (res.data) {
      _vm.orderItems = res.data
      _vm.isOrdersLoaded = true
    }
    _vm.isLoaded = true
  }
}
</script>
