<template>
  <div class="intro">
    <div class="title">
      <TitleSVG/>
      <div class="tuto">
        <div class="text">
          <span class="t skew">
            <div class="inline">hit the keys in time</div>
          </span>
          <span class="skew">
            <div class="inline">Get the pieces back together</div>
          </span>
          <span class="skew">
            <div class="inline">So Romo can applay golden glue</div>
          </span>
        </div>
        <div class="gif"></div>
      </div>
    </div>
    <div class="launchButton" @click="launchCountdown"></div>
    <div class="countdown" @click="launchCountdown">
      <Countdown :countdown="countdown"/>
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
.intro {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 10;

  .title {
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
    .text {
      margin: auto;
      display: flex;
      flex-direction: column;
      .inline {
        display: inline-block;
        font-family: "Jost-Book";
        font-size: 30px;
        margin-left: 32px;
        letter-spacing: 1px;
      }
      .t {
        color: #fff;
        .inline {
          background: #000;
          padding: 2px 16px;
          font-family: "Jost-Medium";
          text-transform: uppercase;
          margin-left: 0px;
          letter-spacing: 1px;
        }
      }
      span {
        transform: skewY(-3deg);
      }
    }
    .gif {
      width: 50px;
      height: 50px;
      background: #000;
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
  }
  .countdown {
    // min-width: 50px;
    // height: 50px;
    // background: #f00;
    position: absolute;
    bottom: 108px;
    left: calc(50% - 25px);
    z-index: 11;
  }
}
</style>

