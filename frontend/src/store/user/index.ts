import { defineStore } from 'pinia'
import type { AjaxResponse } from '@/api'
import { prefix_url } from '@/api'
import { Message } from '@arco-design/web-vue'
import { useMainStore } from '@/store/main'
import router from '@/router'
import type { UserRecord } from '@/api/list'
import { reject } from 'lodash-es'
import { getUserLikeTags } from '@/utils/tag'
import _ from 'lodash'

// export interface User {
//   avatar: string
//   id: number
//   nickname: string
//   register_time: string
//   area: string
//   gender: string
//   age: number
//   email: string
//   signature: string
// }

// impo mandert { mande } from 'mande'
// const api = mande('/api/users')

export const guestUser = {
  avatar: prefix_url + 'static/user/avatars/default.jpeg',
  nickname: '未登录'
}
export const adminUser = {
  avatar: prefix_url + 'static/user/avatars/admin-blue.png',
  nickname: 'Admin'
}

export const useUserStore = defineStore('user', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => ({
    // userList: [] as User[]
    isAdmin: false,
    userData: undefined as UserRecord | undefined,
    isStoredToken: false,
    userLikeTags: [] as string[]
    // ...
  }),
  getters: {
    isAdminOrCurUser: (state) => (userId?: number | string) => {
      if (typeof userId === 'string') {
        userId = parseInt(userId)
      }
      return state.isAdmin || (state.userData && state.userData.id === userId)
    },
    isUserNotAdmin: (state) => (): boolean => {
      return state.userData !== undefined && !state.isAdmin
    },

    // 表示已登录
    getCurrentUser: (state) => state.userData as UserRecord | undefined,

    // 表示登录的普通用户
    getCurrentUserNotAdmin: (state) => {
      // assert(!state.isAdmin, 'Is admin') // FIXME: getCurrentUserNotAdmin
      return state.userData as UserRecord
    },

    // getUserById: (state) => {
    //   return (userId: number | string | undefined) =>
    //     new Promise<User>((resolve, reject) => {
    //       fetch(prefix_url + `/user/get?id=${userId}`, {
    //         method: 'GET'
    //       }).then((res) => {
    //         if (res.ok) {
    //           res.json().then((data: User[]) => {
    //             resolve(data[0])
    //           })
    //         } else {
    //           reject(res.statusText)
    //         }
    //       })
    //     }).catch((e) => {
    //       Message.error(e.message)
    //       reject(e.message)
    //       location.reload()
    //     })
    // },
    getUserInfoAll: () => () =>
      new Promise<UserRecord[]>((resolve, reject) => {
        fetch(prefix_url.concat('user/info/all'), {
          method: 'GET'
        })
          .then((res) => {
            if (res.ok) {
              res.json().then((records: UserRecord[]) => {
                resolve(records)
              })
            } else {
              reject(res.statusText)
            }
          })
          .catch((e) => {
            reject(e.message)
          })
      }),
    getUserInfoById: () => (userId: number | string) =>
      new Promise<UserRecord>((resolve, reject) => {
        fetch(prefix_url.concat(`user/info/${userId}`), {
          method: 'GET'
        })
          .then((res) => {
            if (res.ok) {
              res.json().then((record: UserRecord) => {
                resolve(record)
              })
            } else {
              reject(res.statusText)
            }
          })
          .catch((e) => {
            reject(e.message)
          })
      }),
    getUserAvatar: (state) =>
      state.userData !== undefined
        ? state.userData.avatar
        : state.isAdmin
          ? adminUser.avatar
          : guestUser.avatar,
    getUserNickname: (state) =>
      state.userData !== undefined
        ? state.userData.nickName
        : state.isAdmin
          ? adminUser.nickname
          : guestUser.nickname,
    getUserLikeTags: (state) => (num: number) => {
      return num === -1 ? state.userLikeTags : _.sampleSize(state.userLikeTags, num)
    }
  },
  actions: {
    async userLogin(userId: number | string, needRefresh?: boolean) {
      if (typeof userId === 'string') {
        userId = parseInt(userId)
      }
      try {
        // this.userData = user
        this.getUserInfoById(userId)
          .then((user) => {
            this.isAdmin = false
            this.userData = user
            this.refreshUserLikeTags()
            this.setStoreToken(true)
            const mainStore = useMainStore()
            mainStore.setLoginVisible(false)
            if (needRefresh) {
              // location.reload()
            }
            if (mainStore.goToPost) {
              router.push({ name: 'postVideo' })
              mainStore.setGoToPost(false)
            }
          })
          .catch((msg) => {
            Message.info(msg)
            this.userLogOut()
          })

        // this.userData = await api.post({ login, password })
        // showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        // showTooltip(error)
        // 让表单组件显示错误
        return error
      }
    },
    userLogOut() {
      this.isAdmin = false
      localStorage.removeItem('currentUser')
      location.reload()
    },
    pwdLogin(email: string, pwd: string) {
      return new Promise<UserRecord>((resolve, reject) => {
        fetch(prefix_url + `/user/login/pwd?email=${email}&pwd=${pwd}`, {
          method: 'POST'
        })
          .then((res) => {
            if (res.ok) {
              res.json().then((ajaxData: AjaxResponse) => {
                if (ajaxData.ajax_ok) {
                  Message.success({
                    id: 'loginRes',
                    content: ajaxData.ajax_msg
                  })
                  resolve(ajaxData.ajax_data as UserRecord)
                } else {
                  reject(ajaxData.ajax_msg)
                }
              })
            } else {
              Message.error(res.statusText)
            }
          })
          .catch((e) => {
            Message.error(e.message)
          })
      })
    },
    adminLogin() {
      this.isAdmin = true
      this.userData = undefined
      this.refreshUserLikeTags()
      this.setStoreToken(true)
      const mainStore = useMainStore()
      mainStore.setLoginVisible(false)
    },
    checkLogin() {
      return new Promise<UserRecord>((resolve, reject) => {
        if (this.userData !== undefined) {
          resolve(this.userData as UserRecord)
        } else {
          reject()
        }
      })
    },
    setStoreToken(toStore: boolean) {
      if (toStore) {
        localStorage.setItem(
          'currentUser',
          this.isAdmin ? adminUser.nickname : this.getCurrentUserNotAdmin.id.toString()
        )
        this.isStoredToken = true
      } else {
        localStorage.removeItem('currentUser')
        this.isStoredToken = false
      }
    },
    async deleteUser(userId: string | number) {
      return new Promise<void>((resolve, reject) => {
        fetch(prefix_url.concat(`user/delete?id=${userId}`), {
          method: 'POST'
        }).then((res) => {
          if (res.ok) {
            res.json().then((ajaxData: AjaxResponse) => {
              if (ajaxData.ajax_ok) {
                Message.success(ajaxData.ajax_msg)
                resolve()
              } else {
                reject(ajaxData.ajax_msg)
              }
            })
          } else {
            reject(res.statusText)
          }
        })
      }).catch((e) => {
        reject(e.message)
      })
    },
    refreshUserLikeTags() {
      if (this.isUserNotAdmin()) {
        getUserLikeTags(this.getCurrentUserNotAdmin.id).then((tags) => {
          this.userLikeTags = tags
        })
      } else {
        this.userLikeTags = []
      }
    }
  }
})
