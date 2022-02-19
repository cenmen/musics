const BASE_URL = 'http://172.16.1.222:3000'

export default ({ url, data = {}, method = 'GET', options = {} } = {}) => {
  wx.showLoading({ title: '加载中' })
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-type': 'application/json',
      },
      ...options,
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
          wx.hideLoading()
        } else {
          wx.showToast({ title: '请求失败', icon: 'error' })
          reject(res)
        }
      },
      fail(error) {
        wx.showToast({ title: '请求失败', icon: 'error' })
        console.log('[request.fail]', error)
        reject(error)
      },
    })
  })
}
