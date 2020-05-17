<template>
  <div class="home">
    <button @click="btnClick">qingqiu</button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data() {
    return {
      msg: ''
    }
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
