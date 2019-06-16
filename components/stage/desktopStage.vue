<template>
  <div id="desktopStage">
    <component
      v-if="killElement"
      ref="component"
      v-on:increment="increment"
      v-on:loadStart="loadStart"
      :is="components[value]"
    ></component>

    <div id="canvas"></div>
    <!-- <mini-game :uid="$route.params.level" v-if="minigame"></mini-game> -->
    <!-- <mini-game :uid="$route.params.level"></mini-game> -->
  </div>
</template>

<script>
import { TweenMax } from "gsap";
import { mapGetters, mapMutations, mapState } from "vuex";
import Game from "@/assets/js/game/game";
import TextureAtlas from "@/assets/js/utils/TextureAtlas";
import MiniGame from "@/components/mini-game/MiniGame.vue";
import readyKintsugi from "@/components/ui/readyKintsugi.vue";
import Loader from "@/components/ui/loader.vue";

export default {
  components: {
    MiniGame,
    readyKintsugi,
    Loader
  },
  data() {
    return {
      components: ["readyKintsugi", "Loader"],
      isLevelCompleted: false,
      value: 0,
      minigame: true,
      runGame: false,
      killElement: true
    };
  },
  computed: {
    ...mapState({
      stage: state => state.game.stage,
      currentStageId: state => state.game.currentStageId,
      loaded: state => state.game.loaded,
      socket: state => state.synchro.socket,
      roomID: state => state.synchro.roomID
    }),
    ...mapGetters({
      currentAtlas: "game/currentAtlas"
    })
  },
  created() {
    this.$store.dispatch("game/loadStage", this.$route.params.level);
  },
  mounted() {
    console.log(this.$store);
    this.game = new Game();
    window.addEventListener(
      "launchMiniGame",
      e => {
        this.minigame = e.minigame;
      },
      false
    );
  },
  watch: {
    minigame() {},
    loaded(value) {
      this.game.start(
        {
          currentLevelParams: this.stage,
          currentAltlas: this.currentAtlas
        },
        this.$store
      );
    }
  },
  methods: {
    increment() {
      if (this.value !== this.components.length - 1) {
        this.value++;
      }
    },
    propsLoad() {
      TweenMax.to(this.$refs.component.$el, 2, {
        x: "-110vw",
        onComplete: () => {
          this.killElement = false;
            if(this.socket){
            this.socket.emit("custom-event", {
              name: "readyPlayMobile",
              in: this.roomID,
              args: {
                ready: true
              }
            });
          }
        },
        ease: Power4.easeOut
      });
    },
    loadingBar(value) {
      this.duration = value;
      console.log(this.duration);
    },
    loadStart() {
      if (this.loaded) {
        this.runGame = true;
        this.game.preRenderProps(this.propsLoad.bind(this));
      }
    }
  },

  destroyed() {
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
