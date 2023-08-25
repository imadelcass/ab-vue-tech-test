<template>
  <el-form ref="formRef" label-position="top" :model="form" :rules="rules">
    <div class="grid grid-cols-1 gap-4">
      <div class="col-span-1">
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" />
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  email: '',
  password: ''
})

const formRef = ref(null)

const rules = ref({
  email: [{ required: true, message: 'Please input email address', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }]
})

defineExpose({
  form,
  formRef
})
</script>
