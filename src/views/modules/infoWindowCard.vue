<template>
  <div>
    <a-card class="box-card" style="padding: 15px;width: 400px;border-radius: 10px;">
      <div id="del-div">
        <a @click="close()">关闭</a>
<!--        <CloseCircleOutlined @click="close()"></CloseCircleOutlined>-->
      </div>
      <div style="text-align: center;">
        <h4>详 情</h4>
      </div>
      <p>{{ data.name?data.name:'' }}</p>
     <p>姓名:{{data.name}}</p>
     <p>选项:{{data.region}}</p>
      <p>开关:{{data.delivery}}</p>
      <p>多选:{{data.type}}</p>
      <p>单选:{{data.resource}}</p>
     <p>备注:{{data.desc}}</p>
      <p v-if="!isInfo" style="text-align: center;color: #b3b3b3;">暂无信息</p>
      <div id="infoWindowTool">
        <a-button type="primary" @click="edit()">编辑</a-button>
        <a-button type="primary" @click="del()">删除</a-button>
      </div>
    </a-card>
    <div class="amap-info-sharp">
<!--      <i class="el-icon-caret-bottom"></i>-->
    </div>

  </div>
</template>
<script>
// import {
//   CloseCircleOutlined
// } from '@ant-design/icons-vue';
export default {
  components: {
    // CloseCircleOutlined
  },
  data() {
    return {
      visible:false,
      overlay: null,
      infoWindow: null,
      isInfo: true,
      data:{
        name:''
      }
    };
  },
  mounted() {},
  methods: {
    initialize(e) {
      this.overlay = e.overlay;
      this.infoWindow = e.infoWindow;
      this.data = e.data;
    },
    //关闭
    close() {
      this.infoWindow.close();
    },
    edit() {
      this.$emit('updateInfoWindow',this.data)
      console.log("编辑按钮测试");
    },
    del() {
      this.$emit('deleteInfoWindow')
      console.log("删除按钮测试");
    }
  }
};
</script>

<style lang="scss" scoped>
.amap-info-sharp {
  bottom: -1px;
  left: 48.5%;
  position: absolute;
  color: #fff;
  z-index: -1;
}
#del-div {
  position: absolute;
  right: 20px;
  top: 20px;
  transform: scale(1.2);
}
</style>
