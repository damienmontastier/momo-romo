<template>
  <div class="intro">
    <div class="title" ref="title">
      <!-- <TitleSVG/> -->
      <div class="tuto" ref="tuto">
        <div class="text">
          <span class="t skew">
            <div class="inline fill-fr">hit the keys in time</div>
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
    <div class="launchButton" @click="launchCountdown">go</div>
    <div class="countdown" @click="launchCountdown">
      <Countdown :countdown="countdown"/>
    </div>
    <div class="isPlaying">
      <span class="title skew">
        <div class="inline fill-fr">romo is playing</div>
      </span>
      <span class="skew">
        <div class="inline book">Stay ready for the next step!</div>
      </span>
    </div>
    <div class="tryAgain">
      <span class="title skew">
        <div class="inline book">try again!</div>
      </span>
    </div>
  </div>
</template>

<script>
import TitleSVG from "./Title";
import Countdown from "./Countdown";
export default {
  components: {
    TitleSVG,
    Countdown
  },
  data() {
    return {
      countdown: 3
    };
  },
  methods: {
    launchCountdown() {
      console.log("launchCountdown");
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
    width: 50px;
    height: 50px;
    background: #f00;
    position: absolute;
    bottom: 108px;
    left: calc(50% - 25px);
    z-index: 10;
    opacity: 0;
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
    // opacity: 0;
    // display: none;
  }
  // span.title {
  .inline {
    display: inline;
  }
  // }
}
</style>

