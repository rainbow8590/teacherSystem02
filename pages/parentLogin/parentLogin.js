//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userSrc:'../images/user1.jpg',
    passSrc:'../images/pass1.jpg',
    studentPhone:'',
    studentPassword:'',
    shortMessage:'',
    hasStudent: true,//是否有这个学生
    show: true,
    text:'获取验证码',
  },
  onLoad: function(res){
    // console.log(res)
    var queryArr = res.id.split(',')
    wx.setStorageSync('queryArr',queryArr)
    
    //已登录就不再次登陆
    if(wx.getStorageSync('studentMessage')){
      wx.redirectTo({ url: '/pages/taskCardProgress/taskCardProgress'})
      return;
    }
  },
  // 获取输入账号  
  phoneChange: function (e) {
    this.setData({
      studentPhone: e.detail.value
    })
  },  
  // 获取输入密码  
  passwordChange: function (e) {
    this.setData({
      studentPassword: e.detail.value
    })
  },
  shortMessageChange: function(){
    this.setData({
      shortMessage: e.detail.value
    })
  },
  getCode: function(){
    var total = 60;
    var that = this;
    setInterval(function(){
      total--;
      if(total <=0){
        that.setData({
          text:'重新获取'
        })
        return
      }
      that.setData({
        text:total+'秒'
      })
    },1000)
  },
  goPass:function(){
    this.setData({
      show:true
    })
  },
  goMessage:function(){
    this.setData({
      show:false
    })
  },
  // 登陆
  login: function () {

    // wx.redirectTo({ url: '/pages/taskCardProgress/taskCardProgress'})

    var that = this;
    // 校验表单
    if (this.data.studentPhone.length == 0 || this.data.studentPassword.length == 0) {
      wx.showModal({
        title: '提示',
        content: '账号密码不能为空',
        showCancel: false
      })
      return;
    }else {

      // 校验表单成功
      wx.login({
        success: function(response){
          if(response.code){
            wx.request({
              url: 'https://teacherapi.gaosiedu.com/api/StudentLogin', 
              method:'post',
              data: {
                "loginPhone": that.data.studentPhone,
                "password": that.data.studentPassword,
                "kind": 99,
                "appId": "web"
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              // dataType: JSON,
              success: function(res) {
                // console.log(res)
                var resData = res.data;
                if(resData.ResultType == 0){
                  that.setData({hasStudent: true})
                  // console.log(resData.Message)
                  // wx.setStorageSync('teacherToken',resData.Message)
                  wx.setStorageSync('studentMessage',resData.Message)
                  
                }else if(resData.ResultType == 3){
                  that.setData({hasStudent: false})
                }else{
                  wx.showModal({
                    title: '提示',
                    content: '您输入的账号或密码不正确，请重新输入',
                    showCancel: false
                  })
                  return;
                }
                //更新hasStudent的值
                wx.setStorageSync('hasStudent',that.data.hasStudent);
                wx.setStorageSync('studentTask',resData.AppendData);
                wx.redirectTo({ url: '/pages/taskCardProgress/taskCardProgress'});
              },
              fail: function(err){
                // console.log(err)
              }
            })
          }
        }
      })
    }
  },


 // 验证码登陆
  login1: function () {
    // wx.redirectTo({ url: '/pages/taskCardProgress/taskCardProgress'})

    /*var that = this;
    // 校验表单
    if (this.data.studentPhone.length == 0 ) {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
        showCancel: false
      })
      return;
    }else {
      // 校验表单成功
      wx.login({
        success: function(response){
          if(response.code){
            wx.request({
              url: 'https://teacherapi.gaosiedu.com/api/Login', 
              method:'post',
              data: {
                "loginName": that.data.moblie,
                "password": that.data.password,
                "kind": that.data.kind,
                "appId": "web"
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              // dataType: JSON,
              success: function(res) {
                console.log(res)
                var resData = res.data;
                if(resData.ResultType == 0){
                  this.setData({hasStudent: true})
                  // wx.setStorageSync('teacherToken',resData.Message)
                  wx.setStorageSync('studentName',resData.AppendData.sName)
                  
                }else if(resData.ResultType == 3){
                  this.setData({hasStudent: false})
                }else{
                  wx.showModal({
                    title: '提示',
                    content: '您输入的账号或密码不正确，请重新输入',
                    showCancel: false
                  })
                  return;
                }
                //更新hasStudent的值
                wx.setStorageSync('hasStudent',that.data.hasStudent);
                wx.redirectTo({ url: '/pages/taskCardProgress/taskCardProgress'});
              },
              fail: function(err){
                console.log(err)
              }
            })
          }
        }
      })
    }*/
  },
})
