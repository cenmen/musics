import { navBack } from '../../utils/route'
import CONSTANT from '../../constant/index'
import { guid } from '../../utils/common'
const { STORAGE_KEY } = CONSTANT

Component({
  data: {
    form: {
      name: 'ddd',
      singer: 'haa/sss，pp,www',
      difficulty: 2.5,
    },
    errors: '',
  },

  methods: {
    onLoad(options) {
      console.log('[onLoad.options]', options)
      const { uuid, name, singer, difficulty } = options
      if (uuid) {
        this.uuid = uuid
        this.setData({
          form: { name, singer: JSON.parse(singer).join('/'), difficulty },
        })
      }
    },

    onSubmit(e) {
      const { name, singer, difficulty } = e.detail.value
      if (!name) return this.setData({ errors: '请填写歌名' })
      if (!singer) return this.setData({ errors: '请填写歌手' })
      if (!difficulty) return this.setData({ errors: '请填写难度' })
      if (difficulty <= 0 || difficulty > 5) return this.setData({ errors: '难度需大于0且小于5' })
      // 分隔符
      const EXIST_SEPARATOR = /(?:\/|,|，)/g
      const result = {}
      result.name = name
      result.singer = EXIST_SEPARATOR.test(singer) ? singer.split(EXIST_SEPARATOR) : [singer]
      result.difficulty = difficulty % 1 >= 0.5 ? Math.floor(difficulty) + 0.5 : Math.floor(difficulty)
      console.log('[submit.result]', result)
      let storage = wx.getStorageSync(STORAGE_KEY.MUSICS)
      storage = JSON.parse(storage)
      console.log('[storage.before]', storage)
      const target = storage.findIndex((item) => item.uuid === this.uuid)
      if (target !== -1) {
        storage[target] = { uuid: this.uuid, ...result }
      } else {
        storage.push({ uuid: guid(), ...result })
      }
      console.log('[storage.after]', storage)
      wx.setStorageSync(STORAGE_KEY.MUSICS, JSON.stringify(storage))
      navBack()
    },
  },
})
