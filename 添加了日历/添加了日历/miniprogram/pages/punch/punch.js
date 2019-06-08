// pages/main/main.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    days: [],       //所有格子
    signUp: [],    //签到的信息
    cur_year: 0,
    cur_month: 0,
    my_mood: '',
    to_mood: '',
    count: 0,
    disabled: false,
    mod_able: true,
    hiddenmodalput: true,
    click_id: -1,
    colors: ['background-color:#83C75D','background-color:#8B0000','']
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前年月 
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    const mod_able = true
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    //获取当前用户当前任务的签到状态
    this.onGetSignUp();
    this.setData({
      cur_year,
      cur_month,
      weeks_ch,
      mod_able
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  ina: function (e) {
    this.setData({
      to_mood: e.detail.value
    })
  },

  cancel: function (e) {
    this.setData({
      hiddenmodalput: true
    })   
  },
  
  confirm: function(){
    this.setData({
      hiddenmodalput: true
    }) 
    var that = this
    wx.cloud.callFunction({
      name: 'database',
      data: {
        type: "update", //指定操作是insert  
        db: "user", //指定操作的数据表
        indexKey: app.globalData.mine._id,
        data: { //指定insert的数据
          //groupID: wx.getStorageSync("groupID"),
          //subject: ["语文soc", "数学", "英语", "物理", "化学", "历史", "地理", "政治"]
          score: app.globalData.mine.score
        }
      },
      success: function (res) {
        var mydata = util.formatTime(new Date())
        console.log(res)
        console.log(app.globalData)
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
              second: mydata.second,
              mood: that.data.to_mood
            }
          },
          success: function (res) {
            wx.showToast({
              title: '打卡成功',
              icon: 'success'
            });
            that.setData({
              disabled: false,
              hiddenmodalput: true
            });
            that.onGetSignUp()
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
  },
  btn_click: function(){
    var that = this
    that.setData({
      disabled: true,
    });
    var add_score
    var mydata = util.formatTime(new Date())
    //if(mydata.hour == "04" || mydata.hour == "23"){
      add_score = 6
    //}
    // else if (mydata.hour == "06" || mydata.hour == "07"){
    //   add_score = 4
    // }
    // else if (mydata.hour == "08" || mydata.hour == "09"){
    //   add_score = 2
    // }
    // else{
    //   wx.showToast({
    //     title: '打卡时间已过',
    //     icon: 'loading'
    //   });
    //   that.setData({
    //     disabled: false,
    //   });
    //   return;
    // }
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
          });
          that.setData({
            disabled: false,
          });
        }
        else{
          app.globalData.mine.score = app.globalData.mine.score + add_score
          that.setData({
            hiddenmodalput: false,
          });
          that.setData({
            disabled: false
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
    this.setData({
      disabled: false,
      mod_able: true
    })
    
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
    return {
      title: "不来打死你",
      path: "pages/loginer/loginer"
    }
  },
  // 获取当月共多少天
  getThisMonthDays: function (year, month) {
    return new Date(year, month, 0).getDate()
  },

  // 获取当月第一天星期几
  getFirstDayOfWeek: function (year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  mood: function (e) {
    //console.log(e.currentTarget)
    if(this.data.click_id == e.currentTarget.id){
      this.data.click_id = -1
    }
    else{
      this.data.click_id = e.currentTarget.id
    }

    //console.log(e.currentTarget.id)
    this.onGetSignUp()
    var that = this;
    that.setData({
      mod_able: true,
      my_mood: ''
    })
    //that.data.days[click].color = that.data.colors[1]
    var year = util.formatNumber(that.data.cur_year)
    var month = util.formatNumber(that.data.cur_month)
    var day = util.formatNumber(that.data.click_id - that.getFirstDayOfWeek(year, month) + 1)
    wx.cloud.callFunction({
      name: 'database',
      data: {
        type: "get", //指定操作是insert  
        db: "daka", //指定操作的数据表
        limit: 10,
        skip: 0,
        condition: {
          username: app.globalData.mine.username,
          year: year,
          month: month,
          day: day
        }
        //condition: { year: mydata.year, month: mydata.month, day: mydata.day }
      },
      success: function (res) {
        if(res.result.data.length > 0){
          console.log(res)
          if (res.result.data[0].mood != ''){
            that.setData({
              my_mood: res.result.data[0].mood,
              mod_able: false
            })
          }
        }
        else{
          that.setData({
            mod_able: true,
            my_mood: ''
          })
        }
      },
      error: function (error) {
        console.log(error)
      }
    });
  },
  // 计算当月1号前空了几个格子，把它填充在days数组的前面
  calculateEmptyGrids: function (year, month) {
    var that = this;
    //计算每个月时要清零
    that.setData({ days: [] });
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    //console.log(firstDayOfWeek)
    //console.log("++++++++++++++++++++")
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        var obj = {
          date: null,
          color: ''
        }
        that.data.days.push(obj);
      }
      this.setData({
        days: that.data.days
      });
      //清空
    } else {
      this.setData({
        days: []
      });
    }
  },

  // 绘制当月天数占的格子，并把它放到days数组中
  calculateDays: function (year, month) {
    var that = this;
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      var obj = {
        date: i,
        color: ''
      }
      that.data.days.push(obj);
    }
    this.setData({
      days: that.data.days
    });
  },

  //匹配判断当月与当月哪些日子签到打卡
  onJudgeSign: function () {
    var that = this;
    var signs = that.data.signUp;
    var daysArr = that.data.days;
    for (var j = 0; j < daysArr.length; j++){
      daysArr[j].color = that.data.colors[2];
    }
    for (var i = 0; i < signs.length; i++) {
      var year = signs[i].year;
      var month = signs[i].month;
      var day = signs[i].day;
      day = parseInt(day);
      for (var j = 0; j < daysArr.length; j++) {
        //年月日相同并且已打卡
        if (that.data.click_id == j) {
          daysArr[j].color = that.data.colors[1];
        }
        else if (year == that.data.cur_year && month == that.data.cur_month && daysArr[j].date == day ) {
          daysArr[j].color = that.data.colors[0];
        }
      }
    }
    that.setData({ days: daysArr, click_id: -1 });
  },

  // 切换控制年月，上一个月，下一个月
  handleCalendar: function (e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      this.onGetSignUp();
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      this.onGetSignUp();
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },

  //获取当前用户该任务的签到数组
  onGetSignUp: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'database',
      data: {
        type: "get", //指定操作是insert  
        db: "daka", //指定操作的数据表
        limit: 10,
        skip: 0,
        condition: { username: app.globalData.mine.username }
        //condition: { year: mydata.year, month: mydata.month, day: mydata.day }
      },
      success: function (res) {
        that.setData({
          signUp: res.result.data,
          count: res.result.data.length
        });
        that.onJudgeSign();
      },
      error: function (error) {
        console.log(error)
      }
    });
  }
})