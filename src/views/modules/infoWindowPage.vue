<template>
  <div>
    <a-modal v-model:visible="visible" title="这是标题" @ok="onSubmit">
      <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
      >
        <a-form-item ref="name" label="名称" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="选项" name="region">
          <a-select v-model:value="formState.region" placeholder="请输入选项">
            <a-select-option value="第一项">第一项</a-select-option>
            <a-select-option value="第二项">第二项</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="开关" name="delivery">
          <a-switch v-model:checked="formState.delivery" />
        </a-form-item>
        <a-form-item label="多选" name="type">
          <a-checkbox-group v-model:value="formState.type">
            <a-checkbox value="1" name="type">选项一</a-checkbox>
            <a-checkbox value="2" name="type">选项二</a-checkbox>
            <a-checkbox value="3" name="type">选项三</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="单选" name="resource">
          <a-radio-group v-model:value="formState.resource">
            <a-radio value="1">单选一</a-radio>
            <a-radio value="2">单选二</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注" name="desc">
          <a-textarea v-model:value="formState.desc" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="onSubmit">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { defineComponent, ref,reactive,toRaw } from 'vue';
export default defineComponent({
  name:"infoWindowPage",
  setup(props,{emit}) {
    const visible = ref(false);
    const loading = ref(false);
    const formRef = ref();
    const formState = reactive({
      name: '',
      region: undefined,
      delivery: false,
      type: [],
      resource: '',
      desc: '',
    });
    const rules = {
      name: [
        {
          required: true,
          message: '请输入名称',
          trigger: 'blur',
        },
      ],
      region: [
        {
          required: true,
          message: '请选择下拉框',
          trigger: 'change',
        },
      ],
      type: [
        {
          type: 'array',
          required: true,
          message: '请选择多选',
          trigger: 'change',
        },
      ],
      resource: [
        {
          required: true,
          message: '请选择单选',
          trigger: 'change',
        },
      ],
      desc: [
        {
          required: true,
          message: '请输入备注',
          trigger: 'blur',
        },
      ],
    };

    const onSubmit = () => {
      loading.value = true;
      formRef.value
          .validate()
          .then(() => {
            console.log('values', formState, toRaw(formState));
            setTimeout(() => {
              loading.value = false;
              visible.value = false;
              emit('dataSubmit',{...toRaw(formState)})
              resetForm();
            }, 2000);
          })
          .catch(error => {
            console.log('error', error);
          });
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    const showModal = (data) => {
      visible.value = true;
      if(data){
        formState.name = data.name
        formState.region = data.region
        formState.delivery = data.delivery
        formState.type = data.type
        formState.resource = data.resource
        formState.desc = data.desc
        console.log('showModal',data);
      }

    };
    const handleCancel = () => {
      visible.value = false;
    };
    return {
      visible,
      loading,
      handleCancel,
      showModal,
      formRef,
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
      other: '',
      formState,
      rules,
      onSubmit,
      resetForm,
    };
  },
});
</script>

