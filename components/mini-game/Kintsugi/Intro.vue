<template>
  <div class="intro">
    <div class="title" ref="title">
      <div ref="titleSVG" id="titleSVG">
        <TitleSVG/>
      </div>
      <div class="tuto" ref="tuto">
        <div class="text">
          <span class="t skew">
            <div class="inline fill-en">hit the keys in time</div>
          </span>
          <span class="skew">
            <div class="inline book">Get the pieces back together</div>
          </span>
          <span class="skew">
            <div class="inline book">So Romo can applay golden glue</div>
          </span>
        </div>
        <div class="gif"></div>
      </div>
    </div>
    <div class="endTitle" ref="endTitle">
      <div ref="greatSVG" id="greatSVG">
        <GreatSVG/>
      </div>
    </div>
    <div class="launchButton" @click="launchMinigame" ref="launchButton">
      <button-circle-red jpn="スタート" en="LAUNCH GAME" letter="E"/>
    </div>

    <div class="countdown" ref="countdown">
      <Countdown :countdown="countdown"/>
    </div>
    <div class="isPlaying" ref="isPlaying">
      <span class="title skew">
        <div class="inline fill-en">romo is playing</div>
      </span>
      <span class="skew">
        <div class="inline book">Stay ready for the next step!</div>
      </span>
    </div>
    <div class="tryAgain" ref="tryAgain">
      <span class="skew">
        <div class="inline fill-en">try again!</div>
      </span>
    </div>
    <div class="synchro" ref="synchro">
      <div class="container">
        <div class="states">
          <div class="momo skew">
            <span class="stroke" v-if="romoIsReady">go?</span>
            <span class="stroke" v-else>wait</span>
          </div>
          <div class="romo skew">
            <span class="stroke" v-if="romoIsReady">Ready!</span>
            <span class="stroke" v-else>Ready?</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleSVG from "./Title";
import GreatSVG from "./Great";
import buttonCircleRed from "@/components/svg/button-circle-red";
import Countdown from "./Countdown";
import { TweenMax } from "gsap";

export default {
  components: {
    TitleSVG,
    Countdown,
    buttonCircleRed,
    GreatSVG
  },
  data() {
    return {
      countdown: 4,
      romoIsReady: false,
      interval: null
    };
  },
  methods: {
    showSynchro() {
      this.$refs.synchro.style.opacity = "1";
    },
    launchMinigame() {
      this.$refs.launchButton.style.opacity = "0";
      this.$refs.launchButton.style.pointerEvents = "none";
      this.$refs.tuto.style.opacity = "0";
      this.$refs.synchro.style.opacity = "0";
      this.$parent.launchCountdown();
    },
    launchCountdown() {
      this.$refs.tryAgain.style.opacity = "0";
      this.$refs.isPlaying.style.opacity = "0";
      this.$refs.countdown.style.opacity = "1";
      this.countdown = 3;
      if(this.interval) {
        clearInterval(this.interval)
      }
      this.interval = setInterval(() => {
        if (this.countdown == 0) {
          this.countdown = 4;
          console.log("countdown ended");
          this.$emit("startfracture");
          clearInterval(this.interval);
        } else {
          this.countdown--;
        }
      }, 1000);
    },
    setRomoReady() {
      this.romoIsReady = true;
      this.$refs.launchButton.style.opacity = "1";
      this.$refs.launchButton.style.pointerEvents = "auto";
      console.log("romo is ready");
    }
  },
  props: {
    current: Number
  },
  watch: {
    current() {}
  }
};
</script>


<style lang="scss" scoped>
@import "~assets/scss/main.scss";
.intro {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 10;

  > .title {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    #titleSVG {
      opacity: 0;
      transform: scale(0);
      margin: auto;
      height: 50%;
      width: 50%;
      // transform: scale(1.1);
      svg {
        height: 100%;
      }
    }
  }

  .tuto {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    .text {
      margin: auto;
      display: flex;
      flex-direction: column;
      padding-bottom: 112px;
      .inline {
        margin-left: 32px;
      }
      .t {
        color: #fff;
        .inline {
          margin-left: 0px;
        }
      }
    }
    .gif {
      width: 160px;
      height: 160px;
      // background: $black;
      position: absolute;
      bottom: 80px;
      left: calc(50% - 80px);
      background: url("~static/ui/kintsugi/mini-game/tuto-touche.gif");
      background-size: cover;
    }
  }
  .launchButton {
    width: 200px;
    height: 200px;
    // background: #f00;
    position: absolute;
    // bottom: calc(150px - 100px);
    bottom: 60px;
    left: calc(50% - 100px);
    z-index: 10000;
    opacity: 0;
    pointer-events: none;
  }
  .countdown {
    height: 80px;
  }
  .countdown,
  .isPlaying,
  .tryAgain,
  .endTitle {
    // min-width: 50px;
    // height: 50px;
    // background: #f00;
    width: 100%;
    left: 0px;
    position: absolute;
    bottom: 108px;
    z-index: 11;
    display: flex;
    opacity: 0;
  }

  .endTitle {
    // height: 100px;
    bottom: 100px;
    transform: scale(0);
    #greatSVG {
      width: 100%;
      height: 125px;
      display: flex;
    }
    svg {
      margin: auto;
      height: 100%;
    }
  }

  .isPlaying,
  .tryAgain {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .inline {
    display: inline;
  }

  .synchro {
    position: absolute;
    bottom: 120px;
    left: 0px;
    width: 100%;
    opacity: 0;

    .container {
      width: 100%;
      display: flex;
      flex-direction: row;
      .states {
        padding: 0 8px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        > div {
          width: 200px;
          display: flex;
          span {
            margin: auto;
          }
        }
      }
    }
  }
}
</style>

