<script setup lang="ts">
import { Field, Form } from 'vee-validate'
import Yup from '@/YupExtended'
import Loading from '@/components/LoadingView.vue'
import { useRegisterStore } from '@/stores/RegisterStore'
import { reactive, onMounted } from 'vue'
import { isStaffID, verifyUserInfo } from '@/services/AcademyService'
import { useAppModal } from '@/stores/TempStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const registerStore = useRegisterStore()
const appModal = useAppModal()

const state = reactive({
  isLoaded: true,
  mounted: false
})

onMounted(() => {
  state.mounted = true
  // Make sure that the screen is not accessed directy from url
  if (!registerStore.idInfo) {
    // Show warning dialog and redirect back to step 1
    appModal.openModal(
      'Error',
      'Unable to find necessary data. Please start over',
      true
    )
  }
})

// const restartRegister = () => {
//   appModal.closeModal()
//   router.replace('/register')
// }

const submitForm = async (vals: any) => {
  console.log('submit form with vals', vals)

  state.isLoaded = false
  try {
    const ok = await verifyUserInfo(vals)
    if (ok) {
      // Update modified values to store
      registerStore.idInfo = vals

      // Additional check if ID belong to staff
      const isStaff = await isStaffID(vals.idcard)
      registerStore.isStaff = isStaff

      // Move to next step
      router.push({ name: 'RegisterCreate' })
    }
  } catch (error) {
    if (error instanceof Error) {
      appModal.openModal('Error', error.message)
    }
  } finally {
    state.isLoaded = true
  }
}

const schema = Yup.object({
  name: Yup.string().required('กรุณาระบุชื่อ'),
  surname: Yup.string().required('กรุณาระบุนามสกุล'),
  idcard: Yup.string()
    .required('กรุณาระบุเลขประจำตัวประชาชน')
    // 13 + 4 '-' characters
    .length(17, 'กรุณาระบุเลขประจำตัวประชาชนให้ครบถ้วน')
    .idNumberValidation(),
  laserNo: Yup.string().required('กรุณาระบุรหัสหลังบัตรประชาชน'),
  birthDate: Yup.date().required().typeError('กรุณาระบุวันเดือนปีเกิด')
})
</script>

<template>
  <div>
    <Form
      @submit="submitForm"
      :initial-values="registerStore.idInfo"
      :validation-schema="schema"
      v-slot="{ errors }"
    >
      <div class="row g-3">
        <div class="col-12">
          <label for="name">ชื่อ</label>
          <Field
            name="name"
            type="text"
            class="form-control"
            id="name"
            :class="{ 'is-invalid': errors.name }"
            :validate-on-input="true"
          />
          <div class="invalid-feedback" v-if="errors.name">
            {{ errors.name }}
          </div>
        </div>
        <div class="col-12">
          <label for="last_name">นามสกุล</label>
          <Field
            name="surname"
            type="text"
            class="form-control"
            id="surname"
            :class="{ 'is-invalid': errors.surname }"
            :validate-on-input="true"
          />
          <div class="invalid-feedback" v-if="errors.surname">
            {{ errors.surname }}
          </div>
        </div>
        <div class="col-12">
          <label for="idcard">เลขประจำตัวประชาชน</label>
          <Field
            name="idcard"
            type="tel"
            class="form-control"
            id="idcard"
            :class="{ 'is-invalid': errors.idcard }"
            :validate-on-input="true"
            v-maska="'#-####-#####-##-#'"
            autocomplete="off"
          />
          <div class="invalid-feedback" v-if="errors.idcard">
            {{ errors.idcard }}
          </div>
        </div>
        <div class="col-12">
          <label for="laser_id">รหัสหลังบัตรประชาชน</label>
          <Field
            name="laserNo"
            type="text"
            class="form-control"
            id="laserNo"
            :class="{ 'is-invalid': errors.laserNo }"
            :validate-on-input="true"
            v-maska="{
              mask: 'AA#-#######-##',
              tokens: { A: { pattern: /[a-zA-Z]/, uppercase: true } }
            }"
            autocomplete="off"
            spellcheck="false"
            autocapitalize="off"
            autocorrect="off"
          />
          <div class="invalid-feedback" v-if="errors.laserNo">
            {{ errors.laserNo }}
          </div>
        </div>
        <div class="col-12">
          <label for="birthDate">วันเดือนปีเกิด</label>
          <Field
            name="birthDate"
            type="date"
            class="form-control"
            id="birthDate"
            style="{text-align: : left}"
            :class="{ 'is-invalid': errors.birthDate }"
            :validate-on-input="true"
          />
          <div class="invalid-feedback" v-if="errors.birthDate">
            {{ errors.birthDate }}
          </div>
        </div>
        <div class="col-12">
          <a
            href="https://www.bangkoklife.com/th/About/Child/68"
            target="_blank"
            >นโยบายคุ้มครองข้อมูลส่วนบุคคลของบริษัท</a
          >
        </div>
      </div>
      <div class="footer-content">
        <div class="container px-4 text-center">
          <button type="submit" class="btn btn-green text-primary w-75">
            ตรวจสอบข้อมูล
          </button>
        </div>

        <!-- For test -->
        <!-- <div class="container px-4 text-center mt-3">
        <RouterLink
          :to="{ name: 'UserExist' }"
          class="btn btn-green text-primary w-75"
        >
          ตรวจสอบข้อมูล<br /><small class="fw-normal"
            >(มีบัญชีผู้ใช้แล้ว)</small
          >
        </RouterLink>
      </div> -->
        <!-- For test -->
      </div>
    </Form>
    <!-- <Teleport to="#modalButtons" v-if="state.mounted">
      <button class="btn btn-primary me-2" @click="restartRegister">
        เริ่มใหม่
      </button>
    </Teleport> -->
    <Loading v-if="!state.isLoaded" />
  </div>
</template>
