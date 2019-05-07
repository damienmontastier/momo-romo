<template>
  <div id="desktopStage">
    <h1>desktopStage</h1>
    <div id="canvas"></div>
    <mini-game :uid="$route.params.level" v-if="isLevelCompleted"></mini-game>
    <input type="checkbox" id="checkbox" v-model="isLevelCompleted">
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import Game from "@/assets/js/game/Game";
import TextureAtlas from "@/assets/js/utils/TextureAtlas";
import MiniGame from "@/components/mini-game/MiniGame.vue";

export default {
  data() {
    return {
      isLevelCompleted: false,
      game: new Game()
    };
  },
  computed: {
    ...mapState({
      stage: state => state.game.stage,
      currentStageId: state => state.game.currentStageId,
      loaded: state => state.game.loaded
    }),
    ...mapGetters({
      currentAtlas: "game/currentAtlas"
    })
  },
  created() {
    this.$store.dispatch("game/loadStage", this.$route.params.level);
  },
  mounted() {},
  watch: {
    // TODO: FIX IT
    loaded() {
      this.game.start({
        currentLevelParams: this.stage,
        currentAltlas: this.currentAtlas
      });
      this.game.behind()
    }
  },
  methods: {},
  components: {
    MiniGame
  }
};
</script>

<style lang="scss" scoped>
#checkbox {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>
