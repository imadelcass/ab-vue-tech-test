<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :title="form.id ? 'Update Blog' : 'Add Blog'"
    width="60%"
    :before-close="beforeClose"
  >
    <!-- Alert Message  -->
    <div v-if="form.msg" class="pb-4">
      <el-alert :title="form.msg" type="warning" :closable="false" effect="dark" />
    </div>

    <!-- Dialog Steps -->
    <div>
      <el-steps :active="activeStep" finish-status="success" class="w-full">
        <el-step v-for="(step, i) in steps" :key="i" :title="step.value" />
      </el-steps>
    </div>
    <!-- Dialog content -->
    <div v-loading="loading">
      <!-- Step 1 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        status-icon
        label-position="top"
        v-if="activeStep === 1"
      >
        <div class="grid grid-cols-1">
          <div class="col-span-1">
            <el-form-item label="Title" prop="title">
              <el-input v-model="form.title" />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item label="Description" prop="description">
              <el-input v-model="form.description" type="textarea" />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item label="Upload Videos" prop="videos">
              <el-upload
                ref="uploadRef"
                v-model:file-list="form.videos"
                class="upload-demo"
                :auto-upload="false"
                accept="video/*"
                @change="handleUpload"
              >
                <template #trigger>
                  <el-button type="primary">select videos</el-button>
                </template>
              </el-upload>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <!-- Step 2 -->
      <div v-if="activeStep === 2">
        <el-table :data="form.videos" style="width: 100%">
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="length" label="Length" width="180">
            <template #default="{ $index }">
              {{ form.videos[$index].length }}
            </template>
          </el-table-column>
          <el-table-column prop="start_time" label="Start Time" width="180">
            <template #default="{ $index }">
              <el-input-number
                v-model="form.videos[$index].start_time"
                :min="0"
                :max="form.videos[$index].length"
              />
            </template>
          </el-table-column>
          <el-table-column prop="end_time" label="End Time" width="180">
            <template #default="{ $index }">
              <el-input-number
                v-model="form.videos[$index].end_time"
                :min="0"
                :max="form.videos[$index].length"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- Dialog footer -->
    <template #footer>
      <div class="flex justify-between">
        <div>
          <el-button :loading="loading" link v-if="activeStep === 2" @click="activeStep--"
            >Prev</el-button
          >
        </div>
        <div>
          <el-button :loading="loading" @click="beforeClose()">Cancel</el-button>
          <el-button :loading="loading" type="primary" v-if="activeStep === 1" @click="next()"
            >Next</el-button
          >
          <el-button :loading="loading" type="primary" v-else @click="submit()">Submit</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue'
import { useBlogStore } from '@/stores/blog'

const formRef = ref(null)
const uploadRef = ref(null)
const loading = ref(false)
const blogStore = useBlogStore()
const steps = ref([
  {
    key: 'step-1',
    value: 'Enter Text and Video'
  },
  {
    key: 'step-2',
    value: 'Edit Video'
  }
])
const initForm = {
  title: '',
  description: '',
  created_at: new Date().toLocaleDateString(),
  videos: []
}
const form = ref({ ...initForm })
const activeStep = ref(1)

/** Injector */
const { dialogVisible, blog, setDialogVisible } = inject('blog_dialog', false)

/** Computed **/
const rules = computed(() => ({
  title: [{ required: true, message: 'Please input title', trigger: 'blur' }],
  description: [{ required: true, message: 'Please input description', trigger: 'blur' }],
  videos: [{ required: true, message: 'Please upload videos', trigger: 'blur' }]
}))

/** Watchers **/
watch(blog, (newVal) => {
  if (newVal.id) {
    form.value = Object.assign({}, newVal)
  } else {
    form.value = Object.assign({}, initForm)
  }
  activeStep.value = 1
})

/** Methods **/
const next = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      form.value.videos = form.value.videos.map((video) => ({
        name: video.name,
        raw: video.raw,
        length: video.length,
        start_time: video.start_time,
        end_time: video.end_time
      }))
      activeStep.value++
    }
  })
}

const beforeClose = async () => {
  if (activeStep.value === 2 && !form.value.id) {
    loading.value = true
    await blogStore.add({ ...form.value, isValid: false })
    loading.value = false
    setDialogVisible(false)
  } else {
    setDialogVisible(false)
  }
}

const submit = async () => {
  loading.value = true
  if (form.value.id) {
    await blogStore.update({ ...form.value, isValid: true })
  } else {
    await blogStore.add({ ...form.value, isValid: true })
  }
  loading.value = false
  setDialogVisible(false)
}

const handleUpload = (file) => {
  let video = document.createElement('video')
  video.onloadedmetadata = () => {
    window.URL.revokeObjectURL(video.src)
    form.value.videos = form.value.videos.map((e) =>
      e.name == file.name ? { ...e, length: video.duration, start_time: 0, end_time: 0 } : e
    )
  }
  video.src = URL.createObjectURL(file.raw)
}
</script>
