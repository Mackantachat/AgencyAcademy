<script setup lang="ts">
import { Field, Form } from 'vee-validate'
import * as Yup from 'yup'
import Loading from '@/components/LoadingView.vue'
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  registerUser,
  requestRegisterOtp,
  verifyRegisterOtp
} from '@/services/AcademyService'
import { useAppModal } from '@/stores/TempStore'
import { useRegisterStore } from '@/stores/RegisterStore'

const route = useRoute()
const router = useRouter()
const appModal = useAppModal()
const store = useRegisterStore()

const state = reactive<{ loading: boolean; refCode?: string }>({
  loading: false,
  refCode: ''
})

const schema = Yup.object().shape({
  otp: Yup.string().required('กรุณาระบุ OTP')
})

onMounted(() => {
  console.log('before route update', route.params)
  state.refCode = route.params?.refCode as string
})

const verifyOtp = async (values: any) => {
  try {
    state.loading = true
    const result = await verifyRegisterOtp({
      ...values,
      otpRef: state.refCode
    })
    console.log('Verify otp result', result)
    if (result) {
      // OTP verified, create the user.
      const req = store.registerRequest
      console.log('Registering user', req)
      const ok = await registerUser(req)
      if (ok) {
        // Move to next step.
        router.push({ name: 'RegisterComplete' })
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      appModal.openModal('Error', error.message)
    }
  } finally {
    state.loading = false
  }
}

const requestOtp = async () => {
  try {
    const req = store.otpRequest
    state.loading = true
    const result = await requestRegisterOtp(req)
    if (result) {
      state.refCode = result.refCode
    }
  } catch (error) {
    if (error instanceof Error) {
      appModal.openModal('Error', error.message)
    }
  } finally {
    state.loading = false
  }
}
</script>

<template>
  <Form
    @submit="verifyOtp"
    :validation-schema="schema"
    v-slot="{ errors, meta }"
  >
    <div class="row g-3">
      <div class="col-12">
        <label for="otp">รหัส OTP</label>
        <Field
          name="otp"
          type="text"
          class="form-control"
          id="otp"
          :class="{ 'is-invalid': errors.otp }"
          :validate-on-input="true"
          autocomplete="one-time-code"
          spellcheck="false"
          autocapitalize="off"
          autocorrect="off"
          ref="otp"
        />
        <div class="invalid-feedback" v-if="errors.otp">
          {{ errors.otp }}
        </div>
        <div class="form-text">(รหัสอ้างอิง {{ state.refCode }})</div>
        <div class="form-text">โปรดตรวจสอบรหัส OTP ตามอีเมลที่ระบุ</div>
      </div>
    </div>
    <div class="footer-content">
      <div class="container px-4 text-center mb-3">
        <button
          class="btn text-primary w-75"
          :class="{
            'disable btn-gray': !meta.valid,
            'btn-green': meta.valid
          }"
          :disabled="!meta.valid"
        >
          ยืนยัน OTP
        </button>
      </div>
      <div class="container px-4 text-center mb-3">
        <button
          class="btn text-primary text-decoration-underline w-75"
          type="button"
          @click="requestOtp"
        >
          ขอรับรหัสใหม่
        </button>
      </div>
    </div>
  </Form>
  <Loading v-if="state.loading" />
</template>
