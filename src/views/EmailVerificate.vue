<template>
  <div class="w-2/4 mx-auto h-screen pt-20">
    <p class="pb-5">Email Verification sent! Check your mail box.</p>
    <el-button v-loading="loading" type="primary" @click="resend()">Resend Email</el-button>
    <el-button v-loading="loading" type="primary" link @click="$router.push({ name: 'login' })"
      >Login</el-button
    >
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const authStore = useAuthStore()
const loading = ref(false)

const resend = () => {
  loading.value = true
  authStore.emailVerificate().then(() => {
    loading.value = false
  })
}
</script>
