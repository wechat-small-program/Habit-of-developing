// pages/main/main.js
var app = getApp()
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "***",
    userImg: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      upImg: true,
      loading: false,
      isdisabled: false,
      modifyLoading: false
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
      that.setData({
        userImg: app.globalData.avatarUrl,
        inputValue: app.globalData.mine.username
      })
    //that.data.inputValue = app.globalData.mine.username
    //console.log(app.globalData.mine.username)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  scorequery: function(e){
    wx.showToast({
      title: '当前积分:' + app.globalData.mine.score+'分',
    })
    // wx.cloud.callFunction({
    //   name: 'database',
    //   data: {
    //     type: "get", //指定操作是insert  
    //     db: "user", //指定操作的数据表
    //     limit: 1,
    //     skip: 0,
    //     condition: { student_id: app.globalData.mine.student_id }
    //     //condition: { score: 0 }
    //   },
    //   success: function (res) {
    //     wx.showToast({
    //       title: '当前积分:' + res.result.data[0].score,
    //     })
    //   },
    //   error: function (error) {
    //     console.log(error)
    //   }
    // });
  },
  modifyNick: function(){
    wx.showToast({
      title: '补签卡:' + app.globalData.mine.card+'张',
    })
  },
  modifyImg: function(){
    wx.showToast({
      title: '死了这条心吧',
      icon: 'loading'
    })
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
    return{
      title:"不来打死你",
      path: "pages/loginer/loginer"
    }
  }
})