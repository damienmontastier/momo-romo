<template>
  <div>
    <section class="container">
      <h1>{{currentStageId}} level</h1>
    </section>
    <div id="canvas"></div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import TextureAtlas from "@/assets/js/utils/TextureAtlas";
import Game from "@/assets/js/game/game.js";

export default {
  validate({ params, store }) {
    return store.state.levels.hasOwnProperty(params.level); // Si l'url n'est pas un level, Error 404
  },
  components: {},
  data: () => {
    return {};
  },
  computed: {
    ...mapState({
      levels: state => state.level.levels,
      atlases: state => state.level.atlases
    }),
    ...mapMutations({})
  },
  created() {
    this.currentStageId = this.$route.params.level; // ID of the current level
    this.currentLevelParams = this.levels[this.currentStageId]; // Params of the current level
    this.currentAltlas = this.atlases[this.currentStageId]; // Texture of the current Level
  },
  mounted() {
    //Creation de la scène
    // this.levelScene = new level({
    //   textureAtlas: new TextureAtlas(this.currentAltlas),
    //   params: this.currentLevelParams
    // });
    this.game = new Game({
      currentLevelParams: this.currentLevelParams,
      currentAltlas: this.currentAltlas
    }).start();
  }
};
</script>

<style lang="scss" scoped>
#canvas {
  // width: 100%;
  // height: 100vh;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // position: absolute;
  // top: 0;
}
</style>
