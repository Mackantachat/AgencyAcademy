<script setup lang="ts">
import axios from 'axios'
import dayjs from 'dayjs'
import th from 'dayjs/locale/th'
import Loading from '@/components/LoadingView.vue'
import Header from '@/components/layouts/HeaderView.vue'
import BackButton from '@/components/BackButton.vue'
import FullModal from '@/components/FullModal.vue'
import CloseButton from '@/components/CloseButton.vue'
import QRPaymentInstruction from '@/components/QRPaymentInstruction.vue'
import Icon from '@/components/icons/Index.vue'
import WarningIcon from '@/components/icons/Warning.vue'
import { numberWithCommas, getStatus } from '@/Helpers'
dayjs.locale(th)
</script>

<template>
  <Header />
  <div
    class="page"
    :class="{ 'max-full-page': order.order_status === 'pending' }"
    v-if="isLoaded"
  >
    <div class="container px-3 py-4">
      <BackButton class="mb-3" />
      <h1 class="text-primary fw-bold fs-4 mb-2">
        รายการ: {{ order.order_number }}
      </h1>
      <div class="border-bottom border-2 mb-2 border-green"></div>
      <div class="mb-3" v-if="order.order_status === 'pending'">
        <p class="m-0">
          วันที่ทำรายการ:
          <span class="text-primary">{{ dateFormat(order.order_date) }}</span>
        </p>
        <p class="m-0">
          สถานะ:
          <span class="text-primary">{{ getStatus(order.order_status) }}</span>
        </p>
      </div>
      <div class="mb-3" v-else-if="order.order_status === 'paid'">
        <p class="m-0">
          เลขที่ใบเสร็จ:
          <span class="text-primary">{{ order.receipt_number }}</span>
        </p>
        <p class="m-0">
          สถานะ:
          <span class="text-primary">{{ getStatus(order.order_status) }}</span>
        </p>
        <p class="m-0">
          วันที่ชำระเงิน:
          <span class="text-primary">{{ dateFormat(order.paid_date) }}</span>
        </p>
      </div>
      <ul v-if="order.order_items.length">
        <li v-for="(item, key) in order.order_items" :key="key">
          <div class="row">
            <div class="col-8">{{ item.title }}</div>
            <div class="col-4 text-end text-primary">
              {{ numberWithCommas(item.amount) }} บาท
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="footer-content" v-if="order.order_status === 'pending'">
      <div class="container px-4 text-center mb-2">
        <p class="text-center fs-5 m-0">จำนวนเงินที่ต้องชำระ</p>
        <p class="text-center text-primary fs-4 fw-bold">
          {{ numberWithCommas(order.total) }} บาท
        </p>
      </div>
      <div class="container px-4 text-center mb-2">
        <button
          class="btn btn-green text-primary w-75"
          type="button"
          @click="pay"
        >
          สแกน QR Code เพื่อชำระเงิน
        </button>
      </div>
      <div class="container px-4 text-center">
        <button
          class="btn fw-normal fs-6 text-decoration-underline"
          type="button"
          @click="isPaymentInsOpened = true"
        >
          <Icon :width="16" :height="16" class="me-1"><WarningIcon /></Icon>
          วิธีการชำระเงินโดยการสแกน QR Code
        </button>
      </div>
    </div>
  </div>

  <!-- QR Code Instruction -->
  <FullModal :opened="isPaymentInsOpened">
    <div class="full-page">
      <div class="container px-3 pt-4">
        <div class="row align-items-start mb-3">
          <div class="col-10">
            <h5 class="text-primary fw-bold m-0">
              การชำระเงินโดยการสแกน QR Code ผ่านแอปทุกธนาคาร
            </h5>
          </div>
          <div class="col-2 text-end">
            <CloseButton
              class="text-primary"
              @click="isPaymentInsOpened = false"
            />
          </div>
        </div>
        <QRPaymentInstruction />
      </div>
    </div>
  </FullModal>

  <Loading v-if="!isLoaded" />
</template>

<script lang="ts">
let order: any = {}
export default {
  data() {
    return {
      order,
      isLoaded: false,
      isPaymentInsOpened: false
    }
  },
  async created() {
    const id = this.$route.params.id
    const _vm = this
    const res = await axios.get(`/api/v1/order/${id}`)
    if (res.data) {
      _vm.order = res.data
      _vm.isLoaded = true
    } else {
      _vm.isLoaded = true
    }
  },
  methods: {
    dateFormat(val: any) {
      return dayjs(val).format('DD MMM YY (HH:mm)')
    },
    pay(e: any) {
      e.preventDefault()
      const _vm = this
      const id = _vm.$route.params.id
      _vm.isLoaded = false
      axios
        .post(`/api/v1/verify`, { id })
        .then((res) => {
          if (res.data.status === true) {
            _vm.$router.push({ name: 'Payment', params: { id } })
          }
        })
        .catch((err) => {
          _vm.isLoaded = true
        })
    }
  }
}
</script>
