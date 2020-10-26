const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    texe_num: 0,
    content: '',
    tittle: ''
  },

  //上传图片
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
  onLoad: function (options) {
   
  },

  texearea: function (e) {
    this.setData({
      texe_num: e.detail.cursor
    })
  },

  formSubmit: function (e) {
    var that = this;
    console.log("formSubmit:")
    console.log(e)
    if (e.detail.value.tittle == "") {
      wx.showToast({
        title: '请输入标题!',
        image: '../../../images/error.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (e.detail.value.content == "") {
      wx.showToast({
        title: '内容还没填写哦',
        image: '../../../images/error.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else {
      wx.showLoading({
        title: '发布中',
      })
      wx.request({
        url: app.server+'/index/feedback',
        header: {
          'content-type': 'application/json' // 默认值
        }, 
        data: {
          openid: app.globalData.openid,
          tittle: e.detail.value.tittle,
          content: e.detail.value.content,
        },
        success: function (res) {
           if(res.data=='ok'){
             wx.hideLoading()
             wx.showToast({
               title: '提交成功！',
               image: '../../../images/success.png'
             })
             that.formReset();
           }else{
             wx.hideLoading()
             wx.showToast({
               title: '提交失败！',
               image: '../../../images/fail.png'
             })
           }
        },
        fail: function (res) {

        }
      });
    }
  },

  // chooseImage: function () { 
  //   var that = this; 
  //   console.log('aaaaaaaaaaaaaaaaaaaa') 
     
  //   wx.chooseImage({ 
  //   count: this.data.count[this.data.countIndex], 
  //   success: function (res) { 
  //   console.log('ssssssssssssssssssssssssss') 
  //   //缓存下 
  //   wx.showToast({ 
  //    title: '正在上传...', 
  //    icon: 'loading', 
  //    mask: true, 
  //    duration: 2000, 
  //    success: function (ress) { 
  //    console.log('成功加载动画'); 
  //    } 
  //   }) 
     
  //   console.log(res) 
  //   that.setData({ 
  //    imageList: res.tempFilePaths 
  //   }) 
  //   //获取第一张图片地址 
  //   var filep = res.tempFilePaths[0] 
  //   //向服务器端上传图片 
  //   // getApp().data.servsers,这是在app.js文件里定义的后端服务器地址 
  //   wx.uploadFile({ 
  //    url: getApp().data.servsers + '/weixin/wx_upload.do', 
  //    filePath: filep, 
  //    name: 'file', 
  //    formData: { 
  //    'user': 'test'
  //    }, 
  //    success: function (res) { 
  //    console.log(res) 
  //    console.log(res.data) 
  //    var sss= JSON.parse(res.data) 
  //    var dizhi = sss.dizhi; 
  //    //输出图片地址 
  //    console.log(dizhi); 
  //    that.setData({ 
  //    "dizhi": dizhi 
  //    }) 
     
  //    //do something 
  //    }, fail: function (err) { 
  //    console.log(err) 
  //    } 
  //    }); 
  //   } 
  //   }) 
  //   }, 
  //   previewImage: function (e) { 
  //   var current = e.target.dataset.src 
     
  //   wx.previewImage({ 
     
  //   current: current, 
  //   urls: this.data.imageList 
  //   }) 
  //   },

  formReset: function (e) {
    this.setData({
      tittle: "",
      content: "",
      texe_num: 0
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