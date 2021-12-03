<template>
  <div>
    <map-top
        :mouseTool="mouseTool"
        :province="province"
        :searchBox="searchBox"
        @getMouseToolType="getMouseToolType"
        @mouseToolRemove = "mouseToolRemove"
        @mouseToolStop = "mouseToolStop"
        @changeIcon = "changeIcon"
        @setProvinceChange = "setProvinceChange"
        @getSearchVal = "getSearchVal"
        @searchMaker = "searchMaker"
    ></map-top>
    <div id="container">

    </div>
    <info-window-page ref="infoWindowPage" @dataSubmit="setDate"></info-window-page>
    <infoWindowCard v-if="overlays.length" ref="infoWindowCard" @updateInfoWindow="updateInfoWindow" @deleteInfoWindow="deleteInfoWindow"></infoWindowCard>
  </div>
</template>

<script>

import { getCurrentInstance,toRaw} from 'vue'
import mapTop from "@/views/modules/mapTop";
import {mapMixins} from "@/mixins/map"
import infoWindowPage from "@/views/modules/infoWindowPage";
import infoWindowCard from "@/views/modules/infoWindowCard";
export default {
  name: "index",
  mixins:[mapMixins],
  components:{
    mapTop,
    infoWindowPage,
    infoWindowCard
  },
  data(){
    return{
      map:{},
      // // 搜索
      // search:{
      //   list:[],
      //   pageSize:10,
      //   pageIndex:1
      // }
    }
  },
  setup(){
    const { appContext : { config: { globalProperties } } } = getCurrentInstance()
    console.log(globalProperties.$AMap);
    let AMap = globalProperties.$AMap;
    return {
      AMap,
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.map = new this.AMap.Map('container',{
        center: [116.33719, 39.942384],
        zoom: 6,
        // mapStyle: 'amap://styles/7a5245031759ff486c7570d6bc374ef3'
      });
      console.log('mounted',this.AMap,this.map);
      // 加载鹰眼控件
      var hawkEye = new this.AMap.HawkEye({
        showRectangle:true,
        autoMove:true,
      });
      this.map.addControl(hawkEye);
      this.mouseTool.type = '';
      this.mouseTool.mouseToolDraw = new this.AMap.MouseTool(this.map);
      this.mouseTool.mouseToolDraw.on('draw',(e)=>{
        console.log(e);
        // 关闭鼠标事件
        this.mouseToolStop();
        this.$refs.infoWindowPage.showModal();
        // e.obj.emit('click', {target: e.obj});
        this.$nextTick(()=>{
          console.log(11111111)
          this.overlays.push(e.obj);
          console.log(this.overlays,this.overlays[0])
        })
      })
      // 获取行政区查询服务
      this.DistrictSearch = new this.AMap.DistrictSearch({
        extensions:'all',
        subdistrict:3,
      })
      this.setProvince();
      // 获取当前省区
      this.myProvince = new this.AMap.CitySearch();
      // this.showCityInfo();

      // 查询
//构造地点查询类
      this.placeSearch = new this.AMap.PlaceSearch({
        pageSize: 10, // 单页显示结果条数
        pageIndex: 1, // 页码
        city: this.province.label, // 兴趣点城市
        citylimit: true,  //是否强制限制在设置的城市内搜索
      });
    })
  },
  methods:{
    // 获取弹窗数据
    setDate(data){
      console.log(22222222)
      let obj = this.overlays[this.overlays.length - 1];
      obj.data = data;
      console.log(obj,this.overlays)
      this.saveInfoWindow(obj);
    },
    // 绑定窗口
    saveInfoWindow(obj){
      let content = this.$refs.infoWindowCard.$el
      this.infoWindow = new this.AMap.InfoWindow({
        isCustom: true,
        content: content,//this.createInfoWindow(content),  //使用默认信息窗体框样式，显示信息内容
        offset: new this.AMap.Pixel(0, -45)
      });
      this.infoWindow.obj=obj
      this.$refs.infoWindowCard.initialize({
        overlay: '',
        data:obj.data,
        infoWindow: this.infoWindow
      });
      console.log(this.infoWindow,toRaw(this.infoWindow))
      switch (obj.className) {
        case 'AMap.Marker':
          obj.setIcon(this.AMapIcon);
          obj.content = content;//this.createInfoWindow(content);
          this.infoWindow.open(this.map, obj.getPosition());
          obj.on('click', (even)=>{
            this.infoWindow.setContent(even.target.content);
            this.infoWindow.open(this.map, even.target.getPosition());
            this.infoWindow.obj=even.target
            this.$refs.infoWindowCard.initialize({
              overlay: '',
              data:even.target.data,
              infoWindow: this.infoWindow
            });
          });
          break;
        case 'Overlay.Polyline':
          this.infoWindow.open(this.map, obj.getPath()[0]);
          this.setPolyline(obj,obj.getPath()[0],content)
          break
        case 'Overlay.Polygon':
          this.infoWindow.open(this.map, obj.getBounds().getCenter());
          this.setPolyline(obj,obj.getBounds().getCenter(),content);
          break;
        case 'Overlay.Rectangle':
          this.infoWindow.open(this.map, obj.getCenter());
          this.setPolyline(obj,obj.getCenter(),content);
          break;
        case 'Overlay.Circle':
          this.infoWindow.open(this.map, obj.getCenter());
          this.setPolyline(obj,obj.getCenter(),content);
          break;
      }
      // this.map.setFitView();
    },
    // 设置为折线，多边形  矩形，圆，添加点
    setPolyline(obj,center,content){
      var marker = new this.AMap.Marker({
        position:center,
        icon: this.AMapIcon?this.AMapIcon:"",
        offset: new this.AMap.Pixel(-13, -30)
      });
      this.map.add(marker);
      obj.marker = marker
      marker.content = content;//this.createInfoWindow(content);
      marker.on('click', (even)=>{
        this.infoWindow.setContent(even.target.content);
        this.infoWindow.open(this.map, center);
        this.infoWindow.obj=obj
        this.$refs.infoWindowCard.initialize({
          overlay: '',
          data:obj.data,
          infoWindow: this.infoWindow
        });
      });
    },
    // 更新窗口
    updateInfoWindow(data){
      console.log('这是更新',111112313213,data);
      this.$refs.infoWindowPage.showModal(data);
    },
    // 删除覆盖物与点
    deleteInfoWindow() {
      let windowObj =  this.infoWindow.obj
      if(windowObj.className == 'AMap.Marker'){
        this.map.remove(windowObj)
      }else{
        this.map.remove(windowObj.marker)
        this.map.remove(windowObj)
      }
      this.infoWindow.close();
      this.overlays.forEach((item,index)=>{
          if(item._amap_id == windowObj._amap_id){
            this.overlays.splice(index,1)
          }
      })
      console.log(this.overlays)
      console.log('这是删除',111112313213,windowObj)
    },
    //获取搜索关键词
    getSearchVal(val){
      console.log(val)
      this.placeSearch.search(val,(status, result)=> {
          console.log(status,result);
          if(result.info == 'OK'){
              this.searchBox.list = result.poiList.pois;
            this.searchBox.pageIndex = result.poiList.pageIndex
            this.searchBox.pageSize = result.poiList.pageSize
          }
      })
    },
    searchMaker(location){
      console.log(location)
      var marker = new this.AMap.Marker({
        position:location,
        icon: this.AMapIcon?this.AMapIcon:"",
        offset: new this.AMap.Pixel(-13, -30)
      });
      this.map.add(marker);
      this.$refs.infoWindowPage.showModal();
      // e.obj.emit('click', {target: e.obj});
      this.$nextTick(()=>{
        this.overlays.push(marker);
      })

    }
  }
}
</script>

<style scoped lang="scss">
#container{
  height: calc(100vh - 150px);
  ::v-deep .content-window-card{
    width: 150px;
    .foot{
      display: flex;
      justify-content: space-between;
      align-items: center;
      button{
        color: #0b0b87;
      }
    }

  }
}
</style>
