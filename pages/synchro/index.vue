<template>
  <div class="frame" id="synchro">
    <div id="top">
      <!-- <buttonCircleRed letter="A" en="Open Map" jpn="ホームマップ"></buttonCircleRed> -->
      <!-- <buttonCircle letter="A" en="Open Map" jpn="ホームマップ"></buttonCircle> -->

      <div id="momo">
        <div class="center">
          <h5 class="skew stroke">Desktop player</h5>
          <momoTitle></momoTitle>
          <h5 class="skew fill-jpn">モモ</h5>
        </div>
      </div>
      <div id="romo">
        <div class="center">
          <h5 class="skew stroke">Mobile player</h5>
          <romoTitle></romoTitle>
          <h5 class="skew fill-jpn">ロモ</h5>
        </div>
      </div>
    </div>
    <div id="bottom">
      <div id="desktop">
        <div id="momo-chara"></div>
        <div id="keyboard-indicator" v-if="!isSynchro"></div>
      </div>
      <div id="mobile" v-if="qrcode">
        <div id="mobile-container" v-if="!isSynchro">
          <div>
            <a :href="url">{{url}}</a>
          </div>
          <div ref="qrcode" id="qrcode" v-html="qrcode"></div>
        </div>
        <div v-else id="synchronize"></div>
      </div>
    </div>

    <!-- <button @click="disconnect">disconnect</button> -->
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import QRCode from "qrcode";
import momoTitle from "@/components/svg/momo";
import romoTitle from "@/components/svg/romo";
import buttonCircleRed from "@/components/svg/button-circle-red";
import buttonCircle from "@/components/svg/button-circle";

export default {
  components: {
    momoTitle,
    romoTitle,
    buttonCircleRed,
    buttonCircle
  },
  data() {
    return {
      qrcode: null
    };
  },
  mounted() {
    this.connect({
      device: this.$device.isMobileOrTablet,
      // roomID: this.$device.isMobileOrTablet ? this.$route.query.id : null
      roomID: null
    });
  },
  methods: {
    ...mapActions({
      connect: "synchro/connect",
      disconnect: "synchro/disconnect"
    }),
    ...mapMutations({}),
    generateQRCode() {
      QRCode.toString(this.url, (error, string) => {
        this.qrcode = string;
        // this.$refs.qrcode.innerHTML = string;
        // if (error) console.error(error);
        // console.log("success!");
      });
    }
  },
  computed: {
    ...mapState({
      isSynchro: state => state.synchro.isSynchro,
      roomID: state => state.synchro.roomID,
      url: state => state.synchro.url
    })
  },
  watch: {
    roomID() {
      this.generateQRCode();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";

#qrcode {
  height: 150px;
  width: 150px;

  svg {
    height: 100%;
    width: 100%;
  }
}

#synchro {
  background-image: url("~static/ui/synchro/intro-fin.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center bottom;

  #top {
    display: inline-flex;
    height: 50%;
    width: 100%;
    align-items: center;

    #momo,
    #romo {
      width: 50%;
      height: 50%;

      .center {
        margin: 0 auto;
        max-width: 65%;
        display: flex;
        flex-direction: column;
      }

      h5.stroke {
        align-self: flex-start;
      }
      h5.fill-jpn {
        align-self: flex-end;
      }
    }
  }
  #bottom {
    height: 50%;
    width: 100%;
    display: inline-flex;

    #desktop,
    #mobile {
      width: 50%;
      display: flex;
      justify-content: center;
      position: relative;
      align-items: center;
    }

    #desktop {
      #momo-chara {
        width: 368px;
        height: 384px;
        background-image: url("~static/ui/synchro/momo.png");
        animation: play 1.2s steps(12) infinite;
        animation-direction: reverse;
      }
      #keyboard-indicator {
        width: 160px;
        height: 120px;
        border-radius: 45px;
        background: white;
        border: 4px solid $a;
        position: relative;
        left: -5%;

        &::after {
          content: "";
          width: 30px;
          height: 30px;
          background: white;
          border-bottom: 4px solid $a;
          border-left: 4px solid $a;
          display: block;
          top: 50%;
          position: absolute;
          left: 0;
          transform: translate(-50%, -50%) rotate(45deg);
        }
      }
    }

    #mobile {
      &-container {
        display: flex;
        flex-direction: column;
        align-items: center;

        a {
          background: white;
          border: 4px solid $a;
          border-radius: 30px;
          padding: 10px;
          text-decoration: none;
          position: relative;

          &::after {
            content: "";
            width: 100%;
            position: absolute;
            bottom: -15%;
            border-radius: 30px;
            z-index: -1;
            left: 0;
            height: 100%;
            background: $a;
          }
        }
        #qrcode {
          width: 150px;
          height: 150px;
          background: white;
          border: 4px solid $a;
          border-radius: 30px;
          padding: 10px;
          margin-top: 15%;
          position: relative;

          &::after {
            content: "";
            width: 30px;
            height: 30px;
            background: white;
            border-top: 4px solid $a;
            border-left: 4px solid $a;
            display: block;
            top: 0;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
          }
        }
      }
      #synchronize {
        background-image: url("~static/ui/synchro/romo.png");
        animation: playRomo 0.8s steps(3) infinite alternate;
        height: 314px;
        width: 307px;
      }
    }
  }
}

@keyframes play {
  from {
    background-position-x: 0px;
  }
  to {
    background-position-x: 4613px;
  }
}
@keyframes playRomo {
  from {
    background-position-x: 0px;
  }
  to {
    background-position-x: 942px;
  }
}
</style>
