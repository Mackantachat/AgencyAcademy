<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import Logo from '@/components/Logo.vue'
import Icon from '@/components/icons/Index.vue'
import IconUser from '@/components/icons/User.vue'
import { reactive, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import type { UserProfile } from '@/types/UserProfile'

const state = reactive<{ menuOpened: boolean; profile?: UserProfile }>({
  menuOpened: false,
  profile: undefined
})

const store = useAuthStore()
const router = useRouter()

router.afterEach(() => {
  state.menuOpened = false
})

const toggleMenu = () => {
  state.menuOpened = !state.menuOpened
  if (state.menuOpened) {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
  } else {
    document.getElementsByTagName('body')[0].style.overflow = ''
  }
}

const logout = () => {
  store.logout()
}

onUnmounted(() => {
  document.getElementsByTagName('body')[0].style.overflow = ''
})
</script>

<template>
  <nav class="py-2" :class="{ opened: state.menuOpened }">
    <div class="container px-3">
      <div class="row align-items-center">
        <div class="col-4">
          <RouterLink to="/" class="header-link">
            <Logo class="header-logo" />
          </RouterLink>
        </div>
        <div class="col-8 d-flex align-items-center justify-content-end">
          <!-- <RouterLink
            to="/login"
            class="btn header-link d-inline-flex align-items-center text-primary fw-normal fs-6 me-2"
          >
            <Icon :width="22" :height="22" class="me-1"><IconUser /></Icon>
            เข้าสู่ระบบ
          </RouterLink> -->
          <div
            v-if="store.profile"
            class="btn header-link d-inline-flex align-items-center text-primary fw-normal fs-6 me-2"
          >
            <!-- <Icon :width="22" :height="22" class="me-1"><IconUser /></Icon> -->
            {{ store.profile?.fullname }}
          </div>
          <button
            class="btn btn-primary hamburger d-block p-0 position-relative"
            type="button"
            aria-label="hamburger"
            :class="{ opened: state.menuOpened }"
            @click="toggleMenu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>
    <div class="navigation text-center">
      <div class="container px-3">
        <ul>
          <li v-if="!store.isAuthenticated">
            <RouterLink to="/register" class="fw-bold py-3 d-block"
              >ลงทะเบียนเข้าใช้งานครั้งแรก</RouterLink
            >
          </li>
          <li v-if="store.isAuthenticated">
            <RouterLink to="/course" class="fw-bold py-3 d-block"
              >คอร์สอบรมทั้งหมด</RouterLink
            >
          </li>
          <li v-if="store.isAuthenticated">
            <RouterLink to="/course?tab=history" class="fw-bold py-3 d-block"
              >คอร์สอบรมของคุณ</RouterLink
            >
          </li>
          <!-- <li v-if="store.isAuthenticated">
            <RouterLink to="/payment" class="fw-bold py-3 d-block"
              >ชำระค่าธรรมเนียมธุรกรรมตัวแทน</RouterLink
            >
          </li>
          <li v-if="store.isAuthenticated">
            <RouterLink to="/order/pending" class="fw-bold py-3 d-block"
              >รายการรอชำระเงิน
              <span class="badge text-bg-light-blue text-white ms-1"
                >4</span
              ></RouterLink
            >
          </li>
          <li v-if="store.isAuthenticated">
            <RouterLink to="/order/completed" class="fw-bold py-3 d-block"
              >ประวัติการชำระเงิน</RouterLink
            >
          </li> -->
          <li v-if="store.isAuthenticated">
            <a href="#" class="fw-bold py-3 d-block" @click="logout"
              >ออกจากระบบ</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  background-color: rgba($secondary, 0.75);
  backdrop-filter: saturate(180%) blur(20px);
  height: $header-height;
  left: 0;
  overflow-y: hidden;
  position: fixed;
  right: 0;
  top: 0;
  transition: all 0.15s ease-in-out;
  z-index: 10001;
  transition: background 0.44s 0.2s cubic-bezier(0.52, 0.16, 0.24, 1),
    height 0.56s cubic-bezier(0.52, 0.16, 0.24, 1);
  .header-logo {
    opacity: 1;
    visibility: visible;
    width: 105px;
    transition: opacity 0.56s cubic-bezier(0.52, 0.16, 0.24, 1);
  }
  .header-link {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.56s cubic-bezier(0.52, 0.16, 0.24, 1);
  }
  .navigation {
    pointer-events: none;
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      li {
        border-bottom: 1px solid $secondary;
        opacity: 0;
        &:nth-child(1) {
          transform: translateY(-44px);
          transition: opacity 0.3345s cubic-bezier(0.52, 0.16, 0.52, 0.84) 0.15s,
            transform 0.4669s cubic-bezier(0.52, 0.16, 0.52, 0.84) 0.108s;
        }
        &:nth-child(2) {
          transform: translateY(-40px);
          transition: opacity 0.30573s cubic-bezier(0.52, 0.16, 0.52, 0.84)
              0.13667s,
            transform 0.45552s cubic-bezier(0.52, 0.16, 0.52, 0.84) 0.09933s;
        }
        &:nth-child(3) {
          transform: translateY(-36px);
          transition: opacity 0.28122s cubic-bezier(0.52, 0.16, 0.52, 0.84)
              0.12333s,
            transform 0.44574s cubic-bezier(0.52, 0.16, 0.52, 0.84) 0.09067s;
        }
        &:nth-child(4) {
          transform: translateY(-32px);
          transition: opacity 0.26098s cubic-bezier(0.52, 0.16, 0.52, 0.84)
              0.11s,
            transform 0.43756s cubic-bezier(0.52, 0.16, 0.52, 0.84) 0.082s;
        }
        &:nth-child(5) {
          transform: translateY(-28px);
          transition: opacity 0.24499s cubic-bezier(0.52, 0.16, 0.52, 0.84)
              0.09667s,
            transform 0.43097s cubic-bezier(0.52, 0.16, 0.52, 0.84) 0.07333s;
        }
        &:nth-child(6) {
          transform: translateY(-24px);
          transition: opacity 0.23327s cubic-bezier(0.52, 0.16, 0.52, 0.84)
              0.08333s,
            transform 0.42598s cubic-bezier(0.52, 0.16, 0.52, 0.84) 0.06467s;
        }
        &:nth-child(7) {
          transform: translateY(-20px);
          transition: opacity 0.22581s cubic-bezier(0.52, 0.16, 0.52, 0.84)
              0.07s,
            transform 0.42259s cubic-bezier(0.52, 0.16, 0.52, 0.84) 0.056s;
        }
        &:nth-child(8) {
          transform: translateY(-16px);
          transition: opacity 0.22261s cubic-bezier(0.52, 0.16, 0.52, 0.84)
              0.05667s,
            transform 0.4208s cubic-bezier(0.52, 0.16, 0.52, 0.84) 0.04733s;
        }
        &:nth-child(9) {
          transform: translateY(-12px);
          transition: opacity 0.22368s cubic-bezier(0.52, 0.16, 0.52, 0.84)
              0.04333s,
            transform 0.4206s cubic-bezier(0.52, 0.16, 0.52, 0.84) 0.03867s;
        }
        &:nth-child(10) {
          transform: translateY(-8px);
          transition: opacity 0.229s cubic-bezier(0.52, 0.16, 0.52, 0.84) 0.03s,
            transform 0.422s cubic-bezier(0.52, 0.16, 0.52, 0.84) 0.03s;
        }
        a {
          font-size: 18px;
          text-decoration: none;
        }
      }
    }
  }
  &.opened {
    background-color: $white;
    height: 100%;
    transition: background 0.36s cubic-bezier(0.32, 0.08, 0.24, 1),
      height 0.56s cubic-bezier(0.52, 0.16, 0.24, 1);
    .header-logo {
      opacity: 0;
      user-select: none;
      visibility: hidden;
      transition: opacity 0.36s cubic-bezier(0.32, 0.08, 0.24, 1);
    }
    .header-link {
      opacity: 0;
      user-select: none;
      visibility: hidden;
      text-overflow: ellipsis;
      flex-wrap: nowrap;
      transition: opacity 0.36s cubic-bezier(0.32, 0.08, 0.24, 1);
    }
    .navigation {
      pointer-events: auto;
      ul {
        li {
          opacity: 1;
          transform: none;
          &:nth-child(1) {
            transition: opacity 0.3091s cubic-bezier(0.32, 0.08, 0.24, 1) 0.03s,
              transform 0.3455s cubic-bezier(0.32, 0.08, 0.24, 1) 0.02s;
          }
          &:nth-child(2) {
            transition: opacity 0.31812s cubic-bezier(0.32, 0.08, 0.24, 1)
                0.04333s,
              transform 0.35351s cubic-bezier(0.32, 0.08, 0.24, 1) 0.03333s;
          }
          &:nth-child(3) {
            transition: opacity 0.32664s cubic-bezier(0.32, 0.08, 0.24, 1)
                0.05667s,
              transform 0.36347s cubic-bezier(0.32, 0.08, 0.24, 1) 0.04667s;
          }
          &:nth-child(4) {
            transition: opacity 0.33467s cubic-bezier(0.32, 0.08, 0.24, 1) 0.07s,
              transform 0.37539s cubic-bezier(0.32, 0.08, 0.24, 1) 0.06s;
          }
          &:nth-child(5) {
            transition: opacity 0.3422s cubic-bezier(0.32, 0.08, 0.24, 1)
                0.08333s,
              transform 0.38926s cubic-bezier(0.32, 0.08, 0.24, 1) 0.07333s;
          }
          &:nth-child(6) {
            transition: opacity 0.34923s cubic-bezier(0.32, 0.08, 0.24, 1)
                0.09667s,
              transform 0.40508s cubic-bezier(0.32, 0.08, 0.24, 1) 0.08667s;
          }
          &:nth-child(7) {
            transition: opacity 0.35577s cubic-bezier(0.32, 0.08, 0.24, 1) 0.11s,
              transform 0.42286s cubic-bezier(0.32, 0.08, 0.24, 1) 0.1s;
          }
          &:nth-child(8) {
            transition: opacity 0.36181s cubic-bezier(0.32, 0.08, 0.24, 1)
                0.12333s,
              transform 0.44258s cubic-bezier(0.32, 0.08, 0.24, 1) 0.11333s;
          }
          &:nth-child(9) {
            transition: opacity 0.36735s cubic-bezier(0.32, 0.08, 0.24, 1)
                0.13667s,
              transform 0.46427s cubic-bezier(0.32, 0.08, 0.24, 1) 0.12667s;
          }
          &:nth-child(10) {
            transition: opacity 0.3724s cubic-bezier(0.32, 0.08, 0.24, 1) 0.15s,
              transform 0.4879s cubic-bezier(0.32, 0.08, 0.24, 1) 0.14s;
          }
        }
      }
    }
  }
}
.hamburger {
  height: 2.125rem;
  overflow: hidden;
  text-indent: 999rem;
  width: 2.125rem;
  span {
    background-color: $white;
    display: block;
    height: 2px;
    left: 0.45rem;
    margin-top: -1px;
    position: absolute;
    right: 0.45rem;
    top: 50%;
    transition: all 0.13s ease-in-out;
    &:nth-child(1) {
      transform: translateY(-0.45rem);
    }
    &:nth-child(3) {
      transform: translateY(0.45rem);
    }
  }
  &.opened {
    span {
      &:nth-child(2) {
        opacity: 0;
      }
      &:nth-child(1) {
        transform: translateY(0) rotate(135deg);
      }
      &:nth-child(3) {
        transform: translateY(0) rotate(225deg);
      }
    }
  }
}

.badge {
  border-radius: 0.75rem;
  display: inline-block;
  font-size: 1rem;
  height: 1.5rem;
  min-width: 1.5rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
}
</style>
