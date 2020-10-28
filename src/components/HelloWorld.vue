<template>
  <div>
    <el-row>
      <el-col :span="10">
        <el-input
          placeholder="Please input city"
          v-model="city"
          clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-button class="search" size="medium" type="primary" @click="search">Search</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: function() {
    return {
      city: ""
    }
  },
  methods: {
    search: function() {
      // navigation
      this.$router.push('/search/' + this.city);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-row {
  margin: 20px;
  display: flex !important;
  justify-content: center;
}
.search {
  width: inherit;
}
</style>
