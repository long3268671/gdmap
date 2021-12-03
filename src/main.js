import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import AMapLoader from '@amap/amap-jsapi-loader';
const app = createApp(App);
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
    "plugins": ['AMap.CitySearch','AMap.Geolocation','AMap.ToolBar','AMap.Scale','AMap.HawkEye','AMap.MouseTool','AMap.DistrictSearch','AMap.PlaceSearch'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    "AMapUI": {             // 是否加载 AMapUI，缺省不加载
        "version": '1.1',   // AMapUI 缺省 1.1
        "plugins":[],       // 需要加载的 AMapUI ui插件
    },
    "Loca":{                // 是否加载 Loca， 缺省不加载
        "version": '2.0'  // Loca 版本，缺省 1.3.2
    },
}).then((AMap)=>{
    console.log('AMap',AMap)
    app.config.globalProperties.$AMap = AMap;
    app.use(store).use(router).use(Antd).mount("#app");
})
