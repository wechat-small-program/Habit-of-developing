// pages/main/main.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.tempData();
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
    this.tempData();
    wx.stopPullDownRefresh();
  },
  tempData: function(){
    var that = this
    var mydata = util.formatTime(new Date())
    console.log(mydata)
    var results = []
    wx.cloud.callFunction({
      name: 'database',
      data: {
        type: "get", //指定操作是insert  
        db: "daka", //指定操作的数据表
        limit: 10,
        skip: 0,
        //condition: { student_id: app.globalData.mine.student_id }
        condition: { year: mydata.year, month: mydata.month, day: mydata.day }
      },
      success: function (res) {
        for(var i = 0; i < res.result.data.length; i++){
          console.log(res.result)
          var object = res.result.data[i]
          var result = {}
          result.time = object.hour + ":" + object.minute + ":" + object.second
          result.rank = i+1
          result.avatar = object.addr
          result.username = object.username
          results[i] = result
        }
        console.log(results);
        that.setData({
          list: results
        });
      },
      error: function (error) {
        console.log(error)
      }
    });
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