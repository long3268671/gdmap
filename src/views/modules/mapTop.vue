<template>
  <div class="info">
    <p>操作说明：圆和矩形通过拖拽来绘制，其他覆盖物通过点击来绘制，折线，多边形，双击结束绘制</p>
    <div class="fixed">
      <div class="buttonBox">
        <p>鼠标操作</p>
        <a-button  v-for="item in mouseToolList" :key="item.value" @click="changeMouseToolType(item.value)" :type="mouseTool.type==item.value?'primary':''" :value="item.value">{{ item.name }}</a-button>
         <div>
           <a-button @click="mouseToolRemove">清除</a-button>
           <a-button @click="mouseToolStop">停止绘图</a-button>
         </div>
      </div>
      <div >
        <p>锚点自定义样式</p>
        <a-select :value="icon" style="width: 150px" @change="iconChange">
          <a-select-option value="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png" selected>样式一</a-select-option>
          <a-select-option value="https://a.amap.com/jsapi_demos/static/resource/img/tingzi.png">样式二</a-select-option>
          <a-select-option value="https://a.amap.com/jsapi_demos/static/resource/img/men3.png">样式三</a-select-option>
        </a-select>
      </div>
      <div>
        <p>选择省区</p>
        <a-select :value="provinceVal" style="width: 150px" label-in-value @change="handleProvinceChange">
          <a-select-option v-for="item in adcodes" :key="item.adcode" :value="item.adcode" >{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div>
        <p>关键字查询</p>
        <a-input-search
            v-model:value="search"
            placeholder="请输入关键字"
            size="large"
            @search="onSearch"
        >
          <template #enterButton>
            <a-button>搜索</a-button>
          </template>
        </a-input-search>
        <div>
          <ul>
            <li v-for="item in searchBox.list" :key="item.id">
              地址：{{ item.address }} 名称:{{item.name}} 类型：{{ item.type }};
              位置：{{item.location.lng}}{{ item.location.lat }}
              <a-button @click="showMaker(item.location)">标记</a-button>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { adcodes } from './adcodes'
import { defineComponent,ref  } from 'vue'
export default defineComponent({
  name: "mapTop",
  props:['mouseTool','province','searchBox'],
  data(){
    return {
      mouseToolList:[
        {
          name:'画点',
          value:'marker'
        },
        {
          name:'画折现',
          value:'polyline'
        },
        {
          name:'画多边形',
          value:'polygon'
        },
        {
          name:'画矩形',
          value:'rectangle'
        },
        {
          name:'画圆',
          value:'circle'
        }
      ],
      icon:"//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png",   //自定义点样式图标
      adcodes:adcodes,
      provinceVal:this.province,
    }
  },
  setup(props,{emit}){
    console.log(1111111);
    let search = ref('')
    let changeMouseToolType = (type)=>{
      emit('getMouseToolType',type)
    }
    let mouseToolRemove = ()=>{
      emit('mouseToolRemove')
    }
    let mouseToolStop = ()=>{
      emit('mouseToolStop')
    }
    let iconChange = (value)=>{
      emit('changeIcon',value)
    }
    let onSearch=(searchValue)=>{
      emit('getSearchVal',searchValue)
    }
    let showMaker = (location)=>{
      emit('searchMaker',location)
    }
    return {
      changeMouseToolType,
      mouseToolRemove,
      mouseToolStop,
      iconChange,
      search,
      onSearch,
      showMaker,
    }
  },
  methods:{
    handleProvinceChange(value){
      console.log(value)
      this.provinceVal ={
        label:value.label.children,
        value:value.value
      };
      this.$emit('setProvinceChange',this.provinceVal)
    }
  }
})
</script>

<style scoped lang="scss">
.fixed{
  display: flex;
  >div{
    margin-right: 20px;
  }
}
</style>
