<template>
    <div class="fullLoading">Loading...</div>
</template>

<script>
export default {
  name: 'FullLoading'
}
</script>

<style scoped>
.fullLoading {
  position: fixed;
  width: 100%;
  background-color: rgb(53 49 49 / 30%);
  z-index: 1000;
  text-align: center;
  color: #e0e3e8;
  font-size: xxx-large;
  font-weight: 800;
  font-style: oblique;
  letter-spacing: 4px;
  bottom: 0;
  left: 0;
}
</style>
