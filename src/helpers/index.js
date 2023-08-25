import { ElNotification } from 'element-plus'

export const setError = (message) => {
  ElNotification({
    title: 'Error',
    message,
    type: 'error'
  })
}
