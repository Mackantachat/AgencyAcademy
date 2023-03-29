<script setup lang="ts">
import { Field, useForm } from 'vee-validate'
import Yup from '@/YupExtended'
import Icon from '@/components/icons/Index.vue'
import IconEye from '@/components/icons/Eye.vue'
import IconHidden from '@/components/icons/Hidden.vue'
import IconSearch from '@/components/icons/IconSearch.vue'

import { reactive } from 'vue'
import type { AgentProfile, RegisterInfo } from '@/types'
import { useAppModal } from '@/stores/TempStore'
import ChooseAgentModal from './ChooseAgentModal.vue'
import { requestRegisterOtp } from '@/services/AcademyService'
import { useRegisterStore } from '@/stores/RegisterStore'
import { useRouter } from 'vue-router'

const appModal = useAppModal()
const store = useRegisterStore()
const router = useRouter()

const schema = Yup.object().shape({
  username: Yup.string()
    .min(6, 'ชื่อผู้ใช้งานต้องไม่ต่ำกว่า 6 ตัวอักษร')
    .max(20, 'ชื่อผู้ใช้งานต้องไม่เกินกว่า 20 ตัวอักษร')
    .matches(
      /^[A-Za-z][A-Za-z0-9]*$/,
      'ชื่อผู้ใช้งานต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น'
    )
    .userNameValidation()
    .required('กรุณาระบุชื่อผู้ใช้งาน'),
  password: Yup.string()
    .required('กรุณาระบุรหัสผ่าน')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      'รหัสผ่านต้องมีไม่ต่ำกว่า 8 ตัวอักษร และประกอบด้วยตัวพิมพ์เล็ก พิมพ์ใหญ่ และตัวเลข'
    ),
  confirm_password: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'รหัสผ่านไม่ตรงกัน'
  ),
  agentCode: Yup.string().when('isStaff', {
    is: 'true',
    then: Yup.string().notRequired().nullable(),
    otherwise: Yup.string().required('กรุณาระบุชื่อหรือรหัสตัวแทน').nullable()
  }),
  email: Yup.string().required('กรุณาระบุอีเมล').email('อีเมลไม่ถูกต้อง'),
  isStaff: Yup.string().notRequired(),
  mobilePhone: Yup.string()
    .required('กรุณาระบุหมายเลขโทรศัพท์มือถือ')
    .length(10, 'กรุณาระบุหมายเลขโทรศัพท์มือถือให้ถูกต้อง'),
  acceptance: Yup.bool()
    .required('กรุณายอมรับข้อตกลงและเงื่อนไขการใช้บริการ')
    .typeError('กรุณายอมรับข้อตกลงและเงื่อนไขการใช้บริการ')
})

const { values, setFieldValue, errors, meta, handleSubmit } = useForm({
  validationSchema: schema
})

let selectedReferral: AgentProfile | undefined = undefined
let referralItems: AgentProfile[] = []
const state = reactive({
  isLoaded: true,
  isReferralModalOpen: false,
  showPassword: false,
  showConfirmPassword: false,
  referralNotFound: false,
  referralItems,
  selectedReferral,
  isStaff: `${store.isStaff}`
})

const cancelReferral = () => {
  console.log('cancel referral')
  state.isReferralModalOpen = false
}

const handleAgentSelected = (agent: AgentProfile) => {
  console.log('confirm referral', agent)
  setFieldValue('agentCode', agent.agentCode)
  state.isReferralModalOpen = false
}

const submitForm = handleSubmit(async (values: RegisterInfo) => {
  console.log('Creating user', values)
  state.isReferralModalOpen = false

  // Save info for next steps.
  store.registerInfo = values

  try {
    const otpReq = store.otpRequest
    const result = await requestRegisterOtp(otpReq)
    console.log('req otp result', result)
    if (result) {
      // Move to next step
      router.push({
        name: 'RegisterVerifyOtp',
        params: { ...result }
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      appModal.openModal('Error', error.message)
    }
  }
})
</script>

<template>
  <form @submit.prevent="submitForm">
    <div class="row g-3">
      <div class="col-12">
        <label class="text-nowrap" for="username"
          >ชื่อผู้ใช้งาน (Username)</label
        >
        <Field
          name="username"
          type="text"
          class="form-control"
          id="username"
          :validate-on-change="false"
          :validate-on-blur="true"
          :validate-on-input="false"
          :class="{ 'is-invalid': errors.username }"
          autocomplete="off"
          spellcheck="false"
          autocapitalize="off"
          autocorrect="off"
        />
        <div class="invalid-feedback" v-if="errors.username">
          {{ errors.username }}
        </div>
      </div>
      <div class="col-12">
        <label for="password">รหัสผ่าน (Password)</label>
        <div class="position-relative">
          <Field
            name="password"
            :type="state.showPassword ? 'text' : 'password'"
            class="form-control"
            id="password"
            :class="{ 'is-invalid': errors.password }"
            :validate-on-input="true"
            autocomplete="off"
            spellcheck="false"
            autocapitalize="off"
            autocorrect="off"
          />
          <div class="invalid-feedback" v-if="errors.password">
            {{ errors.password }}
          </div>
          <button
            class="toggle-eye text-gray"
            type="button"
            id="button-password-eye"
            v-if="values.password"
            @click="state.showPassword = !state.showPassword"
            tabindex="-1"
          >
            <Icon :width="20" :height="20">
              <IconEye v-if="!state.showPassword" />
              <IconHidden v-else />
            </Icon>
          </button>
        </div>
      </div>
      <div class="col-12">
        <label for="confirm_password">ยืนยันรหัสผ่าน (Confirm Password)</label>
        <div class="position-relative">
          <Field
            name="confirm_password"
            :type="state.showConfirmPassword ? 'text' : 'password'"
            class="form-control"
            id="confirm_password"
            :class="{ 'is-invalid': errors.confirm_password }"
            :validate-on-input="true"
            autocomplete="off"
            spellcheck="false"
            autocapitalize="off"
            autocorrect="off"
          />
          <div class="invalid-feedback" v-if="errors.confirm_password">
            {{ errors.confirm_password }}
          </div>
          <button
            class="toggle-eye text-gray"
            type="button"
            id="button-password-eye"
            v-if="values.confirm_password"
            @click="state.showConfirmPassword = !state.showConfirmPassword"
            tabindex="-1"
          >
            <Icon :width="20" :height="20">
              <IconEye v-if="!state.showConfirmPassword" />
              <IconHidden v-else />
            </Icon>
          </button>
        </div>
      </div>
      <div class="col-12" v-if="!state.isStaff">
        <label for="agentCode">รหัสตัวแทนอ้างอิง (หน่วย)</label>
        <div class="input-group">
          <Field
            name="agentCode"
            type="text"
            class="form-control"
            id="agentCode"
            :class="{ 'is-invalid': errors.agentCode }"
            :validate-on-input="true"
            autocomplete="off"
            spellcheck="false"
            autocapitalize="off"
            autocorrect="off"
          />
          <button
            class="btn btn-primary"
            type="button"
            id="referral-search"
            :class="{
              disabled: !values.agentCode || errors.agentCode
            }"
            @click="state.isReferralModalOpen = true"
          >
            <Icon :width="18" :height="18">
              <IconSearch />
            </Icon>
          </button>
        </div>
        <div class="invalid-feedback" v-if="errors.agentCode">
          {{ errors.agentCode }}
        </div>
        <p class="text-primary fw-bold mt-2" v-if="values.referral">
          {{ selectedReferral?.agentFullName }} ({{
            selectedReferral?.agentCode
          }})
        </p>
        <p class="text-danger fw-bold mt-2" v-if="state.referralNotFound">
          ไม่พบชื่อตัวแทนที่ท่านค้นหา กรุณาระบุชื่อหรือรหัสตัวแทนใหม่อีกครั้ง
        </p>
      </div>
      <div class="col-12">
        <div class="input-group">
          <Field
            name="isStaff"
            type="hidden"
            class="form-control"
            v-model="state.isStaff"
          />
          <Field
            name="referral"
            type="hidden"
            class="form-control"
            id="referral"
            :class="{ 'is-invalid': errors.referral }"
            :validate-on-input="true"
          />
        </div>
        <div class="invalid-feedback" v-if="errors.referral">
          {{ errors.referral }}
        </div>
      </div>
      <div class="col-12 mt-4">
        <p class="text-center fw-bold fs-5 m-0">ข้อมูลผู้ใช้งาน</p>
      </div>
      <div class="col-12 mt-0">
        <label for="email">อีเมล</label>
        <Field
          name="email"
          type="email"
          class="form-control"
          id="email"
          :class="{ 'is-invalid': errors.email }"
          :validate-on-input="true"
        />
        <div class="invalid-feedback" v-if="errors.email">
          {{ errors.email }}
        </div>
      </div>
      <div class="col-12">
        <label for="phone_number">หมายเลขโทรศัพท์มือถือ</label>
        <Field
          name="mobilePhone"
          type="tel"
          class="form-control"
          id="mobilePhone"
          :class="{ 'is-invalid': errors.mobilePhone }"
          :validate-on-input="true"
          v-maska="'##########'"
        />
        <div class="invalid-feedback" v-if="errors.mobilePhone">
          {{ errors.mobilePhone }}
        </div>
      </div>
      <div class="col-12">
        <div class="form-check">
          <Field
            name="acceptance"
            class="form-check-input"
            type="checkbox"
            id="acceptance"
            :value="false"
            :class="{ 'is-invalid': errors.acceptance }"
            :validate-on-input="true"
          />
          <label class="form-check-label" for="acceptance">
            ข้าพเจ้ายอมรับ<a href="#" target="_blank"
              >ข้อตกลงและเงื่อนไขการใช้บริการ</a
            >
          </label>
          <div class="invalid-feedback" v-if="errors.acceptance">
            {{ errors.acceptance }}
          </div>
        </div>
      </div>
    </div>
    <div class="footer-content">
      <div class="container px-4 text-center">
        <button
          class="btn text-primary w-75"
          type="submit"
          :class="{
            'disable btn-gray': !meta.valid,
            'btn-green': meta.valid
          }"
          :disabled="!meta.valid"
        >
          ขอรับรหัส OTP
        </button>
      </div>
    </div>
  </form>

  <ChooseAgentModal
    :search-text="values.agentCode"
    v-if="state.isReferralModalOpen"
    @item-selected="handleAgentSelected"
    @on-dismiss="cancelReferral"
    @on-error="(error) => appModal.openModal('Error', error.message)"
  />
  <!-- <Loading v-if="!state.isLoaded" /> -->
</template>
