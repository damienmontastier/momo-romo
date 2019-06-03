<template>
  <div>
    <div id="props-editor" ref="props-editor" v-on:mouseup="onMouseUp">
      <img
        v-if="loaded"
        ref="atlas-image"
        :src="this.currentAtlas.png"
        alt
        v-on:mousedown="onMouseDown"
        draggable="false"
      >
    </div>
    <div id="sprites">
      <p
        :key="index"
        v-for="(sprite, index) in sprites"
        class="sprite"
        @click="addSprite(sprite)"
      >{{sprite.id}} animated</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import pngCat from "@/static/sprites/cat/cat.png";
const jsonCat = require("~/static/sprites/cat/cat.json");

import pngPetals from "@/static/sprites/petals/petals.png";
const jsonPetals = require("~/static/sprites/petals/petals.json");

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export default {
  data() {
    return {
      sprites: [
        {
          id: "cat",
          png: pngCat,
          json: jsonCat,
          size: {
            w: 4,
            h: 4
          }
        },
        {
          id: "petals",
          png: pngPetals,
          json: jsonPetals,
          size: {
            w: 16,
            h: 4
          }
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      currentAtlas: "editor/currentAtlas"
    }),
    ...mapState({
      loaded: state => state.editor.loaded
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
    },
    addSprite(sprite) {
      this.$emit("addSprite", sprite);
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
  height: 70vh;
  background: white;
  z-index: 2;

  img {
    height: 100%;
    max-width: unset;
  }
}
#sprites {
  overflow-x: auto;
  position: absolute;
  left: 0px;
  top: 70vh;
  width: 300px;
  height: 30vh;
  background: white;
  z-index: 2;
  p {
    &:hover{
      background:red;
    }
  }
  
}
</style>
