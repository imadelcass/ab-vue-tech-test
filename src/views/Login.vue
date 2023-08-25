<template>
  <div class="w-2/4 mx-auto h-screen pt-20">
    <div class="h-full">
      <h1 class="text-3xl text-center py-10 font-bold">Login</h1>
      <div v-loading="loading">
        <step-one ref="stepOneRef" />
        <!-- Footer -->
        <div class="pt-10 text-end">
          <el-button type="primary" @click="submit()" :loading="loading">Submit</el-button>
          <p class="pt-2">Or you don't have an account? <router-link to="/signup" class="text-blue-500">Sign up</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StepOne from '@/components/StepOne.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const stepOneRef = ref(null)
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const submit = () => {
  stepOneRef.value.formRef.validate(async (valid) => {
    if (valid) {
      loading.value = true
      authStore
        .signIn(stepOneRef.value.form)
        .then(() => {
          if (authStore.user.emailVerified) {
            router.push({ name: 'home' })
          } else {
            router.push({ name: 'email-verificate' })
          }
        })
        .finally(() => (loading.value = false))
    }
  })
}
</script>
