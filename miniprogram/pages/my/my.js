//my.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',

    dynamic:0,
    bone:0,
    adopt:0
  },

  onLoad: function() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },


   /**
   * 生命周期函数--监听页面加载
   */
  person_num:function(){
    var that = this
    wx.request({
      url: app.server + '/index/person_num',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        that.setData({
          mc_num: res.data.pet,
          fee:res.data.fee,
          adopt:res.data.adopt
        })
      },
      fail: function (res) { },

    })
  },
  sacn:function(){
    var that=this
    wx.scanCode({
      success:function(res){
        var there=that;
        wx.showLoading({
          title: 'loading...',
        })
        wx.request({
          url: app.server+'/index/process_qrcode',
          data: {
            openid: app.globalData.openid,
            qrcode:res.result
          },
          success: function(res) {
            console.log(res.data)
            if(res.data.status=='success'){
              there.person_num()
              wx.showToast({
                title: '领取成功！',
                image: '/image/success.png',
                duration: 1500
              })
              setTimeout(function () {
                wx.hideToast()
              }, 2000)
            }else{
              wx.showToast({
                title: res.data.errMsg,
                image: '/image/fail.png',
                duration: 1500
              })
              setTimeout(function () {
                wx.hideToast()
              }, 2000)
            }
         
          },
          fail: function(res) {},
        })
        console.log(res.result)
      }
    })
  },
  
  onLoad: function (options) {
    this.person_num()
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
    this.person_num()
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
