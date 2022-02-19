import http from './http'

// 将数据传到服务端，服务端直接更新 data/musics.js 文件数据
export const updateMusics = (musics) => {
  return http({
    url: '/update',
    data: {musics},
    method: 'POST'
  })
}