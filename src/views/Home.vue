<template>
  <div class="w-1/2 mx-auto min-h-screen">
    <div class="flex items-center justify-between my-10">
      <h1 class="text-2xl font-bold">Video Blog Application</h1>
      <div class="flex flex-col">
        <el-button type="primary" link @click="authStore.logout()"
          >Logout({{ authStore.user?.displayName }})</el-button
        >
      </div>
    </div>
    <div class="flex justify-center pb-16">
      <el-button type="primary" @click="addBlog()">Add New Video Blog!</el-button>
    </div>
    <div>
      <el-table :data="validBlogs" v-loading="loading">
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="description" label="Description" />
        <el-table-column prop="created_at" label="Created At" />
        <el-table-column label="Actions">
          <template #default="{ row }">
            <el-button size="small" @click="updateBlog(row)">Update</el-button>
            <el-popconfirm
              icon-color="#626AEF"
              title="Are you sure to delete this"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button size="small" type="danger">Delete</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <add-update-blog />
</template>

<script setup>
import AddUpdateBlog from '@/components/AddUpdateBlog.vue'
import { ref, provide, onMounted, computed } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { useAuthStore } from '@/stores/auth'

const dialogVisible = ref(false)
const loading = ref(false)
const blogStore = useBlogStore()
const authStore = useAuthStore()
const blog = ref({})

/** Providers **/
const setDialogVisible = (value) => (dialogVisible.value = value)
provide('blog_dialog', { dialogVisible, blog, setDialogVisible })

/** Lifecycles Hooks **/
onMounted(() => {
  blogStore.fetch()
})

/** Computed **/
const validBlogs = computed(() => blogStore.blogs.filter((blog) => blog.isValid))

/** Methods **/
const addBlog = () => {
  const invalidBlog = blogStore.blogs.find(({ isValid }) => !isValid)

  if (invalidBlog) {
    updateBlog(invalidBlog, blogStore.invalidBlogMsg)
  } else {
    blog.value = {}
    setDialogVisible(true)
  }
}

const updateBlog = (row, msg = null) => {
  blogStore.get(row.id).then((res) => {
    blog.value = { ...res, msg }
    setDialogVisible(true)
  })
}

const handleDelete = (row) => {
  loading.value = true
  blogStore.delete(row.id).finally(() => {
    blogStore.fetch()
    loading.value = false
  })
}
</script>
