<template>
  <div id="synchro">
    <div class="frame">
      <div id="top">
        <div id="momo">
          <!-- <div class="center"> -->
          <h5 class="skew stroke">Desktop player</h5>
          <momoTitle></momoTitle>
          <h5 class="skew fill-jpn">モモ</h5>
          <!-- </div> -->
        </div>
        <div id="romo">
          <!-- <div class="center"> -->
          <h5 class="skew stroke">Mobile player</h5>
          <romoTitle></romoTitle>
          <h5 class="skew fill-jpn">ロモ</h5>
        </div>
        <!-- </div> -->
      </div>
      <div id="bottom">
        <div id="desktop">
          <div id="momo-chara">
            <div id="keyboard-animation" v-if="!isReady"></div>
          </div>
        </div>
        <div id="mobile" v-if="qrcode">
          <div id="mobile-container" v-if="!isReady">
            <div id="link">
              <a :href="url">{{url}}</a>
            </div>
            <div ref="qrcode" id="qrcode" v-html="qrcode"></div>
          </div>
          <div v-else id="synchronize"></div>
        </div>
      </div>

      <!-- <button @click="disconnect">disconnect</button> -->
    </div>
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
  width: 80%;
  height: 60%;
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
  .frame {
    background-image: url("~static/ui/synchro/intro-fin.jpg");
    background-color: $beige;
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 200px;
      background: linear-gradient(180deg, #fefbf0 40%, rgba(0, 0, 0, 0));
    }

    &::before {
      content: "";
      position: absolute;
      bottom: 0px;
      left: 0px;
      width: 100%;
      height: 200px;
      background: linear-gradient(0deg, #fefbf0 40%, rgba(0, 0, 0, 0));
    }
  }

  #top {
    display: flex;
    height: 50%;
    width: 100%;

    #momo,
    #romo {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 5%;

      svg {
        width: 100%;
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
    margin: auto;
  }
  #bottom {
    width: 100%;
    display: flex;
    position: absolute;
    bottom: 5vh;

    #desktop {
      display: flex;
      flex-direction: row;
      #momo-chara {
        width: 30vh;
        height: 30vh;
        background: transparent url("~static/ui/synchro/momo.gif");
        background-size: cover;
        background-repeat: no-repeat;
        margin: auto;
        position: relative;
      }
      #keyboard-animation {
        width: 150px;
        height: 150px;
        border-radius: 45px;
        background: white;
        border: 4px solid $a;
        position: absolute;
        // left: -5%;
        right: -6vh;
        top: 8vh;
        background-image: url("~static/ui/synchro/tuto_keyboard.gif");
        background-size: cover;
        background-position: center;

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
          left: -2px;
          transform: translate(-50%, -50%) rotate(45deg);
        }
      }
    }
    #mobile {
      &-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        #link {
          background: white;
          border: 4px solid $a;
          border-radius: 30px;
          padding: 10px 24px;
          text-decoration: none;
          position: relative;
          a {
            text-decoration: none;
          }
          &::after {
            content: "";
            width: 100%;
            position: absolute;
            bottom: -10px;
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
          margin-top: 45px;
          position: relative;
          &::after {
            content: "";
            width: 30px;
            height: 30px;
            background: white;
            border-top: 4px solid $a;
            border-left: 4px solid $a;
            display: block;
            top: -2px;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
          }
        }
      }
      #synchronize {
        background: transparent url("~static/ui/synchro/romo.gif");
        height: 32vh;
        width: 32vh;
        background-size: cover;
        background-repeat: no-repeat;
        margin: auto;
      }
    }
  }
}
</style>
