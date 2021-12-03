export const mapMixins = {
    data(){
        return {
            mouseTool:{
                type:'',
                mouseToolDraw:null
            },
            DistrictSearch:{},  // 行政区查询服务
            myProvince:{},  // 我所在的省份
            overlays:[],
            icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png',
            province:{ value: 130000, label: "河北省" },  // 当前省区
            //省区经度
            lng:{
                max:'',
                min:''
            },
            //省区纬度
            lat:{
                max:'',
                min:''
            },
            // 当前图层的覆盖物
            polygon:{},
            // 信息弹窗
            infoWindow:{},
            //地点查询类
            placeSearch:{},
            // 搜索
            searchBox:{
                list:[],
                pageSize:10,
                pageIndex:1
            }
        }

    },
    computed:{
        AMapIcon(){
            let Icon = new this.AMap.Icon({
                size: new this.AMap.Size(25, 34),
                image: this.icon,
                imageSize: new this.AMap.Size(25, 34),
                imageOffset: new this.AMap.Pixel(0,0)
            });
            return Icon
        }
    },
    created() {
    },
    methods:{
        // 鼠标划线类型回调
        getMouseToolType(type){
            this.mouseTool.type = type;
            console.log('mouseTool.type',this.mouseTool.type);
            this.draw(type)
        },
        // 鼠标根据类型画线
        draw(type){
            let _this = this
            switch(type){
                case 'marker':{
                    let obj = {
                        icon: _this.AMapIcon?_this.AMapIcon:"",
                        offset: new _this.AMap.Pixel(-13, -30)
                    }
                    this.mouseTool.mouseToolDraw.marker({
                        //同Marker的Option设置
                        ...obj
                    });
                    break;
                }
                case 'polyline':{
                    this.mouseTool.mouseToolDraw.polyline({
                        strokeColor:'#80d8ff'
                        //同Polyline的Option设置
                    });
                    break;
                }
                case 'polygon':{
                    this.mouseTool.mouseToolDraw.polygon({
                        fillColor:'#00b0ff',
                        strokeColor:'#80d8ff'
                        //同Polygon的Option设置
                    });
                    break;
                }
                case 'rectangle':{
                    this.mouseTool.mouseToolDraw.rectangle({
                        fillColor:'#00b0ff',
                        strokeColor:'#80d8ff'
                        //同Polygon的Option设置
                    });
                    break;
                }
                case 'circle':{
                    this.mouseTool.mouseToolDraw.circle({
                        fillColor:'#00b0ff',
                        strokeColor:'#80d8ff'
                        //同Circle的Option设置
                    });
                    break;
                }
            }
        },
        // 清楚覆盖物
        mouseToolRemove(){
            this.map.remove(this.overlays)
            this.overlays = [];
        },
        // 停止画线
        mouseToolStop(){
            this.mouseTool.mouseToolDraw.close();
            this.mouseTool.type = '';
        },
        // 自定义画点样式
        changeIcon(icon){
            console.log(icon)
            this.icon = icon;
        },

        // 行政区查询服务
        setProvince(){
            this.DistrictSearch.search(this.province.label,(status,result)=>{
                console.log(111111111222222222,status,result,this)
                var holes = result.districtList[0].boundaries;
                // 获取省区最大最小坐标
                this.getImgSize(holes);
                // 往省区上添加图片
                this.putImg();

                // 外多边形坐标数组和内多边形坐标数组
                var outer = [
                    new this.AMap.LngLat(-360,90,true),
                    new this.AMap.LngLat(-360,-90,true),
                    new this.AMap.LngLat(360,-90,true),
                    new this.AMap.LngLat(360,90,true),
                ];
                var pathArray = [
                    outer
                ];
                pathArray.push.apply(pathArray,holes)
                console.log(pathArray)
                if(this.polygon){
                    this.map.remove(this.polygon)
                }
                this.polygon = new this.AMap.Polygon( {
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
                this.polygon.setPath(pathArray);
                this.map.add(this.polygon);
                this.$nextTick(()=>{
                    this.map.setCity(this.province.label);
                    // console.log(this.polygon.getBounds().getCenter().toString())
                    // this.map.setCenter(this.polygon.getBounds().getCenter())
                })


            })
        },
        // 获取省区的最大经纬度 与最小经纬度
        getImgSize(boundaries){
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
            this.lng.max = lngMaxNum;
            this.lng.min = lngMinNum;
            this.lat.max = latMaxNum;
            this.lat.min = latMinNum
        },
        // 往省区添加覆盖物图片
        putImg(){
            var mybounds = new this.AMap.Bounds([this.lng.min, this.lat.min], [this.lng.max, this.lat.max]);
            this.map.setBounds(mybounds);
            // var bounds = this.map.getBounds();
            // this.map.setLimitBounds(bounds);
            // 覆盖图片
            var imageLayer = new this.AMap.ImageLayer({
              url: 'img/1111.2decab4a.png',
              bounds: new this.AMap.Bounds(
                  [this.lng.min, this.lat.min],
                  [this.lng.max, this.lat.max]
              ),
              zooms: [3, 18]
            });
            console.log(imageLayer)
            this.map.setLayers([...this.map.getLayers(),imageLayer])
        },

        // 获取当前省市
        showCityInfo() {
            //实例化城市查询类
            //自动获取用户IP，返回当前城市
            this.myProvince.getLocalCity((status, result)=>{
                if (status === 'complete' && result.info === 'OK') {
                    console.log(result)
                    if (result && result.city && result.bounds) {
                        var cityinfo = result.city;
                        var citybounds = result.bounds;
                        console.log('当前地理位置'+cityinfo)
                        console.log(cityinfo,citybounds)
                        //地图显示当前城市
                        // this.map.setBounds(citybounds);
                    }
                }
            });
        },

        // 设置显示省区
        setProvinceChange(value){
            console.log(value)
            this.province = value;
            this.setProvince()
        },


    }
}
