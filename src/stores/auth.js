import { defineStore } from 'pinia'
import { setError } from '@/helpers'
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  storage,
  storageRef,
  getDownloadURL,
  uploadBytes,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  signOut
} from '@/firebase/init.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),

  actions: {
    signUp({ email, password, photo, name, phone }) {
      return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            this.addPhotoStorage(photo).then((photoUrl) => {
              //   userCredential.user.phoneNumber = phone

              updateProfile(userCredential.user, { displayName: name, photoURL: photoUrl }).then(
                () => {
                  this.emailVerificate().then(() => {
                    this.user = userCredential.user
                    resolve()
                  })
                }
              )
            })
          })
          .catch((error) => {
            setError(error.message)
            reject()
          })
      })
    },

    signIn({ email, password }) {
      return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            if (userCredential.user.emailVerified) {
              this.user = userCredential.user
              resolve()
            } else {
              this.emailVerificate().then(() => {
                this.user = userCredential.user
                resolve()
              })
            }
          })
          .catch((error) => {
            setError(error.message)
            reject()
          })
      })
    },

    init() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.user = user
          resolve()
        })
      })
    },

    emailVerificate() {
      return new Promise((resolve) => {
        if (!this.user?.emailVerified) {
          sendEmailVerification(auth.currentUser, {
            url: window.location.href
          })
            .catch((error) => setError(error.message))
            .finally(() => resolve())
        } else {
          setError('Email already verified')
          resolve()
          window.location.reload()
        }
      })
    },

    logout() {
      return new Promise((resolve) => {
        signOut(auth).then(() => {
          resolve()
          window.location.reload()
        })
      })
    },

    addPhotoStorage(file) {
      return new Promise((resolve) => {
        const storeRef = storageRef(storage, 'images/' + file.name)

        uploadBytes(storeRef, file.raw).then(() =>
          getDownloadURL(storeRef).then((url) => resolve(url))
        )
      })
    }
  }
})
