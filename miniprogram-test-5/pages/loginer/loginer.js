// pages/main/main.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hiddenmodalput: true,
    cname: '',
    sexx: '',
    iname: ''
  },
  cancel: function(e){
    wx.showToast({
      title: '务必输入',
      icon: 'loading'
    })
  },
  cn: function (e) {
    console.log(e.detail.value)
    this.setData({
      cname: e.detail.value
    })
  },

  se: function (e) {
    console.log(e.detail.value)
    this.setData({
      sexx: e.detail.value
    })
  },
  ina: function (e) {
    this.setData({
      iname: e.detail.value
    })
  },
   /* 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindGetUserInfo: function (e) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称

          //调用API从本地缓存中获取数据
          try {
            var value = wx.getStorageSync('user_openid')
            if (value) {
              console.log("value不为空")
              app.login()
              wx.switchTab({
                url: '../punch/punch',
              })
            } else {
              console.log("value为空")
              wx.login({
                success: function (res) {
                  console.log('res', res)

                  
                }
              
              });
            }
          } catch (e) {
            console.log("登陆失败")
          }
          wx.checkSession({
            success: function () {
            },
            fail: function () {
              //登录态过期
              wx.login()
            }
          })

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})