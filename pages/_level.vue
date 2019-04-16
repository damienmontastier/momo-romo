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
import Game from "@/assets/js/game/Game";

export default {
  // validate({ params, store }) {
  //   // return store.state.levels.hasOwnProperty(params.level); // Si l'url n'est pas un level, Error 404
  // },
  components: {},
  data: () => {
    return {};
  },
  computed: {
    ...mapState({
      // levels: state => state.game.levels,
      atlases: state => state.game.atlases,
      currentStageId: state => state.game.currentStageId,
      stage: state => state.game.stage,
      loaded: state => state.game.loaded
    })
  },
  watch: {
    loaded() {
      console.log(this.stage);
    }
  },
  created() {
    // this.currentStageId = this.$route.params.level; // ID of the current level
    this.setCurrentStageId(this.$route.params.level);
  },
  methods: {
    ...mapMutations({
      setCurrentStageId: "game/setCurrentStageId"
    })
  },
  mounted() {
    this.$store.dispatch("game/get");
    // this.currentLevelParams = this.levels[this.currentStageId]; // Params of the current level
    // this.currentAltlas = this.atlases[this.currentStageId]; // Texture of the current Level
    // console.log(this.currentStageId);
    // this.game = new Game({
    //   currentLevelParams: this.currentLevelParams,
    //   currentAltlas: this.currentAltlas
    // }).start();
  }
};
</script>

<style lang="scss" scoped>
</style>
