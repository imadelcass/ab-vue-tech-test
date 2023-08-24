import { defineStore } from 'pinia'
import {} from 'firebase/firestore'
import {
  db,
  storage,
  storageRef,
  uploadBytes,
  deleteObject,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc
} from '@/firebase/init.js'

export const useBlogStore = defineStore('blogs', {
  state: () => ({
    blogs: [],
    invalidBlogMsg: "Your progress is saved. Please click 'Submit' to finalize."
  }),

  actions: {
    fetch() {
      return new Promise((resolve) => {
        getDocs(collection(db, 'blogs'))
          .then((snapshot) => {
            this.blogs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            resolve()
          })
          .catch(() => resolve())
      })
    },

    get(id) {
      return new Promise((resolve, reject) => {
        let videos = []

        // get blog videos
        getDocs(collection(db, 'blogs', id, 'videos'))
          .then((snapshot) => {
            videos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          })
          .then(() => {
            // get blog
            getDoc(doc(db, 'blogs', id))
              .then((e) => resolve({ id, ...e.data(), videos }))
              .catch(() => reject())
          })
      })
    },

    add(blog) {
      return new Promise((resolve, reject) => {
        try {
          // store videos to storage
          this.addVideosStorage(blog.videos)
            .then(() => {
              // Add a new blog to Firestore blogs collection
              return addDoc(collection(db, 'blogs'), {
                title: blog.title,
                description: blog.description,
                isValid: blog.isValid,
                created_at: blog.created_at
              })
            })
            .then((docRef) => this.addVideos(docRef.id, blog.videos))
            .then(() => {
              this.fetch()
              resolve()
            })
        } catch (err) {
          reject(err)
        }
      })
    },

    update(blog) {
      return new Promise((resolve) => {
        // get videos
        this.get(blog.id)
          .then(({ videos }) => {
            const videosToDelete = videos.filter(
              (v) => !blog.videos.map(({ name }) => name).includes(v.name)
            )
            return this.deleteVideosStorage(videosToDelete)
          })
          // this.deleteBlogVideosStorage(blog.id)
          .then(() => {
            this.addVideosStorage(blog.videos.filter(({ raw }) => raw !== undefined)).then(() => {
              updateDoc(doc(db, 'blogs', blog.id), {
                title: blog.title,
                description: blog.description,
                isValid: blog.isValid,
                created_at: blog.created_at
              })
                .then(() => this.removeVideos(blog.id))
                .then(() => this.addVideos(blog.id, blog.videos))
                .then(() => {
                  this.fetch()
                  resolve()
                })
            })
          })
      })
    },

    delete(id) {
      // delet doc with his subcollection and vedios
      return new Promise((resolve, reject) => {
        this.deleteBlogVideosStorage(id).then(() => {
          deleteDoc(doc(db, 'blogs', id))
            .then(() => {
              this.fetch()
              resolve()
            })
            .catch(() => reject())
        })
      })
    },

    // add subcollection videos
    addVideos(id, videos) {
      return new Promise((resolve) => {
        Promise.all(
          videos.map((video) =>
            addDoc(collection(db, 'blogs', id, 'videos'), {
              name: video.name,
              start_time: video.start_time,
              end_time: video.end_time,
              length: video.length,
              url: 'videos/' + video.name
            })
          )
        ).then(() => resolve())
      })
    },

    // delete subcollection videos
    removeVideos(id) {
      return new Promise((resolve) => {
        getDocs(collection(db, 'blogs', id, 'videos'))
          .then((snapshot) =>
            snapshot.docs.map((e) => deleteDoc(doc(db, 'blogs', id, 'videos', e.id)))
          )
          .then(() => resolve())
      })
    },

    addVideosStorage(videos) {
      return new Promise((resolve) => {
        Promise.all(
          videos.map((video) => uploadBytes(storageRef(storage, `videos/${video.name}`), video.raw))
        ).then(() => resolve())
      })
    },

    deleteVideosStorage(videos) {
      return new Promise((resolve) => {
        Promise.all(videos.map((video) => deleteObject(storageRef(storage, video.url)))).then(() =>
          resolve()
        )
      })
    },

    deleteBlogVideosStorage(id) {
      return new Promise((resolve) => {
        getDocs(collection(db, 'blogs', id, 'videos'))
          .then((snapshot) =>
            snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .map((doc) => {
                deleteObject(storageRef(storage, doc.url))
              })
          )
          .then(() => resolve())
      })
    }
  }
})
