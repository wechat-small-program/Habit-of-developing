var app = getApp();
Page({
  shop: function (e) {
    var id = e.currentTarget.id
    var that = this
    var good = that.data.dataList[id]
    wx.showModal({
      title: '提示',
      content: '是否确定消耗' + good.goods_price.toString()+'积分购买'+good.goods_title,
      success: function (res) {
        //console.log(res)
        if (res.confirm) {
          //console.log('用户点击确定')
          //console.log(e)
          if (app.globalData.mine.score < good.goods_price){
            wx.showToast({
              title: '积分不足',
              icon: 'loading',
            })
          }
          else{
            if(good.goods_id == 0){
              //console.log(good)
            wx.cloud.callFunction({
              name: 'database',
              data: {
                type: "update",  
                db: "user", 
                indexKey: app.globalData.mine._id,
                data: { 
                  score: app.globalData.mine.score - good.goods_price,
                  card: app.globalData.mine.card + 1
                }
              },
              success: function (res) {
                app.globalData.mine.score = app.globalData.mine.score - good.goods_price
                app.globalData.mine.card = app.globalData.mine.card + 1
                wx.showToast({
                  title: '购买成功',
                  icon: 'success',
                })
              }
            })
            }
            else{
              wx.cloud.callFunction({
                name: 'database',
                data: {
                  type: "update",
                  db: "user",
                  indexKey: app.globalData.mine._id,
                  data: {
                    score: app.globalData.mine.score - good.goods_price,
                  }
                },
                success: function (res) {
                  app.globalData.mine.score = app.globalData.mine.score - good.goods_price
                  wx.showToast({
                    title: '购买成功',
                    icon: 'success',
                  })
                }
              })
            }
          }
        } 
      }
    })
  },

  /**
   * 页面的初始数据
   */
  data: {


    dataList: [
      {
        goods_id: 0,
        goods_title: '补签卡',
        goods_img: '/images/buqian.png',
        goods_details: '补签一天',
        goods_price: 10
      }, {
        goods_id: 1,
        goods_title: '清扬植觉',
        goods_img: '/images/qy.jpg',
        goods_details: '林彦俊代言',
        goods_price: 99
      }, {
        goods_id: 2,
        goods_title: '半永久耳环',
        goods_img: '/images/erhuan.jpg',
        goods_details: '林彦俊同款',
        goods_price: 80
      }, {
        goods_id: 3,
        goods_title: '林彦俊海报',
        goods_img: '/images/haibao2.jpg',
        goods_details: '确定不兑换吗？？！',
        goods_price: 18
      }, {
        goods_id: 4,
        goods_title: '水色手机壳',
        goods_img: '/images/shoujike.jpg',
        goods_details: '林彦俊应援色手机壳',
        goods_price: 29
      },
       {
        goods_id: 5,
        goods_title: 'superga',
        goods_img: '/images/superga.jpg',
         goods_details: '林彦俊品牌大使',
        goods_price: 329
      },
      {
        goods_id: 6,
        goods_title: '萧邦香水',
        goods_img: '/images/xiaobang.jpg',
        goods_details: '林彦俊品牌挚友',
        goods_price: 412
      },
      {
        goods_id: 7,
        goods_title: '雅诗兰黛樱花微精华',
        goods_img: '/images/ysld.jpg',
        goods_details: '樱花挚友林彦俊',
        goods_price: 860
      },
      {
        goods_id: 8,
        goods_title: '珑驤',
        goods_img: '/images/lx.jpg',
        goods_details: '男士系列品牌大使林彦俊',
        goods_price: 824
      }
    ],
  }
})