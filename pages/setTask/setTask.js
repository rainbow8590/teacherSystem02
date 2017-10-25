//index.js
var classList = require('../../utils/classList.js');
var md51 = require('../../utils/md51.js');
var requestGet = require('../../utils/requestGet.js');
var requestPost = require('../../utils/requestPost.js');
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
    kejieArr:[
      {id: 2, value: '第2讲'}
    ],
    taskArr:[
      {id:0, focus:false, task:'作业', isComplete: true},
      {id:1, focus:false, task:'计算题', isComplete: false},
      {id:2, focus:false, task:'背课文', isComplete: false},
    ],
    classInfo: [], //班级信息数组
    classes:[],
    teacherName:'张云',
    schoolYear: 2017,
    semester:'秋季',
    showModalStatus: false,
    isopen:'open',
    show:false, //控制弹窗的显示
    tipKejieIndex: 2, //第几讲
    arr: [],//公共数组
    inpStr:'',//公共字符串
    classInn:'',
    kejieInn:'第2讲',
    month:'',//截止日
    clock:'',//截止日
    classStr: '',//选择的班级信息
    classCode:'',
    kejieIndex:0,
    endTime:''
  },
  onLoad: function(){
    this.setData({
      teacherName: wx.getStorageSync('teacherName'),
      teacherToken: wx.getStorageSync('teacherToken'),
      tipClassIndex: wx.getStorageSync('tipClassIndex'),
      tipKejieIndex: wx.getStorageSync('tipKejieIndex'),
      semesterIndex: wx.getStorageSync('semesterIndex'),
      schoolYear: wx.getStorageSync('schoolYear'),
      classInfo: wx.getStorageSync('classInfo'),
      kind: wx.getStorageSync('kind'),

    })
    // 设置班级编号及课节
    this.setData({
      classCode:this.data.classInfo[this.data.tipClassIndex].classCode,
      kejieIndex:this.data.tipKejieIndex
    })
    //组装班级id和名称
    var classInfo = this.data.classInfo;
    // console.log(classInfo)
    // 设置班级
    var choiceClass = this.data.classInfo[this.data.tipClassIndex]
    this.setData({classStr:choiceClass.classCode + choiceClass.sClassTypeName})

    for(var i = 0 ; i < classInfo.length; i++){
      this.data.classes.push({id:i,value:classInfo[i].grade})
    }
    this.setData({classes: this.data.classes,})
    this.setData({classInn:this.data.classes[this.data.tipClassIndex].value})

    for(var j = 2; j <= classInfo[this.data.tipClassIndex].lessonNumber;j++){
      this.data.kejieArr.push({id: j, value: '第'+ j +'讲'})
    }
    // 删除‘请选择’项
    this.data.kejieArr.shift();
    this.setData({kejieArr: this.data.kejieArr,kejieInn:this.data.kejieArr[this.data.tipKejieIndex-2].value})

    // 设置显示基本信息还是期中期末
    // this.setData({typeInn: this.data.typeArr[this.data.kind-1].value})
    //判断是基本信息还是期中期末
    if(this.data.kind == 1){
      this.setData({
        baseShow: true,
        scoreShow: false
      })
    }else{
      this.setData({
        baseShow: false,
        scoreShow: true
      })
    }

    this.getTask();
    this.getEndTime();

    
    
    // this.getClassList();
    // 获取手机宽高
    var that = this;
    // 手机宽高
    wx.getSystemInfo({
      success: function(res) {
        that.setData({windowHeight: res.windowHeight})
        that.setData({windowWidth: res.windowWidth})
        that.setData({resultH: res.windowHeight - 90-52-32-109-30})
      }
    });
 
  },
  // 拼接时间
  getTime: function(){
    // 处理输入的时间
    var reg = /[\u4e00-\u9fa5]/
    var monthArr = this.data.month.split(reg);
    monthArr.pop()
    for(var i = 0 ; i < monthArr.length; i++){
      if(monthArr[i].length == 1 && monthArr[i] < 10){
        monthArr[i] = '0' +monthArr[i]
      }
    }
    var fullyear = new Date().getFullYear()
    var times = fullyear +'-'+monthArr.join('-') + ' ' + this.data.clock+':00';
    wx.setStorageSync('futureTime',times)
    this.setData({
      endTime:times
    })
    // console.log(this.data.endTime)
  },
  onShow:function(){
    // console.log(this.data.classes)
    this.setData({
      tipClassIndex: wx.getStorageSync('tipClassIndex'),
      tipKejieIndex: wx.getStorageSync('tipKejieIndex'),
    })
    if(this.data.tipClassIndex != 0){
      this.setData({
        classInn:this.data.classes[this.data.tipClassIndex].value,
        kejieInn:this.data.kejieArr[this.data.tipKejieIndex-2].value
      })
    }else{
      this.setData({
        kejieInn:this.data.kejieArr[this.data.tipKejieIndex-2].value
      })
    }
  },
  getMonth: function(e){
    // console.log(e)
    var reg = /^[0-9]{1,2}月[0-9]{1,2}日$/;
    if(!(reg.test(e.detail.value))){
      wx.showModal({
        title: '提示',
        content: '您输入的日期格式不正确，正确格式为：09月09日',
        showCancel: false
      })
      return;
    }
    this.setData({
      month: e.detail.value
    });
    this.getTime();
  },
  getClock: function(e){
    // console.log(e)
    this.setData({
      clock: e.detail.value
    });
    this.getTime();
  },
  // onHide:function(){
  //   wx.setStorageSync('tipKejieIndex',0)
  // },
   // 改变班级相关值
  getClass: function (e) {
    publicJs.getClass(e,this)
  },
  // 获取点击的弹窗的id和value值
  getIndex:function(e){
    // publicJs.getIndex(e,this,1,undefined,undefined,this.getStudentInfo)
    var inpStr = this.data.inpStr;
    if(inpStr == 'class'){  //班级
      // console.log(this.data.arr)
      this.setData({
        classInn:this.data.arr[e.target.dataset.id].value, 
        tipClassIndex:e.target.dataset.id, 
        show: false
      })
      this.setData({
        classCode:this.data.classInfo[this.data.tipClassIndex].classCode
      })

      // 重新渲染课节
      this.data.kejieArr = [];
      var lesson = this.data.classInfo[this.data.tipClassIndex].lessonNumber;
      for(var i = 2 ; i <= lesson; i++){
        this.data.kejieArr.push({id: i, value: '第'+i+'讲'});
      }
      this.setData({kejieArr: this.data.kejieArr,kejieInn:this.data.kejieArr[0].value});
      this.getTask();
      this.getEndTime();
      // 缓存选择的班级信息的编号
      wx.setStorageSync('tipClassIndex',this.data.tipClassIndex);
    }else if(inpStr == 'kejie'){  //课节
      this.setData({
        kejieInn:this.data.arr[e.target.dataset.id-2].value, 
        tipKejieIndex:e.target.dataset.id, 
        show: false
      })
      this.setData({
        kejieIndex:this.data.tipKejieIndex
      })
     // console.log(e.target.dataset.id)
     this.getTask();
     this.getEndTime();
      // 缓存选择的班级信息的编号
      wx.setStorageSync('tipKejieIndex',e.target.dataset.id);
    }
  },
   // 改变课节相关值
  getKejie: function (e) {
    publicJs.getKejie(e,this)
  },
  // 添加任务
  addTask:function(){
    if(this.data.taskArr.length >=7){
      wx.showModal({
        title: '提示',
        content: '最多建立7个任务卡',
        showCancel: false
      })
      return;
    }
    this.data.taskArr.push({
      id: this.data.taskArr.length,
      focus: true,
      task:'',
      isComplete:true
    })
    this.setData({taskArr: this.data.taskArr})
   
  },
  // 选择任务
  checkRadio:function(e){
    var id = e.currentTarget.dataset.id;
    var flag = e.currentTarget.dataset.complete;
    this.data.taskArr[id].isComplete = !flag;
    this.setData({taskArr:this.data.taskArr})
  },
  getInpVal:function(e){
    var id = Number(e.target.dataset.index);
    // console.log(e)
    this.data.taskArr[id].task = e.detail.value
    this.data.taskArr[id].focus = false;
    this.setData({taskArr: this.data.taskArr})
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
  // 获取班级列表
  getClassList: function(){
    var that = this;
    // 时间戳
    var stamp = new Date().getTime();
    // 学年
    var year = this.data.schoolYear;
    // 学期
    var nSemester = this.data.semesterIndex;
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
  // 获取任务卡
  getTask: function(){
    var that = this;
    var stamp = new Date().getTime();
    var token = this.data.teacherToken;
    // 班级编码
    var classCode = this.data.classInfo[this.data.tipClassIndex].classCode;
    // console.log(classCode)
    // var classCode = 'BJ17Q1502';
    // 课节号码
    var kejieIndex = this.data.tipKejieIndex;
    // var kejieIndex = 1;
    // console.log(classCode)
    // console.log(kejieIndex)
    // console.log(typeof kejieIndex)
    
    var query1 = 'appid=web&nLessonNo='+kejieIndex+'&sClassCode='+classCode+'&timestamp='+stamp+'&token='+token;
    var query2 = 'appid=web&nlessonno='+kejieIndex+'&sclasscode='+classCode+'&timestamp='+stamp+'&token='+token+'test';
    var sign = md51.md5(query2); 
    var query = query1 + '&sign=' + sign;

    wx.showLoading({
      title:'努力加载中...',
      success: function(){
        requestGet.requestGet('api/PunchTask?'+ query,function(res){
          // console.log(res.data.AppendData)
          if(res.data.ResultType == 0){
          var arr = res.data.AppendData;
          // 处理原始数据
          for(var i =0; i <arr.length; i++ ){
            var cur = arr[i];
            for(var k in cur.Tasks){
              if(cur.Tasks[k] == null){
                delete cur.Tasks[k]
              }
            }
          }
          // 处理任务数组
          var newArr = []
          for(var k in arr[0].Tasks){
            if(arr[0].Tasks[k] != ""){
              newArr.push(arr[0].Tasks[k])
            }
          }
          var newA = [];
          for(var i = 0 ; i < newArr.length; i++){
            // if(i == 0){
            //   var json = {id:i, focus:false, isComplete: true}
            // }else{
            //   var json = {id:i, focus:false, isComplete: false}
            // }
            var json = {id:i, focus:false, isComplete: true}
            json['task'] =  newArr[i]
            newA.push(json)
          }
          that.setData({taskArr:newA})

        }
          setTimeout(function(){
            wx.hideLoading()
          },500)
        })
      }
    })
  },
  // 储存任务卡
  postTask:function(e){
    var that = this;
    var token = this.data.teacherToken; // token值
    var stamp = new Date().getTime();  //时间戳
    // var endtime = month
    var studentSize = this.data.classInfo[this.data.tipClassIndex].studentNumber;
    var ClassCode = this.data.classInfo[this.data.tipClassIndex].classCode;
    var datas = e.detail.value;

    if(that.data.month == ''|| that.data.clock== ''){
       wx.showModal({
        title: '提示',
        content: '请设置截止时间',
        showCancel: false
      })
      return;
    }

    // 处理输入的时间
    // console.log( this.data.month)
    var reg = /[\u4e00-\u9fa5]/;
    var monthArr = this.data.month.split(reg);
    monthArr.pop();
    // console.log(monthArr)
    for(var i = 0 ; i < monthArr.length; i++){
      if(monthArr[i].length == 1 && monthArr[i] < 10){
        monthArr[i] = '0' +monthArr[i]
      }
    }
    var fullyear = new Date().getFullYear();
    var times = fullyear +'-'+monthArr.join('-') + ' ' + this.data.clock+':00'
    var arr = [];
    var arr1 = [];
    for(var k in datas){
     var str = k + '=' + datas[ k ]
      arr.push(str);
    }
    for(var i = 0 ; i < arr.length; i+=5){
      arr1.push({
        "sClassCode": arr[i].substr(arr[i].indexOf('=')+1),
        "nLessonNo": arr[i+1].substr(arr[i+1].indexOf('=')+1),
        "dtEndDate": arr[i+2].substr(arr[i+2].indexOf('=')+1),
        "sItemName": arr[i+3].substr(arr[i+3].indexOf('=')+1),
        "isComplete": arr[i+4].substr(arr[i+4].indexOf('=')+1),
      })
    }
    for(var i = 0 ; i < arr1.length; i++){
      if(arr1[i].isComplete == 'false' || arr1[i].sItemName == ""){
        arr1.splice(i,1)
      }
    }
    //至少布置一项任务才能保存跳转
    if(arr1.length == 0){
      wx.showModal({
        title: '提示',
        content: '请至少布置一项任务',
        showCancel: false
      })
      return;
    }

    // console.log(arr1);
    // console.log(that.data.taskArr)
    var strDatas = JSON.stringify(arr1);
    var query1 = 'appid=web&timestamp='+stamp+'&token='+token;
    var query2 = query1+'&'+strDatas+'test';
    var sign = md51.md5(query2);
    var query = query1 + '&sign=' + sign;

    wx.showLoading({
      title:'保存中',
      success: function(){
        requestPost.requestPost('api/PunchTask?'+ query,arr1,function(res){
          var resData = res.data;
          var resD = JSON.parse(res.data)
          // console.log(resD)
          if(resD.ResultType == 0){
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            });
            setTimeout(function(){
              wx.navigateTo({url:'/pages/taskProgress/taskProgress'})
            },500)
          }
          setTimeout(function(){
            wx.hideLoading()
          },500)

        })
      }
    })
  },
  // 获取截止时间
  getEndTime: function(){
    var that = this;
    var stamp = new Date().getTime();
    var token = this.data.teacherToken;
    // 班级编码
    var classCode = this.data.classInfo[this.data.tipClassIndex].classCode;
    // console.log(classCode)
    // var classCode = 'BJ17Q1502';
    // 课节号码
    var kejieIndex = this.data.tipKejieIndex;
    // var kejieIndex = 1;
    
    var query1 = 'appid=web&nLessonNo='+kejieIndex+'&sClassCode='+classCode+'&timestamp='+stamp+'&token='+token;
    var query2 = 'appid=web&nlessonno='+kejieIndex+'&sclasscode='+classCode+'&timestamp='+stamp+'&token='+token+'test';
    var sign = md51.md5(query2); 
    var query = query1 + '&sign=' + sign;
    wx.showLoading({
      title:'努力加载中...',
      success: function(){
        requestGet.requestGet('api/PunchEndDate?'+ query,function(res){
          // console.log(res)
          if(res.data.ResultType == 0){
            var arr = res.data.AppendData;
            var dates = arr.Date.substr(0,arr.Date.indexOf(' '));
            var times = arr.Time.substr(0,arr.Time.lastIndexOf(':'))

            var datesStr = '';

            var datesArr = dates.split('/');
            if(datesArr[1]<10){
              datesArr[1] = '0'+datesArr[1];
            }
            datesStr = datesArr[1]+'月'+datesArr[2]+'日'
            that.setData({
              month:datesStr,
              clock:times
            })
            that.getTime();
          }
          setTimeout(function(){
            wx.hideLoading()
          },500)
        })
      }
    })
  }
})
