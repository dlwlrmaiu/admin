<template>
  <div class="home">
  </div>
</template>

<script>
// @ is an alias to /src
import { fetchList } from '@/api/table'

export default {
  name: 'Home',
  data() {
    return {
      msg: ''
    }
  },
  methods:{
    async request() {
      const res = await fetchList()
      this.msg = res.data.msg
    }
  }
}
</script>

<style lang="less" scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
