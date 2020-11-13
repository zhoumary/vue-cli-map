<template>
    <el-dialog
      :id="dialogKey"
      :title="title"
      width="95%"
      @close="closeDialog"
      center>
    </el-dialog>
</template>

<script>
export default {
  name: 'FullScreenDialog',
  props: {
    title: String,
    dialogKey: String
  },
  methods: {
    closeDialog: function () {
      this.$emit('closedialog')
    }
  }
}
</script>

<style scoped>
.el-dialog__wrapper {
  position: fixed;
  padding-top: 4.5%;
  background-color: rgb(53 49 49 / 30%);
  z-index: 999;
}
.el-dialog__wrapper.el-dialog--center {
  margin-top: 0px !important;
}
#container {
  width: 98%;
  margin: 25px;
}
#panel {
  float: right;
  position: relative;
  background-color: white;
  max-height: 66%;
  overflow-y: auto;
  right: 10px;
  width: 280px;
  z-index: 1;
}
#panel .amap-call {
  background-color: #009cf9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
#panel .amap-lib-driving {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
}
</style>
