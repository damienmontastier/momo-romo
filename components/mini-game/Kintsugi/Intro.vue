<template>
  <div class="intro">
    <div class="title" ref="title">
      <!-- <TitleSVG/> -->
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
    <div class="launchButton" v-if="romoIsReady" @click="launchMinigame" ref="launchButton">
      <button-circle-red jpn="スタート" en="LAUNCH GAME" letter="E"  />
    </div>
    
    <div class="countdown" @click="launchCountdown" ref="countdown">
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
      <span class="skew ">
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
import buttonCircleRed from "@/components/svg/button-circle-red";
import Countdown from "./Countdown";
import { TweenMax } from "gsap";

export default {
  components: {
    TitleSVG,
    Countdown,
    buttonCircleRed
  },
  data() {
    return {
      countdown: 3,
      romoIsReady: false
    };
  },
  methods: {
    showSynchro() {
      this.$refs.synchro.style.opacity = "1"
    },
    launchMinigame() {
      this.$refs.launchButton.style.opacity = "0"
      this.$refs.tuto.style.opacity = "0"
      this.$refs.synchro.style.opacity = "0"
      this.$parent.launchCountdown()
    },
    launchCountdown() {
      this.$refs.tryAgain.style.opacity = "0";
      this.$refs.isPlaying.style.opacity = "0";
      this.$refs.countdown.style.opacity = "1";
      this.countdown = 3;
      let interval = setInterval(() => {
        if (this.countdown == 0) {
          this.countdown = 4;
          console.log("countdown ended");
          this.$emit("startfracture");
          clearInterval(interval);
        } else {
          this.countdown--;
        }
      }, 1000);
    },
    setRomoReady() {
      this.romoIsReady = true
      console.log('romo is ready')
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
    svg {
      margin: auto;
      height: 50%;
      width: 50%;
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
      width: 50px;
      height: 50px;
      background: $black;
      position: absolute;
      bottom: 108px;
      left: calc(50% - 25px);
    }
  }
  .launchButton {
    width: 200px;
    height: 200px;
    // background: #f00;
    position: absolute;
    bottom: calc(150px - 100px);
    left: calc(50% - 100px);
    z-index: 10000;
    // opacity: 0;
  }
  .countdown {
    height: 100px;
  }
  .countdown,
  .isPlaying,
  .tryAgain {
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

