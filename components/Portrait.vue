<template>
  <div id="portrait">
    <div>retourne fdp</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
#portrait {
  height: 100vh;
  width: 100vw;
  z-index: 100;
  position: absolute;
  left: 0px;
  top: 0px;
  display: flex;
  div {
    margin: auto;
  }
}
@media screen and (orientation: portrait) {
  // CSS applied when the device is in portrait mode
  #portrait {
    background: red;
  }
}

@media screen and (orientation: landscape) {
  // CSS applied when the device is in landscape mode
  #portrait {
    display: none;
  }
}
</style>
