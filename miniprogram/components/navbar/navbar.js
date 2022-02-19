import device from '../../lib/device'
import {navToIndex, navBack} from '../../utils/route'

Component({
  properties: {
    // 是否显示 navbar
    active: {
      type: Boolean,
      value: true,
    },
    // 显示返回按钮
    showBackBtn: {
      type: Boolean,
      value: true,
    },
    // 状态栏文字、返回箭头、右侧胶囊的颜色，仅支持 black 和 white
    frontColor: {
      type: String,
      value: 'black',
    },
    // navbar 的 container 元素是否占位
    placeholder: {
      type: Boolean,
      value: true,
    },

    title: {
      type: String,
      value: '',
    },

    titleColor: {
      type: String,
      value: 'black',
    },

    backgroundColor: {
      type: String,
      value: '#ffffff',
    },

    backgroundImage: {
      type: String,
      value: '',
    },

    /**
     * @property {WechatMiniprogram.AnimationOption.duration} fadeDuration
     */
    fadeDuration: {
      type: Number,
      value: 300,
    },

    /**
     * @property {'linear'|'ease-in'|'ease-out'|'none'} fadeTimingFunc
     */
    fadeTimingFunc: {
      type: String,
      value: 'ease-out',
    },

    isNavToIndex: {
      type: Boolean,
      value: false,
    },
  },

  attached() {
    const {active, titleColor, frontColor, backgroundColor, backgroundImage} = this.data

    this.setData({
      active,
      titleColor,
      frontColor,
      backgroundColor,
      backgroundImage,
      statusBarHeight: device.getStatusBarHeight(),
      contentBarHeight: device.getNavbarHeight() - device.getStatusBarHeight(),
      navBarHeight: device.getNavbarHeight(),
    })

  },

  methods: {
    navBack() {
      this.data.isNavToIndex ? navToIndex() : navBack()
    },
  },
})
