<template>
  <div id="desktopStage">
    <h1>desktopStage</h1>

    <div id="canvas"></div>
    <mini-game :uid="$route.params.level" v-if="minigame"></mini-game>
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
      game: new Game(),
      minigame: null
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
  mounted() {
    window.addEventListener(
      "launchMiniGame",
      e => {
        this.minigame = e.minigame;
      },
      false
    );
    window.addEventListener("launchAnimated", this.eventProps, false);
  },
  watch: {
    minigame() {},
    // TODO: FIX IT
    loaded() {
      this.game.start({
        currentLevelParams: this.stage,
        currentAltlas: this.currentAtlas
      });
    }
  },
  methods: {
    //FIX IT TOO MUCH CONSOLE LOG
    eventProps(e) {
      if (e.props.bag) {
        console.log("bag");
      }
    }
  },
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
