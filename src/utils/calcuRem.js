/**
 * h5计算根元素字体大小
 */
const resizeEvt =
  'onorientationchange' in window ? 'orientationchange' : 'resize'
const RATIO = 10
const TIMER_PERIOD = 300
const MAX_WIDTH = 750
const BASE_SIZE = MAX_WIDTH / RATIO

/**
 * 为了解决部分安卓机上rem计算错误导致不正常的问题
 * body按正常计算出来的宽度不对
 * 按body的异常比例跟fontSize做计算得到一个新的比例
 */
const fixFontSize = function() {
  const html = document.documentElement
  const body = document.body
  const bodyW = body.style.width
  body.style.width = `${RATIO}rem`
  const bodyWidth = parseInt(window.getComputedStyle(body, null).width)
  const htmlWidth = parseInt(window.getComputedStyle(html, null).width)
  if (bodyWidth !== htmlWidth) {
    const size = (parseInt(html.style.fontSize) * htmlWidth) / bodyWidth
    html.style.fontSize = `${size}px`
  }
  body.style.width = bodyW
}
const recalc = function() {
  const docEl = document.documentElement
  const clientWidth = docEl.clientWidth
  if (!clientWidth) return
  if (clientWidth >= MAX_WIDTH) {
    // docEl.style.fontSize = `${BASE_SIZE}px`
  } else {
    docEl.style.fontSize = `${BASE_SIZE * (clientWidth / MAX_WIDTH)}px`
    fixFontSize()
  }
}
let timer = null
window.addEventListener(resizeEvt, () => {
  clearTimeout(timer)
  timer = setTimeout(recalc, TIMER_PERIOD)
})
window.addEventListener('pageshow', () => {
  clearTimeout(timer)
  timer = setTimeout(recalc, TIMER_PERIOD)
})
recalc()
// document.addEventListener('DOMContentLoaded', recalc);
