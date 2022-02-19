import CONSTANT from '../constant/index'
import {isType} from './common'
const {ROUTE} = CONSTANT

export const navigateTo = ({path, params = {}}) => {
  let url = path
  const arr = Object.entries(params)
  arr.forEach(([key, value], index) => {
    if (index === 0) url = url + '?'
    const obj = isType(value, 'Object') || isType(value, 'Array')
    let temp = `${key}=${obj ? JSON.stringify(value) : value}`
    url = url + temp
    if (index !== arr.length - 1) url = url + '&'
    console.log(url);
  });
  wx.navigateTo({url})
}

/**
 * 跳转到 tab 页
 */
export const navToTab = ({path = ROUTE.INDEX, params = {}} = {}) => {
  return wx.switchTab({url: path, ...params})
}

/**
 * 跳到上一页
 */
export const navBack = (delta = 1, params = {}) => {
  const pageStack = getCurrentPages() // 必须要用到时实时获取，否则不准确
  const noPrevPage = pageStack.length <= 1
  if (noPrevPage) {
    return navToTab({params})
  } else {
    return wx.navigateBack({delta, ...params})
  }
}