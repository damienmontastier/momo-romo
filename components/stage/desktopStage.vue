<template>
  <div id="desktopStage">
    <div id="canvas"></div>
    <mini-game :uid="$route.params.level" v-if="minigame"></mini-game>
    <!-- <mini-game :uid="$route.params.level"></mini-game> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import Game from "@/assets/js/game/game";
import TextureAtlas from "@/assets/js/utils/TextureAtlas";
import MiniGame from "@/components/mini-game/MiniGame.vue";

export default {
  data() {
    return {
      isLevelCompleted: false,
      minigame: null
    };
  },
  computed: {
    ...mapState({
      stage: state => state.game.stage,
      currentStageId: state => state.game.currentStageId,
      loaded: state => state.game.loaded,
      socket: state => state.synchro.socket
    }),
    ...mapGetters({
      currentAtlas: "game/currentAtlas"
    })
  },
  created() {
    this.$store.dispatch("game/loadStage", this.$route.params.level);
  },
  mounted() {
      this.game = new Game();
      window.addEventListener(
        "launchMiniGame",
        e => {
          this.minigame = e.minigame;
        },
        false
      );
      // window.addEventListener(
      //   "launchAnimated",
      //   e => {
      //     // console.log(e.props);
      //     // this.coucou = e.props;
      //   },
      //   false
      // );
    // }
  },
  watch: {
    minigame() {},
    loaded() {
      this.game.start({
        currentLevelParams: this.stage,
        currentAltlas: this.currentAtlas
      }, this.$store);
    }
  },
  methods: {
    //FIX IT TOO MUCH CONSOLE LOG
  },
  components: {
    MiniGame
  },
  beforeDestroy() {
    this.game.reset();
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
