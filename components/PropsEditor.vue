<template>
  <div id="props-editor" ref="props-editor" draggable="false">
    <img :src="this.currentAtlas.png" alt="">
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      currentAtlas: 'editor/currentAtlas'
    })
  },
};
</script>

<style lang="scss" scoped>
#props-editor {
  overflow-x: auto;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 300px;
  height: 100vh;
  background: white;
  z-index: 2;
  img{
    height: 100%;
    max-width: unset;
  }
}
</style>
