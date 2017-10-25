//index.js
// var changeTabBar = require('../../utils/changeTabBar.js');
// var animation = require('../../utils/animation.js');
var classList = require('../../utils/classList.js');
var md51 = require('../../utils/md51.js');
var requestGet = require('../../utils/requestGet.js');
var publicJs = require('../../utils/public.js');
//获取应用实例
const app = getApp();

Page({
  data: {
    tabBarArr:[
      {id:0,txt:'录入',iconSrc:'../images/write1.gif',changeTextColor:'#1FBB1C',isChange: true},
      {id:1,txt:'查询',iconSrc:'../images/search.gif',changeTextColor:'#525252',isChange: false},
      {id:2,txt:'工具',iconSrc:'../images/setting.gif',changeTextColor:'#525252',isChange: false},
    ],
    yearArr:[
      {id: 2016, value: 2016},
      {id: 2017, value: 2017},
    ],
    semesterArr: [
      {id: 1, value: '秋季'},
      {id: 2, value: '寒假'},
      {id: 3, value: '春季'},
      {id: 4, value: '暑假'}
    ],
    kejieArr:[
      {id: 1, value: '请选择'}
    ],
    classInfo: [], //班级信息数组
    teacherName:'张云',
    schoolYear: 2017,
    semester:'秋季',
    showModalStatus: false, //控制导航显示
    isopen:'open',  //控制菜单显示
    teacherName: '', //教师名称
    teacherToken:'', //教师token
    classInfo:[], //课程信息
    classes: [], //班级
    nSemester: 1,  //学年
    tipClassIndex: 0, //点击的第几个班级
    tipKejieIndex: 1, //点击的第几个课节
    show:false, //控制弹窗显示
    arr:[], //公共数组
    inpStr:'',   //公共显示的字符串
    classInn: '',  //显示的班级字符串
    kejieInn: '请选择', //课节字符串
  },
  onLoad: function(){
    this.setData({
      teacherName: wx.getStorageSync('teacherName'),
      teacherToken: wx.getStorageSync('teacherToken')
    })
    wx.setStorageSync('tipClassIndex',this.data.tipClassIndex);
    this.getClassList();
  },
  onShareAppMessage: function(){
     return {
      title: '转发给好友',
      path: '/pages/entranceDoor/entranceDoor'
    }
  },
  // 改变学年相关值
  getYear: function (e) {
    publicJs.getYear(e,this)
  },
  // 改变学期相关值
  getSemester: function (e) {
    publicJs.getSemester(e,this)
  },
  // 改变班级相关值
  getClass: function (e) {
    publicJs.getClass(e,this)
  },
  getKejie: function(e){
    publicJs.getKejie(e,this)
  },
  // 退出登录
  unlogin: function(){
    publicJs.unlogin()
  },
   // 关闭弹窗
  closeFloat: function(e){
    publicJs.closeFloat(e,this)
  },
  // 菜单按钮
  powerDrawer: function (e) {
    publicJs.powerDrawer(e,this)
  },
  // 关闭导航
  closeNav: function(e){
    publicJs.closeNav(e,this)
  },
  // 点击改变tabBar颜色
  changeColor: function(e){
    publicJs.changeColor(e,this)
  },
  goScore: function(){
    if(this.data.classes.length == 1 && this.data.classes[0] == '您此学期没有课程'){
      wx.showModal({
        title: '提示',
        content: '您此学期没有课程',
        showCancel: false
      })
      return;
    };
    if(this.data.kejieInn == '请选择') {
      wx.showModal({
        title: '提示',
        content: '请选择课节',
        showCancel: false
      })
      return;
    }
    wx.navigateTo({url:'/pages/entranceScore/entranceScore'})
  },
  // 获取点击的弹窗的id和value值
  getIndex:function(e){
     // publicJs.getIndex(e,this,0,this.getClassList)
    var inpStr = this.data.inpStr;
    if(inpStr == 'year'){
      this.setData({
        schoolYear:e.target.dataset.id, 
        show: false,
        classInn: this.data.classes[0].value
      })
      this.getClassList();
      wx.setStorageSync('schoolYear',e.target.dataset.id);
    }else if(inpStr == 'semester'){
      this.setData({
        semester:this.data.arr[e.target.dataset.id-1].value, 
        nSemester:e.target.dataset.id, 
        show: false,
        classInn: this.data.classes[0].value
      })
      this.getClassList();
      wx.setStorageSync('semesterIndex',e.target.dataset.id);
    }else if(inpStr == 'class'){
      this.setData({
        classInn:this.data.arr[e.target.dataset.id].value, 
        tipClassIndex:e.target.dataset.id, 
        show: false
      })
      // 获取课节数组
      this.data.kejieArr = [{id: 1, value: '请选择'}]
      var lesson = this.data.classInfo[this.data.tipClassIndex].lessonNumber;
      for(var i = 2 ; i <= lesson; i++){
        this.data.kejieArr.push({id: i, value: i});
      }
      this.setData({kejieArr: this.data.kejieArr});

      // 缓存选择的班级信息的编号
      wx.setStorageSync('tipClassIndex',this.data.tipClassIndex);

    }else if(inpStr == 'kejie'){
      this.setData({
        kejieInn:this.data.arr[e.target.dataset.id-1].value, 
        tipKejieIndex:e.target.dataset.id, 
        show: false
      })
      // 缓存选择的课节
      wx.setStorageSync('tipKejieIndex',this.data.tipKejieIndex);
    }
  },
  getClassList: function(){
    var that = this;
    // 时间戳
    var stamp = new Date().getTime();
    // 学年
    var year = this.data.schoolYear;
    // 学期
    var nSemester = this.data.nSemester;
    // 教师token
    var token = this.data.teacherToken;
    
    var query1 = 'appid=web&nClassYear='+ year +'&nSemester='+nSemester+'&PageIndex=1&PageSize=50&timestamp='+stamp+'&token='+token;
    var query2 = 'appid=web&nClassYear='+ year +'&nSemester='+nSemester+'&PageIndex=1&PageSize=50&timestamp='+stamp+'&token='+token+'test';
    var sign = md51.md5(query2.toLowerCase()); 
    var query = query1 + '&sign=' + sign;

    wx.showLoading({
      title:'努力加载中...',
      success: function(){
        requestGet.requestGet('api/Class?'+ query,function(res){
          if(res.data.ResultType == 0){
            var resData = res.data.AppendData;
            if(resData.length == 0){
              that.setData({classes:['您此学期没有课程']});
            }else{
              classList.classList(that.data.classes,resData,that);
              that.setData({classInn: that.data.classes[0].value})

              // 获取课节数组
              that.data.kejieArr = [{id: 1, value: '请选择'}]
              var lesson = that.data.classInfo[that.data.tipClassIndex].lessonNumber;
              for(var i = 2 ; i <= lesson; i++){
                that.data.kejieArr.push({id: i, value: i});
              }
              that.setData({kejieArr: that.data.kejieArr});
            }
          }
          setTimeout(function(){
            wx.hideLoading()
          },500)
        })
      }
    })
  },
  
})
