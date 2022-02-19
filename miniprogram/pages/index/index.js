import { updateMusics } from '../../api/api'
import { navigateTo } from '../../utils/route'
import CONSTANT from '../../constant/index'
import { musics as fileData } from '../../data/musics'
import { pick, deepClone } from '../../utils/common'
const { ROUTE, STORAGE_KEY } = CONSTANT

// 列表项高度
const ITEM_HEIGHT = 80
// 列表项上外边距
const ITEM_MARGIN_TOP = 5
// 满星数
const MAX_STAR = 5

Component({
  data: {
    musics: [],
    // 移动的是哪个元素块
    moveId: null,
    // 最终停止的位置
    endY: 0,
    ITEM_HEIGHT,
    // 列表高度
    areaHeight: 0,
    // 排序方式
    rank: [
      { key: 'stars_1', text: '难度(大到小)' },
      { key: 'stars_2', text: '难度(小到大)' },
      { key: 'singer_1', text: '歌手(正)' },
      { key: 'singer_2', text: '歌手(反)' },
    ],
    rankIndex: 0,
  },

  methods: {
    onShow() {
      const storage = wx.getStorageSync(STORAGE_KEY.MUSICS)
      const musics = (storage && JSON.parse(storage)) || fileData
      this.setData({ areaHeight: (ITEM_HEIGHT + ITEM_MARGIN_TOP) * (musics.length + 1) })
      this.init(musics)
    },

    // 重置列表顺序
    init(musics, update = true) {
      const list = musics.map((item, index) => {
        item.id = index
        // 单项顶部距离(组件默认是绝对定位且 left:0 & top:0 )
        item.y = (ITEM_HEIGHT + ITEM_MARGIN_TOP) * index + ITEM_MARGIN_TOP
        const full = Math.floor(item.difficulty)
        const half = item.difficulty % 1 !== 0 ? 1 : 0
        const empty = MAX_STAR - full - half
        item.stars = [...new Array(full).fill('full'), ...new Array(half).fill('half'), ...new Array(empty).fill('empty')]
        return item
      })
      console.log('[init.list]', list)
      this.setData({ musics: list })
      if (update) {
        const storage = list.map((item) => pick(item, ['uuid', 'name', 'singer', 'difficulty']))
        wx.setStorageSync(STORAGE_KEY.MUSICS, JSON.stringify(storage))
      }
    },

    moved(e) {
      const { musics, moveId, endY } = this.data
      // 点击内部事件 moveId 丢失
      if (!moveId) return
      let list = deepClone(musics)
      list[moveId].y = endY
      list = list.sort((a, b) => a.y - b.y)
      this.init(list)
    },

    moving(e) {
      const {
        detail,
        currentTarget: { dataset },
      } = e
      this.setData({
        moveId: dataset.moveid,
        endY: detail.y,
      })
    },

    // 置顶
    stick(e) {
      const { index } = e.currentTarget.dataset
      const { musics } = this.data
      let list = deepClone(musics)
      const target = list.splice(index, 1)[0]
      list.unshift(target)
      this.init(list)
    },

    // 新增
    add(e) {
      navigateTo({ path: ROUTE.FORM })
    },

    // 修改
    edit(e) {
      const { item } = e.currentTarget.dataset
      navigateTo({ path: ROUTE.FORM, params: pick(item, ['uuid', 'name', 'singer', 'difficulty']) })
    },

    // 删除
    delete(e) {
      const { index } = e.currentTarget.dataset
      const { musics } = this.data
      let list = deepClone(musics)
      list.splice(index, 1)
      this.init(list)
    },

    rank(e) {
      const { value: index } = e.detail
      const { musics, rank } = this.data
      const target = rank[index].key
      let list = musics
      switch (target) {
        case 'stars_1':
          list = list.sort((a, b) => b.difficulty - a.difficulty)
          break
        case 'stars_2':
          list = list.sort((a, b) => a.difficulty - b.difficulty)
          break
        case 'singer_1':
          list = list.sort((a, b) => a.singer[0].localeCompare(b.singer[0]))
          break
        case 'singer_2':
          list = list.sort((a, b) => b.singer[0].localeCompare(a.singer[0]))
          break
        default:
          break
      }
      console.log(list)
      this.init(list, false)
    },

    // 复制内容到粘贴板
    copy() {
      const storage = wx.getStorageSync(STORAGE_KEY.MUSICS)
      wx.setClipboardData({
        data: storage
      })
    },

    // 同步服务端数据到本地
    async download() {
      const { musics } = this.data
      await updateMusics(musics.map((item) => pick(item, ['name', 'singer', 'difficulty'])))
    },
  },
})
