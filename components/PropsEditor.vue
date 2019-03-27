<template>
  <div id="props-editor" ref="props-editor" draggable="false"></div>
</template>

<script>
import { mapState } from "vuex";
export default {
  mounted() {
    console.log(this.atlases);
  },
  computed: {
    ...mapState({
      atlases: state => state.editor.atlases
    })
  }
};
</script>

<style lang="scss" scoped>
#props-editor {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 300px;
  height: 100vh;
  background: white;
  z-index: 2;
}
</style>
