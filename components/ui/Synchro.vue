<template>
  <div class="frame" id="synchro">
    <div id="top">
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
    </div>

    <!-- <button @click="disconnect">disconnect</button> -->
  </div>
</template>

<script>
import { Howl, Howler } from "howler";

import { mapMutations, mapActions, mapState } from "vuex";
import momoTitle from "@/components/svg/momo";
import romoTitle from "@/components/svg/romo";
import buttonCircleRed from "@/components/svg/button-circle-red";
import buttonCircle from "@/components/svg/button-circle";

import HowlerManager from "~/assets/js/utils/HowlerManager";
import sync_activated from "@/static/sounds/sync_activated.mp3";
import background_sync from "@/static/sounds/background_sync.mp3";

export default {
  components: {
    momoTitle,
    romoTitle,
    buttonCircleRed,
    buttonCircle
  },
  data() {
    return {
      mobileReady: false,
      sync_activated: null,
      background_sync: null,
      soundArray: []
    };
  },
  mounted() {
    this.socket.on("mobile-ready", value => {
      this.mobileReady = value;
    });
  },
  created() {
    HowlerManager.add([
      {
        id: "sync_activated",
        src: sync_activated
      },
      {
        id: "background_sync",
        src: background_sync
      }
    ]).then(sounds => {
      this.sounds = sounds;
      this.sounds.background_sync.loop(true);
      this.sounds.background_sync.play();
              console.log(this.sounds.background_sync)

      this.sounds.background_sync.fade(0, 1.0, 5000);
    });
  },
  methods: {
    ...mapMutations({})
  },
  computed: {
    isReady: function(value) {
      return this.mobileReady && this.isSynchro;
    },
    ...mapState({
      qrcode: state => state.synchro.qrcode,
      isSynchro: state => state.synchro.isSynchro,
      url: state => state.synchro.url,
      socket: state => state.synchro.socket
    })
  },
  watch: {
    isReady(value) {
      if (value) {
        this.sounds.background_sync.stop();
        this.sounds.sync_activated.play();
        this.sounds.sync_activated.on("end", () => {
          this.$router.push("/kintsugi");
        });
      }
    }
  },
  beforeDestroy() {
    HowlerManager.stop(this.sounds);
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
