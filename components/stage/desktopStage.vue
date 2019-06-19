<template>
  <div id="desktopStage">
    <component
      v-if="killElement"
      ref="component"
      v-on:increment="increment"
      v-on:loadStart="loadStart"
      :is="components[value]"
    ></component>

    <div ref="buttonPause" id="button-pause-container">
      <buttonCirclePause id="button-pause" letter="p" en="Pause Game" jpn="ポーズゲーム"></buttonCirclePause>
    </div>
    <img :src="gashyangif" id="gashyan" alt="gashyan" ref="gashyan">

    <div ref="tutorialKeyboard" id="tutorial-keyboard"></div>

    <div id="canvas"></div>

    <buttonCircleRed
      en="Repair bowl"
      letter="E"
      jpn="リペアボウル"
      id="button-start-minigame"
      :uid="$route.params.level"
      v-if="minigame && !minigameStarted"
      v-on:triggered="startMinigame"
    ></buttonCircleRed>
    <mini-game :uid="$route.params.level" ref="minigame" v-on:minigameended="minigameended"></mini-game>
    <!-- <mini-game :uid="$route.params.level"></mini-game> -->

    <about ref="about"/>
  </div>
</template>

<script>
import { TweenMax } from "gsap";
import { mapGetters, mapMutations, mapState } from "vuex";
import HowlerManager from "~/assets/js/utils/HowlerManager";
import Game from "@/assets/js/game/game";
import TextureAtlas from "@/assets/js/utils/TextureAtlas";
import MiniGame from "@/components/mini-game/MiniGame.vue";
import readyKintsugi from "@/components/ui/readyKintsugi.vue";
import buttonCircleRed from "@/components/svg/button-circle-red";
import buttonCirclePause from "@/components/svg/button-circle-pause";
import Loader from "@/components/ui/loader.vue";
import About from "@/components/mini-game/Kintsugi/About";
import gashyangif from "~/static/ui/gashyan.gif";
import breaking_bowl from "@/static/sounds/breaking_bowl.mp3";

export default {
  components: {
    MiniGame,
    readyKintsugi,
    Loader,
    buttonCircleRed,
    buttonCirclePause,
    About
  },
  data() {
    return {
      components: ["readyKintsugi", "Loader"],
      isLevelCompleted: false,
      value: 0,
      minigame: false,
      runGame: false,
      killElement: true,
      showTutorial: true,
      minigameStarted: false,
      minigameEnded: false,
      aboutLaunched: false,
      gashyangif: gashyangif,
      showGashyanGif: false,
      showPauseButton: false
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
    HowlerManager.add([
      {
        id: "breaking_bowl",
        src: breaking_bowl
      }
    ]).then(sounds => {
      this.sounds = sounds;
    });
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

    window.addEventListener("launchAbout", () => {
      console.log("launchAbout");
      this.aboutLaunched = true;
      this.$refs.about.$el.style.visibility = "visible";
      this.$refs.about.init();
    });

    this.startMinigame();
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
    },
    showPauseButton(value) {
      console.log(this.$refs.buttonPause);
      if (value && this.$refs.buttonPause) {
        TweenMax.to(this.$refs.buttonPause, 1, {
          opacity: 1,
          visibility: "visible",
          ease: Power4.easeOut
        });
      }
    }
  },
  methods: {
    minigameended() {
      this.game.launchEndMiniGame().then(value => {
        console.log("yeees");
      });
      console.log("this.minigameEnded", this.minigameEnded);
    },
    startMinigame() {
      console.log("start minigame");
      this.minigameStarted = true;
      this.$nextTick(() => {
        this.$refs.minigame.$el.style.visibility = "visible";
        this.$refs.minigame.$children[0].load().then(() => {
          this.$refs.minigame.$children[0].start().then(() => {
            this.game.launchMiniGame().then(value => {
              console.log("yeees");
            });
          });
        });
      });
    },
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
          if (this.socket) {
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
    addTutorial(value) {
      this.showPauseButton = true;
      let tl = new TimelineMax();
      tl.to(this.$refs.tutorialKeyboard, 0.01, {
        left: value.x - this.$refs.tutorialKeyboard.clientWidth / 2,
        top: value.y
      });
      tl.to(this.$refs.tutorialKeyboard, 1, {
        top: value.y - (20 + this.$refs.tutorialKeyboard.clientHeight * 2),
        ease: Power4.easeOut
      });
      tl.to(this.$refs.tutorialKeyboard, 1, {
        delay: -0.8,
        opacity: 1,
        ease: Power4.easeOut
      });
    },
    hideTutorial() {
      if (this.showTutorial) {
        TweenMax.to(this.$refs.tutorialKeyboard, 2, {
          top: this.$refs.tutorialKeyboard.getBoundingClientRect().top - 50,
          opacity: 0,
          ease: Power4.easeOut,
          onComplete: () => {
            this.showTutorial = false;
          }
        });
      }
    },
    displayGIF(position) {
      this.showGashyanGif = true;
      let getBoundingClientRect = this.$refs.gashyan.getBoundingClientRect();
      this.sounds.breaking_bowl.play();
      TweenMax.to(this.$refs.gashyan, 0, {
        delay: 0.5,
        y: "50%" - getBoundingClientRect.height + "px",
        left: position.x - getBoundingClientRect.width / 2,
        opacity: 1,
        onComplete: () => {
          setTimeout(() => {
            TweenMax.to(this.$refs.gashyan, 0, {
              display: "none"
            });
          }, 2500);
        }
      });
    },
    loadStart() {
      if (this.loaded) {
        this.runGame = true;
        this.game.preRenderProps(
          this.propsLoad.bind(this),
          this.addTutorial.bind(this),
          this.hideTutorial.bind(this),
          this.displayGIF.bind(this)
        );
      }
    }
  },

  destroyed() {
    this.game.reset();
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";
#mini-game {
  visibility: hidden;
}
#desktopStage {
  position: relative;
  width: 100%;
  height: 100%;
  #tutorial-keyboard {
    width: 150px;
    height: 130px;
    background: white;
    position: absolute;
    top: 0%;
    left: 0%;
    opacity: 0;
    border-radius: 40px;
    border: 4px solid $a;
    background-image: url("~static/ui/synchro/tuto_keyboard.gif");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;

    &::after {
      content: "";
      width: 30px;
      height: 30px;
      background: white;
      border-right: 4px solid $a;
      border-bottom: 4px solid $a;
      display: block;
      bottom: -18px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }
  }

  #gashyan {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }
  #button-pause-container {
    position: absolute;
    opacity: 0;
    top: 30px;
    left: 30px;
    width: 150px;
    height: 150px;
    visibility: hidden;
  }
}

#button-start-minigame {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
}

#about {
  position: absolute;
  top: 0px;
  left: 0px;
  visibility: hidden;
}
</style>
