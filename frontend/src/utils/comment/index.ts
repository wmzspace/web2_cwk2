import type { AjaxResponse } from '@/api'
import { prefix_url } from '@/api'
import _ from 'lodash'
import { Message } from '@arco-design/web-vue'

export const parseCommentByRaw = (r: RawComment): Comment => {
  return {
    id: r.id,
    authorId: r.author_id,
    content: r.content,
    parentId: r.parent_id === null ? undefined : r.parent_id,
    publishTime: r.publish_time,
    videoId: r.video_id,
    authorAvatar: r.author_avatar,
    authorName: r.author_name
  }
}

export const getCommentsByVideoIdOrParent = (
  videoId: number | undefined,
  parentId: number | undefined
) => {
  const result: Comment[] = []
  const videoString = videoId === undefined ? '' : `&video_id=${videoId}`
  const parentString = parentId === undefined ? '' : `&parent_id=${parentId}`
  return new Promise<Comment[]>((resolve, reject) => {
    fetch(prefix_url.concat(`comment/get?`).concat(videoString).concat(parentString), {
      method: 'GET'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              const data = ajaxData.ajax_data as RawComment[]
              data.forEach((e) => {
                const comment = parseCommentByRaw(e)
                result.push(comment)
              })
              resolve(_.cloneDeep(result))
            } else {
              Message.info(ajaxData.ajax_msg)
            }
          })
        }
      })
      .catch((e) => {
        Message.error(e)
        reject(e)
      })
  })
}
export const getCommentLikeUsersByCommentId = (commentId: number) =>
  new Promise<number[]>((resolve, reject) => {
    fetch(prefix_url.concat(`comment/get_likes?comment_id=${commentId}`))
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              resolve(ajaxData.ajax_data as number[])
            } else {
              Message.info('获取评论点赞信息失败：' + ajaxData.ajax_msg)
              reject()
            }
          })
        }
      })
      .catch((e) => {
        Message.error(e.message)
        // resolve([])
        reject(e)
      })
  })

export const likeCommentOrNot = (
  commentId: number | string,
  userId: number | string,
  toLike: boolean
) =>
  new Promise<void>((resolve, reject) => {
    fetch(
      prefix_url.concat(`comment/like?comment_id=${commentId}&user_id=${userId}&to_like=${toLike}`),
      {
        method: 'POST'
      }
    )
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              Message.success(ajaxData.ajax_msg)
              resolve()
            } else {
              Message.info('操作失败：' + ajaxData.ajax_msg)
              reject()
            }
          })
        }
      })
      .catch((e) => {
        Message.error(e.message)
      })
  })

// interface PostCommentRawResponse {
//   comment_id: number
// }

export const postComment = (
  authorId: number | string,
  content: string,
  videoId: number | string | undefined,
  parentId: number | undefined
) => {
  const videoString = videoId === undefined ? '' : `&video_id=${videoId}`
  const parentString = parentId === undefined ? '' : `&parent_id=${parentId}`
  return new Promise<Comment | undefined>((resolve, reject) => {
    fetch(
      prefix_url
        .concat(`comment/post?`)
        .concat(`&author_id=${authorId}`)
        .concat(`&content=${content}`)
        .concat(videoString)
        .concat(parentString),
      {
        method: 'POST'
      }
    )
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              Message.success(ajaxData.ajax_msg)
              const data = ajaxData.ajax_data as RawComment
              resolve(parseCommentByRaw(data))
            } else {
              Message.info('评论失败：' + ajaxData.ajax_msg)
              resolve(undefined)
            }
          })
        } else {
          Message.error(res.statusText)
          reject(res.statusText)
        }
      })
      .catch((e) => {
        Message.error(e.message)
        reject(e.meta)
      })
  })
}

export const deleteComment = (commentId: number) => {
  return new Promise<boolean>((resolve, reject) => {
    fetch(prefix_url.concat(`comment/delete?`).concat(`&comment_id=${commentId}`), {
      method: 'POST'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              Message.success(ajaxData.ajax_msg)
              resolve(true)
            } else {
              Message.info(ajaxData.ajax_msg)
              resolve(false)
            }
          })
        } else {
          Message.error(res.statusText)
          reject(res.statusText)
        }
      })
      .catch((e) => {
        Message.error(e.message)
        reject(e.meta)
      })
  })
}

export interface Comment {
  id: number
  videoId: number
  parentId?: number
  authorId: number
  content: string
  publishTime: string
  authorName: string
  authorAvatar: string
}

export interface RawComment {
  id: number
  author_id: number
  video_id: number
  content: string
  parent_id: number | null
  publish_time: string
  author_name: string
  author_avatar: string
}
