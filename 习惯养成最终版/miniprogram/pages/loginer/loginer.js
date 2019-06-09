// pages/loginer/loginer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hiddenmodalput: true,
    res_db: { _id: "", password: "", score: 0, card: 0,reward: '',sex: "",student_id:"",username:"",addr:""},
    cname: '',
    sexx: '',
    iname: '',
    student_id: ''
  },

  cancel: function (e) {
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
  sel: function (e) {
    this.setData({
      student_id: e.detail.value
    })
  },
  ina: function (e) {
    this.setData({
      iname: e.detail.value
    })
  },

  confirm: function (e) {

    var that = this;
    if (!(that.data.sexx == '男' || that.data.sexx == '女')) {
      wx.showToast({
        title: '性别输入有误',
      })
      return;
    }
    if (!that.data.cname) {
      wx.showToast({
        title: '用户名有误',
      })
      return;
    }
    if (that.data.student_id.length != 11) {
      wx.showToast({
        title: '手机号有误',
      })
      return;
    }
    if (that.data.iname != '') {
      const db = wx.cloud.database()
      //console.log(that.data.iname)
      wx.cloud.callFunction({
        name: 'database',
        data: {
          type: "get", //指定操作是insert  
          db: "user", //指定操作的数据表
          limit: 1,
          skip: 0,
          condition: { student_id: that.data.iname }
        },
        success: function (res) {
          //console.log(res.result.data)
          that.data.res_db = res.result.data[0]
          //console.log(that.data.res_db)
          //console.log(that.data.res_db.student_id)
          //console.log(that.data.res_db.score)
          if (res.result.data.length == 0) {
            wx.showToast({
              title: '无此邀请人',
              icon: 'loading'
            })
            return;
          }
          else{
            wx.cloud.callFunction({
              name: 'database',
              data: {
                type: "get", //指定操作是insert  
                db: "user", //指定操作的数据表
                limit: 1,
                skip: 0,
                condition: { 
                    username: that.data.cname }
              },
              success: function (res) {
                //console.log(res.result.data)
                if (res.result.data.length != 0 ) {
                  wx.showToast({
                    title: '用户名已存在',
                    icon: 'loading'
                  })
                }
                else{
                  wx.cloud.callFunction({
                    name: 'database',
                    data: {
                      type: "get", //指定操作是insert  
                      db: "user", //指定操作的数据表
                      limit: 1,
                      skip: 0,
                      condition: { student_id: that.data.student_id }
                    },
                    success: function (res) {
                      if (res.result.data.length != 0) {
                        wx.showToast({
                          title: '手机号已注册',
                          icon: 'loading'
                        })
                      }
                      else {
                        that.setData({
                          hiddenmodalput: true
                        })
          console.log(that.data.res_db.score + 2)
          wx.cloud.callFunction({
            name: 'database',
            data: {
              type: "update", //指定操作是insert  
              db: "user", //指定操作的数据表
              indexKey: that.data.res_db._id ,
              data: { 
                score: that.data.res_db.score+2
              }
            },
            success: function (res) {
              wx.showToast({
                title: '被邀请成功',
                icon: 'success'
              })
              wx.cloud.callFunction({
                name: 'database',
                data: {
                  type: "insert", //指定操作是insert  
                  db: "user", //指定操作的数据表
                  data: { //指定insert的数据
                    username: that.data.cname,
                    password: app.globalData.openid,
                    score: 0,
                    card: 0,
                    reward: '',
                    sex: that.data.sexx,
                    student_id: that.data.student_id,
                    addr: app.globalData.avatarUrl
                  }
                },
                success: function (res) {
                  console.log(res)
                  wx.showToast({
                    title: '注册成功',
                    icon: 'success'
                  })
                  that.data.res_db._id = res.result._id
                  that.data.res_db.username = that.data.cname
                  that.data.res_db.password = app.globalData.openid
                  that.data.res_db.score = 0
                  that.data.res_db.card = 0
                  that.data.res_db.reward = ''
                  that.data.res_db.sex = that.data.sex
                  that.data.res_db.student_id = that.data.student_id
                  that.data.res_db.addr = app.globalData.avatarUrl
                  app.globalData.mine = that.data.res_db
                  //console.log(app.globalData.mine)
                  wx.switchTab({
                    url: '../mine/mine',
                  });
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
                  })
                }
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

    }
    else {
      wx.cloud.callFunction({
        name: 'database',
        data: {
          type: "get", //指定操作是insert  
          db: "user", //指定操作的数据表
          limit: 1,
          skip: 0,
          condition: {
            username: that.data.cname
          }
        },
        success: function (res) {
          //console.log(res.result.data)
          if (res.result.data.length != 0) {
            wx.showToast({
              title: '用户名已存在',
              icon: 'loading'
            })
          }
          else {
            wx.cloud.callFunction({
              name: 'database',
              data: {
                type: "get", //指定操作是insert  
                db: "user", //指定操作的数据表
                limit: 1,
                skip: 0,
                condition: { student_id: that.data.student_id }
              },
              success: function (res) {
                if (res.result.data.length != 0) {
                  wx.showToast({
                    title: '手机号已注册',
                    icon: 'loading'
                  })
                }
                else {
                  that.setData({
                    hiddenmodalput: true
                  })
                      wx.cloud.callFunction({
                        name: 'database',
                        data: {
                          type: "insert", //指定操作是insert  
                          db: "user", //指定操作的数据表
                          data: { //指定insert的数据
                            username: that.data.cname,
                            password: app.globalData.openid,
                            score: 0,
                            card: 0,
                            reward: '',
                            sex: that.data.sexx,
                            student_id: that.data.student_id,
                            addr: app.globalData.avatarUrl
                          }
                        },
                        success: function (res) {
                          wx.showToast({
                            title: '注册成功',
                            icon: 'success'
                          })
                          console.log(res)
                          that.data.res_db._id = res.result._id
                          that.data.res_db.username = that.data.cname
                          that.data.res_db.password = app.globalData.openid
                          that.data.res_db.score = 0
                          that.data.res_db.card = 0
                          that.data.res_db.reward = ''
                          that.data.res_db.sex = that.data.sex
                          that.data.res_db.student_id = that.data.student_id
                          that.data.res_db.addr = app.globalData.avatarUrl
                          app.globalData.mine = that.data.res_db
                          //console.log(app.globalData.mine)
                          wx.switchTab({
                            url: '../mine/mine',
                          });
                        },
                        error: function (error) {
                          console.log(error)
                        }
                      });
                    }
                
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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
    // 获取用户信息

  bindGetUserInfo: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        //console.log(res)
        app.globalData = res.userInfo
        //console.log(app.globalData)
      }
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        //console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        //console.log(app.globalData.openid)
        wx.cloud.callFunction({
          name: 'database',
          data: {
            type: "get", //指定操作是insert  
            db: "user", //指定操作的数据表
            limit: 1,
            skip: 0,
            condition: { password: app.globalData.openid }
          },
          success: function (res) {
            //console.log("-======-")
            //console.log(app.globalData.openid)
            app.globalData.mine = res.result.data[0]
           // console.log(res.result.data[0])
            //console.log("===============-------")
            if (res.result.data.length != 0) {
              wx.showToast({
                title: '登陆成功',
                icon: 'success'
              })
              wx.switchTab({
                url: '../mine/mine',
              });
            }
            else {
              that.setData({
                hiddenmodalput: false
              })
            }
          },
          error: function (error) {
            console.log(error)
          }
        });
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)

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
    wx.stopPullDownRefresh()
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
  }
})