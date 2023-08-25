<template>
  <div class="w-2/4 h-2/3 mx-auto pt-20">
    <div class="h-full shadow-xl p-10 border">
      <h1 class="text-3xl text-center py-10 font-bold">Sign Up</h1>
      <div v-loading="loading">
        <el-steps :active="activeStep" finish-status="success" class="w-full pb-10">
          <el-step v-for="(step, i) in steps" :key="i" :title="step.value" />
        </el-steps>

        <!-- Step 1 -->
        <step-one v-show="activeStep === 1" ref="stepOneRef" />

        <!-- Step 2 -->
        <step-two v-show="activeStep === 2" ref="stepTwoRef" />

        <!-- Footer -->
        <div class="flex justify-between pt-10">
          <div>
            <el-button v-if="activeStep === 2" link type="primary" @click="prev()">Prev</el-button>
          </div>
          <div>
            <el-button v-if="activeStep === 1" type="primary" @click="next()" :loading="loading"
              >Next</el-button
            >
            <el-button v-if="activeStep === 2" type="primary" @click="submit()" :loading="loading"
              >Submit</el-button
            >
          </div>
        </div>
        <p class="pt-2 text-end">Or you already have an account? <router-link to="/login" class="text-blue-500">Login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StepOne from '@/components/StepOne.vue'
import StepTwo from '@/components/StepTwo.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const steps = ref([{ value: 'Step 1' }, { value: 'Step 2' }])
const stepOneRef = ref(null)
const stepTwoRef = ref(null)
const activeStep = ref(1)
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter()

/** Methods **/
const next = () => {
  stepOneRef.value.formRef.validate(async (valid) => {
    if (valid) {
      activeStep.value++
    }
  })
}

const prev = () => {
  activeStep.value--
}

const submit = () => {
  stepTwoRef.value.formRef.validate(async (valid) => {
    if (valid) {
      loading.value = true
      authStore
        .signUp({ ...stepOneRef.value.form, ...stepTwoRef.value.form })
        .then(() => router.push({ name: 'email-verificate' }))
        .finally(() => (loading.value = false))
    }
  })
}
</script>
