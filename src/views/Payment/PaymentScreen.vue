<script setup lang="ts">
import VueCountdown from '@chenfengyuan/vue-countdown'
import Loading from '@/components/LoadingView.vue'
import BackButton from '@/components/BackButton.vue'
import { numberWithCommas } from '@/Helpers'
import { useRoute } from 'vue-router'
import { fetchPaymentInfo } from '@/services/AcademyService'

const route = useRoute()

// Load course detail
const { id } = route.params

const info = await fetchPaymentInfo(id as string)
const ttl = 30 * 60 * 1000

const transformCountdown = (props: any) => {
  const formattedProps: any = {}

  Object.keys(props).forEach((k) => {
    const val = props[k]
    formattedProps[k] = val < 10 ? `0${val}` : String(val)
  })

  return formattedProps
}
</script>

<template>
  <div>
    <div class="container px-3 pt-4">
      <BackButton class="mb-3" />
      <p class="text-center m-0">{{ info.payeeName }}</p>
      <p class="text-center m-0">กรุณาชำระเงินก่อน QR Code นี้หมดอายุ</p>
      <vue-countdown
        :time="ttl"
        :transform="transformCountdown"
        v-slot="{ minutes, seconds }"
      >
        <h3 class="text-center text-primary fw-bold my-2">
          {{ minutes }}:{{ seconds }}
        </h3>
      </vue-countdown>
      <div class="qrcode-contains mx-auto">
        <div class="qr-header">Thai Qr Payment</div>
        <div class="qr-body">
          <img
            src="@/assets/img/promptpay-logo.jpg"
            class="promptpay-logo img-fluid d-block mx-auto mb-3"
            alt="promptpay"
            width="1004"
            height="340"
          />
          <div class="qr-wrapper mx-auto">
            <img class="img-fluid d-block" :src="info.qrCodeUrl" alt="qrcode" />
          </div>
        </div>
      </div>
      <p class="text-center text-decoration-underline m-0">ชำระค่าธรรมเนียม:</p>
      <ul>
        <li>
          {{ info.remark }}
        </li>
      </ul>
      <p class="text-center">
        <span class="text-decoration-underline">บัญชี:</span>
        {{ info.payeeName }}
      </p>
      <h3 class="text-center text-primary fw-bold my-2">
        {{ numberWithCommas(info.amount) }} บาท
      </h3>
    </div>
  </div>
  <!-- <Loading v-if="!isLoaded" /> -->
</template>

<style lang="scss" scoped>
.promptpay-logo {
  max-width: 90px;
}
</style>
