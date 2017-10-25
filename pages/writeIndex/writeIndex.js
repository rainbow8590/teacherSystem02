//index.js
var changeTabBar = require('../../utils/changeTabBar.js');
//获取应用实例
const app = getApp();

Page({
  data: {
    schoolSrc:'../images/school.gif',
    scoreSrc:'../images/score.gif',
    tabBarArr:[
      {id:0,txt:'录入',iconSrc:'../images/write1.gif',changeTextColor:'#1FBB1C',isChange: true},
      {id:1,txt:'查询',iconSrc:'../images/search.gif',changeTextColor:'#525252',isChange: false},
      {id:2,txt:'工具',iconSrc:'../images/setting.gif',changeTextColor:'#525252',isChange: false},
    ],
  },
  goSchool: function(){
    wx.navigateTo({url: '/pages/schoolInfos/schoolInfos'})
  },
  goScore: function(){
    wx.navigateTo({url: '/pages/entranceDoor/entranceDoor'})
  },
  // 点击改变tabBar颜色
  changeColor: function(e){
    // console.log(e.currentTarget.dataset.id)
    var tabBarArr = this.data.tabBarArr;
    var datasetId = Number(e.currentTarget.dataset.id);
    changeTabBar.changeTabBar(datasetId,tabBarArr,this);
  }
})
