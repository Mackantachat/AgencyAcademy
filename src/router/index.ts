import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import UnauthorizedView from '@/views/UnauthorizedView.vue'
import { getCurrentUserid } from '@/services/AcademyService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: {
        restricted: false
      },
      component: HomeView
    },
    {
      path: '/auth',
      name: 'Auth',
      meta: {
        restricted: false
      },
      component: AuthView
    },
    {
      path: '/unauthorized',
      name: 'Unauthorized',
      meta: {
        restricted: false
      },
      component: UnauthorizedView
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        restricted: false
      },
      component: () => import('@/views/Auth/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      redirect: '/register/step1',
      meta: {
        restricted: false
      },
      component: () => import('@/views/Register/RegisterScreen.vue'),
      children: [
        {
          path: 'step1',
          name: 'IdInfo',
          meta: {
            step: 1,
            title: 'การยืนยันตัวตน'
          },
          component: () => import('@/views/Register/IdInfoView.vue')
        },
        {
          path: 'step2',
          name: 'RegisterReview',
          meta: {
            step: 2,
            title: 'ตรวจสอบข้อมูล'
          },
          component: () => import('@/views/Register/RegisterReview.vue'),
          props: true
        },
        {
          path: 'step3',
          name: 'RegisterCreate',
          meta: {
            step: 3,
            title: 'สร้างบัญชีผู้ใช้งาน'
          },
          component: () => import('@/views/Register/RegisterCreateUser.vue')
        },
        {
          path: 'step4/:refCode',
          name: 'RegisterVerifyOtp',
          meta: {
            step: 4,
            title: 'ยืนยันรหัส OTP'
          },
          component: () => import('@/views/Register/VerifyOtpView.vue')
        },
        {
          path: 'complete',
          name: 'RegisterComplete',
          component: () => import('@/views/Register/RegisterCompleteView.vue')
        },
        {
          path: 'exist',
          name: 'UserExist',
          component: () => import('@/views/Register/Exist.vue')
        }
      ]
    },

    {
      path: '/news/:id',
      name: 'NewsDetail',
      meta: {
        restricted: false
      },
      component: () => import('@/views/News/NewsDetailView.vue')
    },
    // Course
    {
      path: '/course',
      name: 'Course',
      meta: {
        restricted: true
      },
      component: () => import('@/views/Course/CourseScreen.vue')
    },
    {
      path: '/course/:id',
      name: 'CourseDetail',
      meta: {
        restricted: true
      },
      component: () => import('@/views/Course/CourseDetailScreen.vue')
    },
    {
      path: '/course/history/:id',
      name: 'CourseHistoryDetail',
      meta: {
        restricted: true
      },
      component: () => import('@/views/Course/HistoryDetailScreen.vue')
    },
    {
      path: '/course/cancel',
      name: 'CancelConfirmation',
      meta: {
        restricted: true
      },
      component: () => import('@/views/Course/CancelConfirmation.vue')
    },
    {
      path: '/payment/:id',
      name: 'Payment',
      meta: {
        restricted: true
      },
      component: () => import('@/views/Payment/PaymentScreen.vue')
    },
    {
      path: '/order/completed',
      name: 'OrderCompleted',
      meta: {
        restricted: true
      },
      component: () => import('@/views/Order/Completed.vue')
    },
    {
      path: '/order/pending',
      name: 'OrderPending',
      meta: {
        restricted: true
      },
      component: () => import('@/views/Order/PendingOrdersView.vue')
    },
    {
      path: '/order/:id',
      name: 'OrderDetail',
      meta: {
        restricted: true
      },
      component: () => import('@/views/Order/OrderDetailView.vue')
    },
    {
      path: '/payment',
      name: 'AgentPayment',
      meta: {
        restricted: true
      },
      component: () => import('../views/AgentPayment/Index.vue')
    },
    {
      path: '/agent-payment/cart',
      name: 'AgentPaymentCart',
      meta: {
        restricted: true
      },
      component: () => import('../views/AgentPayment/Cart.vue')
    }
  ]
})

router.beforeEach(async (to) => {
  const authenticated = getCurrentUserid() !== null
  if (!authenticated && to.meta?.restricted) {
    // Redirect to login view ?
    return { name: 'Unauthorized' }
  } else {
    return true
  }
})

export default router
