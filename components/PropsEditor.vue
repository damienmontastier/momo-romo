<template>
  <div id="props-editor" ref="props-editor" v-on:mouseup="onMouseUp">
    <img
      ref="atlas-image"
      :src="this.currentAtlas.png"
      alt
      v-on:mousedown="onMouseDown"
      draggable="false"
    >
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export default {
  computed: {
    ...mapGetters({
      currentAtlas: "editor/currentAtlas"
    })
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setDraggingPropId: "editor/setDraggingPropId"
    }),
    onMouseUp(e) {
      this.setDraggingPropId(null);
    },
    onMouseDown(e) {
      let x = e.x + this.$refs["props-editor"].scrollLeft;
      let y = e.y + this.$refs["props-editor"].scrollTop;
      x = x.map(
        0,
        this.$refs["atlas-image"].offsetWidth,
        0,
        this.$refs["atlas-image"].naturalWidth
      );
      y = y.map(
        0,
        this.$refs["atlas-image"].offsetHeight,
        0,
        this.$refs["atlas-image"].naturalHeight
      );
      let target = this.currentAtlas.json.frames.filter(
        frame =>
          frame.frame.x < x &&
          frame.frame.x + frame.frame.w > x &&
          (frame.frame.y < y && frame.frame.y + frame.frame.h > y)
      );
      if (target[0]) {
        let id = target[0].filename.replace(".png", "").toLowerCase();
        this.setDraggingPropId(id);
      }
    }
  }
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
  img {
    height: 100%;
    max-width: unset;
  }
}
</style>
