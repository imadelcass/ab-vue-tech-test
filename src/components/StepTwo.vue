<template>
  <el-form ref="formRef" label-position="top" :model="form" :rules="rules">
    <div class="grid grid-cols-1 gap-4">
      <div class="col-span-1">
        <el-form-item label="name" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item label="phone" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item label="photo" prop="photo">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            :auto-upload="false"
            accept="image/*"
            :limit="1"
            @change="handleUpload"
            @remove="handleRemove"
          >
            <template #trigger>
              <el-button type="primary">select photo</el-button>
            </template>
          </el-upload>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: null,
  phone: null,
  photo: null
})

const formRef = ref(null)
const uploadRef = ref(null)

const rules = ref({
  name: [{ required: true, message: 'Please input name', trigger: 'blur' }],
  phone: [{ required: true, message: 'Please input phone', trigger: 'blur' }],
  photo: [{ required: true, message: 'Please select photo', trigger: 'blur' }]
})

const handleUpload = (file) => {
  form.value.photo = file
}

const handleRemove = () => {
  form.value.photo = null
}

defineExpose({
  form,
  formRef
})
</script>
