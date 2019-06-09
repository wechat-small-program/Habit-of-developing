
//获取应用实例
var app = getApp();

var common = require('../template/getCode.js')
var that;
Page({
  onLoad: function (options) {
    // common.dataLoading("页面加载中","loading");
    that = this;

  },
  onReady: function () {
  },
  onShow: function () {
    
  },
  onHide: function () {
  },
  onUnload: function (event) {
  },
  formSubmit: function (e) {//提交建议
    if (e.detail.value.advise == "" || e.detail.value.advise == null) {
      common.dataLoading("建议不能为空", "loading");
    }
    else {
          wx.showToast({
            title: '我不听我不听',
            icon: 'loading',
            })
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})
