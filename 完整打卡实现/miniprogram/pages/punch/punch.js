// pages/main/main.js
var util = require('../../utils/util.js');
var app = getApp();
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  btn_click: function(){
    var that = this
    var mydata = util.formatTime(new Date())
    wx.cloud.callFunction({
      name: 'database',
      data: {
        type: "get", //指定操作是insert  
        db: "daka", //指定操作的数据表
        limit: 10,
        skip: 0,
        //condition: { student_id: app.globalData.mine.student_id }
        condition: { year: mydata.year, month: mydata.month, day: mydata.day, username: app.globalData.mine.username }
      },
      success: function (res) {
        if(res.result.data.length != 0){
          wx.showToast({
            title: '今日已打卡',
            icon: 'loading'
          })
        }
        else{
          //这里添加加分条件实现不同时段加分不同
          app.globalData.mine.score = app.globalData.mine.score + 2
          wx.cloud.callFunction({
            name: 'database',
            data: {
              type: "update", //指定操作是insert  
              db: "user", //指定操作的数据表
              condition: { student_id: app.globalData.mine.student_id },
              data: { //指定insert的数据
                //groupID: wx.getStorageSync("groupID"),
                //subject: ["语文soc", "数学", "英语", "物理", "化学", "历史", "地理", "政治"]
                score: app.globalData.mine.score
              }
            },
            success: function (res) {
              wx.cloud.callFunction({
                name: 'database',
                data: {
                  type: "insert", //指定操作是insert  
                  db: "daka", //指定操作的数据表
                  data: { //指定insert的数据
                    username: app.globalData.mine.username,
                    addr: app.globalData.avatarUrl,
                    year: mydata.year,
                    month: mydata.month,
                    day: mydata.day,
                    hour: mydata.hour,
                    minute: mydata.minute,
                    second: mydata.second
                  }
                },
                success: function (res) {
                  wx.showToast({
                    title: '打卡成功 +2分',
                    icon: 'success'
                  })
                },
                error: function (error) {
                  console.log(error)
                }
              });
            },

            error: function (error) {
              console.log(error)
            }
          })
        }
      },
      error: function (error) {
        console.log(error)
      }
    });
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