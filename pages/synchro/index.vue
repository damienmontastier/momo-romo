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
      <div id="desktop" class="center">
        <div id="momo-chara"></div>
        <!-- <div id="keyboard-animation" v-if="!isReady"></div> -->
      </div>
      <div id="mobile" class="center" v-if="qrcode">
        <div id="mobile-container" v-if="!isReady">
          <div>
            <a :href="url">{{url}}</a>
          </div>
          <div ref="qrcode" id="qrcode" v-html="qrcode"></div>
        </div>
        <div v-else id="synchronize"></div>
      </div>
      <div id="mobile" v-else>
        <p>Loading QRCODE</p>
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
      qrcode: null,
      mobileReady: false
    };
  },
  mounted() {
    this.connect({
      device: this.$device.isMobileOrTablet,
      // roomID: this.$device.isMobileOrTablet ? this.$route.query.id : null
      roomID: null
    });
    this.socket.on("mobile-ready", value => {
      this.mobileReady = value;
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
    isReady: function() {
      return this.mobileReady && this.isSynchro;
    },
    ...mapState({
      isSynchro: state => state.synchro.isSynchro,
      roomID: state => state.synchro.roomID,
      url: state => state.synchro.url,
      socket: state => state.synchro.socket
    })
  },
  watch: {
    roomID() {
      this.generateQRCode();
    },
    isReady() {}
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";
.center {
  flex-direction: column;
  width: 400px;
  margin: 0 auto;
}
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

    #momo,
    #romo {
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;

      svg {
        width: 100%;
        height: 100%;
        margin-top: -20px;
      }

      h5 {
        &:first-child {
          align-self: flex-start;
        }
        align-self: flex-end;
        margin-top: -20px;
      }
    }
  }
  #desktop,
  #mobile {
    width: 50%;
  }
  #bottom {
    width: 100%;
    display: inline-flex;
    position: absolute;
    bottom: 25px;

    #desktop {
      #momo-chara {
        width: 269px;
        height: 269px;
        background-image: url("~static/ui/synchro/momo.png");
        animation: play 1.2s steps(12) infinite;
        animation-direction: reverse;
      }
    }
  }
}

@keyframes play {
  from {
    background-position-x: 0px;
  }
  to {
    background-position-x: 3229px;
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
