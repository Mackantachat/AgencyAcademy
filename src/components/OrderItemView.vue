<script setup lang="ts">
import { RouterLink } from 'vue-router'
import dayjs from 'dayjs'
import th from 'dayjs/locale/th'
import { numberWithCommas, getStatus } from '@/Helpers'
dayjs.locale(th)
</script>

<template>
  <div class="row">
    <div class="col-8">
      <h6 class="fs-6 text-primary text-decoration-underline">
        <RouterLink :to="{ name: 'OrderDetail', params: { id: item?.id } }">
          รายการ: {{ item.order_number }}
        </RouterLink>
      </h6>
    </div>
    <div class="col-4 text-end">
      <span class="fw-bold text-primary"
        >{{ item ? numberWithCommas(item?.total) : 0 }} บาท</span
      >
    </div>
  </div>
  <div class="row align-items-end">
    <div class="col-8">
      <ul v-if="item?.order_items.length" class="ps-4 mb-1">
        <li v-for="(list, key) in item.order_items" :key="key">
          {{ list.title }}
        </li>
      </ul>
      <p class="m-0" v-if="item?.order_status === 'pending'">
        วันที่ทำรายการ:
        <span class="text-primary">{{
          item ? dateFormat(item?.order_date) : '-'
        }}</span>
      </p>
      <p class="m-0">
        สถานะ:
        <span class="text-primary">{{
          item ? getStatus(item?.order_status) : '-'
        }}</span>
      </p>
      <p class="m-0" v-if="item?.order_status === 'paid'">
        วันที่ชำระเงิน:
        <span class="text-primary">{{ dateFormat(item?.paid_date) }}</span>
      </p>
    </div>
    <div class="col-4 text-end" v-if="item?.order_status === 'pending'">
      <RouterLink
        :to="{ name: 'OrderDetail', params: { id: item?.id } }"
        class="btn btn-green text-primary"
        role="button"
        >ชำระเงิน</RouterLink
      >
    </div>
  </div>
</template>

<script lang="ts">
let item: any
export default {
  props: {
    item
  },
  methods: {
    dateFormat(val: any) {
      return dayjs(val).format('DD MMM YY (HH:mm)')
    }
  }
}
</script>
