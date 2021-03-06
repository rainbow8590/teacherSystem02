//index.js
var changeTabBar = require('../../utils/changeTabBar.js');
//获取应用实例
const app = getApp();

Page({
  data: {
    scorePicSrc:'../images/scorePic.png',
    postSrc:'../images/post.png',
    taskSrc:'../images/task.png',
    clockSrc:'../images/clock.png',
    tabBarArr:[
      {id:0,txt:'录入',iconSrc:'../images/write.gif',changeTextColor:'#525252',isChange: false},
      {id:1,txt:'查询',iconSrc:'../images/search.gif',changeTextColor:'#525252',isChange: false},
      {id:2,txt:'工具',iconSrc:'../images/setting1.gif',changeTextColor:'#1FBB1C',isChange: true},
    ],
  },
  scorePic: function(){
    wx.navigateTo({url:'/pages/scorePic/scorePic'})
  },
  post: function(){

  },
  task: function(){
    wx.navigateTo({url:'/pages/taskCard/taskCard'})
  },
  clock: function(){
    wx.navigateTo({url:'/pages/cardIndex/cardIndex'})
  },
  // 点击改变tabBar颜色
  changeColor: function(e){
    // console.log(e.currentTarget.dataset.id)
    var tabBarArr = this.data.tabBarArr;
    var datasetId = Number(e.currentTarget.dataset.id);
    changeTabBar.changeTabBar(datasetId,tabBarArr,this);
  }
})
