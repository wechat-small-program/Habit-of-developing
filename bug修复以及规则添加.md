[TOC]

## bug修复以及规则添加

### 背景

​	上文已经将底层代码基本写好了，然后交给前端去进行优化添加组件的同时，自己测试了一下自己的基本功能发现一些bug

### bug-one

​	有个体验用户没有填手机号就注册成功了，开始只想着完成基本功能就好了，现在既然底层代码都写完了，这也算是个小bug了，本着既然开始挖这些小漏洞，干脆就把注册信息的填写弄得更完美一点

​	注册检测功能：

- 检测输入的手机号是否为11位，检测是否输入姓名，以及性别是否为男、女

- 检测输入的姓名以及手机号是否已经注册过

- 检测输入了邀请人手机号的时候，手机号是否存在

  更改的代码：

  ```javascript
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
            if (that.data.res_db.student_id != that.data.iname) {
              wx.showToast({
                title: '无此邀请人',
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
                data: { //指定insert的数据
                  //groupID: wx.getStorageSync("groupID"),
                  //subject: ["语文soc", "数学", "英语", "物理", "化学", "历史", "地理", "政治"]
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
                            that.data.res_db._id = res.result._id
                            that.data.res_db.username = that.data.cname
                            that.data.res_db.password = app.globalData.openid
                            that.data.res_db.score = 0
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
  ```

  

### bug-two

​	打卡按钮没用设置不能连续按，由于云函数调用过慢，连续按会同时执行。。导致打卡判定都会判定没有打卡，导致重复打卡。。。对于云函数执行过慢，可以说这个程序从开始到现在云函数执行过慢以及小程序的异步处理一直围绕着我，非常痛苦

​	给按钮加了个disabled属性，当按了一次按钮后，按钮的disabled属性变为true使得按钮失效，当按钮函数执行完成后，再让按钮disabled属性变为false，避免了重复执行按钮函数的可能性

​	顺带测试了一下发现注册也存在这个问题。。。小程序有毒

​	按钮处防bug的代码实现：

```javascript
  btn_click: function(){
    var that = this
    that.setData({
      disabled: true,
    });
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
          });
          that.setData({
            disabled: false,
          });
        }
        else{
          //这里添加加分条件实现不同时段加分不同
          console.log(app.globalData.mine.username)
          //console.log("++++++++++++++++++++++")
          wx.cloud.callFunction({
            name: 'database',
            data: {
              type: "update", //指定操作是insert  
              db: "user", //指定操作的数据表
              indexKey: app.globalData.mine._id,
              data: { //指定insert的数据
                //groupID: wx.getStorageSync("groupID"),
                //subject: ["语文soc", "数学", "英语", "物理", "化学", "历史", "地理", "政治"]
                score: app.globalData.mine.score+2
              }
            },
            success: function (res) {
              app.globalData.mine.score = app.globalData.mine.score + 2
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
                    second: mydata.second
                  }
                },
                success: function (res) {
                  wx.showToast({
                    title: '打卡成功 +2分',
                    icon: 'success'
                  });
                  that.setData({
                    disabled: false,
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
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      disabled: false,
    })

    
  },
```

### bug-three

​	排行榜的刷新需要重新登入才能刷新，没有设置下拉刷新。设置了半天都无法实现，非常玄学，非常痛苦，最后只能把加载功能放在了onshow里

### bug-four

​	此外有一个小bug，打卡的时候不加分。。然而调试了半天都没有找到问题。。最后发现居然是更新数据库的云函数调用的参数写错了

​	数据库调用的云函数（update的查询条件的参数名是indexKey，写成了下面的condition）：

```javascript
// runDB云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const targetDB = db.collection(event.db)
  try {
    if (event.type == "insert") {
      return await targetDB.add({
        data: event.data
      })
    }

    if (event.type == "update") {
      return await targetDB.doc(event.indexKey).update({
        data: event.data
      })
    }

    if (event.type == "delete") {
      return await targetDB.where(event.condition).remove()
    }

    if (event.type == "get") {
      return await targetDB.where(event.condition)
        .skip(event.limit * event.skip)
        .limit(event.limit)
        .get()
    }
  } catch (e) {
    console.error(e)
  }
}
```

### 添加规则

​	既然基本功能实现了，就要开始添加游戏规则了

​	规则如下：

1. 每天打卡4点开始认为是第二天，4:00-6:00打卡加6分，6:00-8:00打卡加4分，8:00-10:00打卡加2分，其余时间不让打卡

2. ~~连续打卡满7天，额外加5分，满30天，额外加30分~~，考虑到实现起来比较麻烦，需要考虑到后期可能会增加的补签功能，需要构思好再动手。该功能下次实现

3. ~~每天打卡排名前5名获得10，8，6，4，2的额外加分~~，参考队友`早起习惯而非攀比`意见删除

   第一条规则的实现，直接判定当前时间为几点，然后规定每个时间加的分数，代码添加如下：

   ```javascript
   var that = this
       that.setData({
         disabled: true,
       });
       var add_score
       var mydata = util.formatTime(new Date())
       if(mydata.hour == "04" || mydata.hour == "05"){
         add_score = 6
       }
       else if (mydata.hour == "06" || mydata.hour == "07"){
         add_score = 4
       }
       else if (mydata.hour == "08" || mydata.hour == "09"){
         add_score = 2
       }
       else{
         wx.showToast({
           title: '打卡时间已过',
           icon: 'loading'
         });
         that.setData({
           disabled: false,
         });
         return;
       }var that = this
       that.setData({
         disabled: true,
       });
       var add_score
       var mydata = util.formatTime(new Date())
       if(mydata.hour == "04" || mydata.hour == "05"){
         add_score = 6
       }
       else if (mydata.hour == "06" || mydata.hour == "07"){
         add_score = 4
       }
       else if (mydata.hour == "08" || mydata.hour == "09"){
         add_score = 2
       }
       else{
         wx.showToast({
           title: '打卡时间已过',
           icon: 'loading'
         });
         that.setData({
           disabled: false,
         });
         return;
       }
   ```

