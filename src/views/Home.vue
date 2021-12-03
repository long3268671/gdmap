<template>
  <div class="home">
    <div id="info"></div>
    <div class='info'>操作说明：圆和矩形通过拖拽来绘制，其他覆盖物通过点击来绘制</div>
    <div>
      <div class="input-card" style='width: 24rem;'>
        <div class="input-item">
          <input type="radio" name='func' checked="" value='marker' ><span class="input-text">画点</span>
          <input type="radio" name='func' value='polyline'><span class="input-text">画折线</span>
          <input type="radio" name='func' value='polygon'><span class="input-text" style='width:5rem;'>画多边形</span>
        </div>
        <div class="input-item">
          <input type="radio" name='func' value='rectangle'><span class="input-text">画矩形</span>
          <input type="radio" name='func' value='circle'><span class="input-text">画圆</span>
        </div>
        <div class="input-item">
          <input id="clear" type="button" class="btn" @click="mouseToolClear" value="清除" />
          <input id="close" type="button" class="btn" @click="mouseToolClose" value="关闭绘图" />
        </div>
      </div>
      <div class="input-card" style='width: 24rem;'>
        <span class="input-text">自定义样式图标</span>
        <select v-model="icon" @change="iconChange">
          <option value="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">样式一</option>
          <option value="https://a.amap.com/jsapi_demos/static/resource/img/tingzi.png">样式二</option>
          <option value="https://a.amap.com/jsapi_demos/static/resource/img/men3.png">样式三</option>
        </select>
      </div>
    </div>
    <div id="container">

    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
export default {
  name: "Home",
  data(){
    return {
      map:{}, // 地图
      citysearch:{},  // 城市信息
      mouseTool:{},   //鼠标工具
      overlays:[],   // 覆盖物列表
      radios:[],  // 鼠标事件烈性
      AMap:{},
      infoWindow:{},  // 弹窗
      icon:"//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png",   //自定义点样式图标
    }
  },
  computed: {
    AMapIcon(){
      if(this.AMap == {}){
          return  false
      }
      let Icon = new this.AMap.Icon({
        size: new this.AMap.Size(25, 34),
        image: this.icon,
        imageSize: new this.AMap.Size(25, 34),
        imageOffset: new this.AMap.Pixel(0,0)
      });
      return Icon
    }
  },
  mounted() {
    AMapLoader.load({
      "key": "23dc958abf3ac81cefedddb2e125ae96",              // 申请好的Web端开发者Key，首次调用 load 时必填
      "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      /**
       * @CitySearch 获取当前城市信息
       * @Geolocation 定位按钮
       * @ToolBar 缩放工具条
       * @Scale 比例尺
       * @HawkEye 鹰眼
       * @MouseTool 鼠标测绘工具
       * **/
      "plugins": ['AMap.CitySearch','AMap.Geolocation','AMap.ToolBar','AMap.Scale','AMap.HawkEye','AMap.MouseTool','AMap.DistrictSearch'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      "AMapUI": {             // 是否加载 AMapUI，缺省不加载
        "version": '1.1',   // AMapUI 缺省 1.1
        "plugins":[],       // 需要加载的 AMapUI ui插件
      },
      "Loca":{                // 是否加载 Loca， 缺省不加载
        "version": '2.0'  // Loca 版本，缺省 1.3.2
      },
    }).then((AMap)=>{
      this.AMap = AMap;
      this.map = new AMap.Map('container',{
        center: [116.33719, 39.942384],
        zoom: 6,
        // mapStyle: 'amap://styles/7a5245031759ff486c7570d6bc374ef3'
      });
      this.lockMapBounds();

      // 加载鼠标事件
      this.mouseTool = new AMap.MouseTool(this.map);
      this.mouseToolDraw();
      // 获取城市信息
      // this.citysearch = new AMap.CitySearch();
      // this.showCityInfo();
      let _this = this;
      new AMap.DistrictSearch({
        extensions:'all',
        subdistrict:3,
        //更改河南省为自己想要的
      }).search('河北省',function(status,result){
        console.log(status,result,_this)
        // 外多边形坐标数组和内多边形坐标数组
        var outer = [
          new AMap.LngLat(-360,90,true),
          new AMap.LngLat(-360,-90,true),
          new AMap.LngLat(360,-90,true),
          new AMap.LngLat(360,90,true),
        ];
        var holes = result.districtList[0].boundaries;



        // 获取省区最大最小坐标
        _this.getImgSize(holes).then(({lngMaxNum,lngMinNum,latMaxNum,latMinNum})=>{
          //设置
          var mybounds = new AMap.Bounds([lngMinNum, latMinNum], [lngMaxNum, latMaxNum]);
          _this.map.setBounds(mybounds);
          var bounds = _this.map.getBounds();
          _this.map.setLimitBounds(bounds);
          // 覆盖图片
          console.log(lngMaxNum,lngMinNum,latMaxNum,latMinNum)
          // var imageLayer = new AMap.ImageLayer({
          //   url: 'img/1111.2decab4a.png',
          //   bounds: new AMap.Bounds(
          //       [lngMinNum, latMinNum],
          //       [lngMaxNum, latMaxNum]
          //       // [116.327911, 39.939229],
          //       // [116.342659, 39.946275]
          //   ),
          //   zooms: [3, 18]
          // });
          // console.log(imageLayer)
          // _this.map.setLayers([..._this.map.getLayers(),imageLayer])
        })
        var pathArray = [
          outer
        ];
        pathArray.push.apply(pathArray,holes)
        console.log(pathArray)
        var polygon = new AMap.Polygon( {
          pathL:pathArray,
          //线条颜色，使用16进制颜色代码赋值。默认值为#006600
          strokeColor: 'rgb(20,164,173)',
          strokeWeight: 4,
          //轮廓线透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
          strokeOpacity:0.5,
          //多边形填充颜色，使用16进制颜色代码赋值，如：#FFAA00
          fillColor: 'rgb(63,63,63)',
          //多边形填充透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
          fillOpacity: 1,
          //轮廓线样式，实线:solid，虚线:dashed
          strokeStyle:'dashed',
          /*勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效， 此属性在
                       ie9+浏览器有效 取值：
                       实线：[0,0,0]
                       虚线：[10,10] ，[10,10] 表示10个像素的实线和10个像素的空白（如此反复）组成的虚线
                       点画线：[10,2,10]， [10,2,10] 表示10个像素的实线和2个像素的空白 + 10个像素的实
                       线和10个像素的空白 （如此反复）组成的虚线*/
          strokeDasharray:[10,2,10]
        });
        polygon.setPath(pathArray);
        _this.map.add(polygon);
      })

      // //缩放工具条
      // var toolbar = new AMap.ToolBar();
      // this.map.addControl(toolbar);
      //定位按钮
      var geolocation = new AMap.Geolocation();
      this.map.addControl(geolocation);
      // //比例尺
      // var scale = new AMap.Scale();
      // this.map.addControl(scale);
      //鹰眼
      var hawkEye = new AMap.HawkEye({
        visible: true,
        showRectangle:true,
        autoMove:true,
      });
      this.map.addControl(hawkEye);
    }).catch(e => {
      console.log(e);
    })
  },
  methods:{
    iconChange(){
      // this.mouseTool.marker.setIcon(this.AMapIcon)
    },
    showCityInfo() {
      let _this = this
      //实例化城市查询类
      //自动获取用户IP，返回当前城市
      this.citysearch.getLocalCity(function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.city && result.bounds) {
            var cityinfo = result.city;
            var citybounds = result.bounds;
            document.getElementById('info').innerHTML = '当前地理位置'+cityinfo;
            console.log(cityinfo,citybounds)
            //地图显示当前城市
            _this.map.setBounds(citybounds);
          }
        } else {
          document.getElementById('info').innerHTML = result.info;
        }
      });
    },
    mouseToolDraw(){
      let _this = this;
      _this.infoWindowBox()

      _this.mouseTool.on('draw',function(e){
        console.log(e)
        _this.mouseTool.close()
        _this.infoWindow.open(_this.map, e.obj.getPosition());
        if(e.type == 'draw'){
          e.obj.setIcon(_this.AMapIcon)
        }
        e.obj.on('click', function () {
          _this.infoWindow.open(_this.map, e.obj.getPosition());
        });
        _this.overlays.push(e.obj);
      })
      this.radios = document.getElementsByName('func');
      for(var i=0;i<this.radios.length;i+=1){
        _this.radios[i].onchange = function(e){
          _this.draw1(e.target.value)
        }
      }
      console.log(222222)
      this.draw1('marker')
    },
    draw1(type){
      console.log(44444444,type)
      switch(type){
        case 'marker':{
          console.log(3333333)
          let _this = this;
          console.log(this.icon)
          // 创建一个 Icon
          this.mouseTool.marker({
            //同Marker的Option设置
            icon: _this.AMapIcon,
            offset: new _this.AMap.Pixel(-13, -30)
          });

          break;
        }
        case 'polyline':{
          this.mouseTool.polyline({
            strokeColor:'#80d8ff'
            //同Polyline的Option设置
          });
          break;
        }
        case 'polygon':{
          this.mouseTool.polygon({
            fillColor:'#00b0ff',
            strokeColor:'#80d8ff'
            //同Polygon的Option设置
          });
          break;
        }
        case 'rectangle':{
          this.mouseTool.rectangle({
            fillColor:'#00b0ff',
            strokeColor:'#80d8ff'
            //同Polygon的Option设置
          });
          break;
        }
        case 'circle':{
          this.mouseTool.circle({
            fillColor:'#00b0ff',
            strokeColor:'#80d8ff'
            //同Circle的Option设置
          });
          break;
        }
      }
    },
    mouseToolClose(){
      this.mouseTool.close(true)//关闭，并清除覆盖物
      for(var i=0;i<this.radios.length;i+=1){
        this.radios[i].checked = false;
      }
    },
    mouseToolClear(){
      this.map.remove(this.overlays)
      this.overlays = [];
    },
    getImgSize(boundaries){
      console.log(boundaries)
      return new Promise((resolve) => {
        let lngMax = [];
        let lngMin = [];
        var latMax = [];
        var latMin = [];
        boundaries.forEach(item=>{
          var maxNumlng = Math.max.apply(Math, item.map(function(o) {return o.lng}))
          var minNumlng = Math.min.apply(Math, item.map(function(o) {return o.lng}))
          lngMax.push(maxNumlng)
          lngMin.push(minNumlng)
          var latMaxlat = Math.max.apply(Math, item.map(function(o) {return o.lat}))
          var latMinlat = Math.min.apply(Math, item.map(function(o) {return o.lat}))
          latMax.push(latMaxlat)
          latMin.push(latMinlat)
        })
        let lngMaxNum = Math.max.apply(null,lngMax);
        let lngMinNum = Math.min.apply(null,lngMin);
        let latMaxNum = Math.max.apply(null,latMax)
        let latMinNum = Math.min.apply(null,latMin)
        console.log(lngMaxNum,lngMinNum,latMaxNum,latMinNum);
        resolve({lngMaxNum,lngMinNum,latMaxNum,latMinNum})
      })
    },
    //限制地图显示范围
    lockMapBounds() {
      var bounds = this.map.getBounds();
      console.log(bounds)
      this.map.setLimitBounds(bounds);
   },
    infoWindowBox(){
      var title = '编辑信息',
          content = `<div class="content">
    <div class="info">
    <p>标题</p><input />
</div>
<div class="info">
    <p>说明</p><input />
</div>
<div class="info">
    <p>上传</p><input type="file"/>
</div>
</div>`;
      this.infoWindow = new this.AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: this.createInfoWindow(title, content),
        offset: new this.AMap.Pixel(16, -45)
      });
    },
//构建自定义信息窗体
   createInfoWindow(title, content) {
     var info = document.createElement("div");
     info.className = "content-window-card";
     //可以通过下面的方式修改自定义窗体的宽高
     info.style.width = "400px";
     // 定义顶部标题
     var top = document.createElement("div");
     var titleD = document.createElement("div");
     var closeX = document.createElement("img");
     top.className = "info-top";
     titleD.innerHTML = title;
     closeX.src = "https://webapi.amap.com/images/close2.gif";
     closeX.onclick = this.closeInfoWindow;

     top.appendChild(titleD);
     top.appendChild(closeX);
     info.appendChild(top);

     // 定义中部内容
     var middle = document.createElement("div");
     middle.className = "info-middle";
     middle.style.backgroundColor = 'white';
     middle.innerHTML = content;
     info.appendChild(middle);

     // 定义底部内容
     var foot = document.createElement("div");
     var button = document.createElement("button");
     foot.className = "foot";
     button.innerText="确定"
     foot.append(button)
     button.onclick = this.closeInfoWindow;
     info.appendChild(foot);
     return info;
    },
    closeInfoWindow() {
      this.map.clearInfoWindow();
    }
  }
}
</script>
<style lang="scss" scoped>
#container{
  height: 400px;
  ::v-deep .content-window-card{
    width: 400px;
    background-color: #fff;
    padding: 15px;
    .info-top{
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
    }
    .info{
      display: flex;
      margin: 15px 0;
      p{
        width: 90px;
        margin: 0;
      }
      input{
        flex: 1;
        padding: 5px 0;
        border: 1px solid #ccc;
      }
    }
  }
}
.input-item{
  height: 2.2rem;
}
.btn{
  width: 6rem;
  margin: 0 1rem 0 2rem;
}
.input-text{
  width: 4rem;
  margin-right:1rem;
}

</style>
