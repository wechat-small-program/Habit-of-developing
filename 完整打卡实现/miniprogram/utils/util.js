const formatTime = date => {
  const y = date.getFullYear()
  const mo = date.getMonth() + 1
  const d = date.getDate()
  const h = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()
  return { year: formatNumber(y), month: formatNumber(mo), day: formatNumber(d), hour: formatNumber(h), minute: formatNumber(m), second: formatNumber(s)}
}


function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


module.exports = {
  formatTime: formatTime
}
