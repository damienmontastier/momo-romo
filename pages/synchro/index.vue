<template>
  <div id="synchro">
    <div id="top">
      <div id="momo">
        <p class="skew">Desktop player</p>
        <momoTitle></momoTitle>
        <span class="skew">モモ</span>
      </div>
      <div id="romo">
        <p class="skew">Mobile player</p>
        <romoTitle></romoTitle>
        <span class="skew">ロモ</span>
      </div>
    </div>
    <div id="bottom">
      <div id="desktop">
        <div id="momo-chara"></div>
        <span></span>
      </div>
      <div id="mobile">
        <div v-if="!isSynchro">
          <a :href="url">{{url}}</a>
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

export default {
  // layout: "frame",

  components: {
    momoTitle,
    romoTitle
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
  width: 90vw;
  height: 80vh;
  position: relative;
  margin: 0 auto;
  top: 50%;
  transform: translateY(-50%);
  background: #fefbf0;
  border: 2px solid $frame-border-color;
  background-image: url("~static/ui/synchro/intro-fin.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position-y: bottom;

  #top {
    display: inline-flex;
    height: 60%;
    width: 100%;
    align-items: center;

    #momo,
    #romo {
      width: 50%;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      p {
        align-self: flex-start;
        position: relative;
        left: 15%;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: black;
        text-transform: uppercase;
        font-size: 50px;
        color: white;
      }
      span {
        background: black;
        color: white;
        font-size: 30px;
        align-self: flex-end;
        position: relative;
        right: 15%;
        padding: 0 25px;
      }

      svg {
        width: 75%;
      }
    }
  }
  #bottom {
    height: 40%;
    width: 100%;
    display: inline-flex;

    #desktop,
    #mobile {
      width: 50%;
      display: flex;
      justify-content: center;
      position: relative;
    }

    #desktop {
      #momo-chara {
        height: 256px;
        width: 256px;
        background-image: url("~static/ui/synchro/momo.png");
        animation: play 1s steps(6) infinite;
      }
      span {
        width: 200px;
        height: 100px;
        border-radius: 60px;
        background: blue;
        position: relative;
        float: right;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    #mobile {
      #synchronize {
        background-image: url("~static/ui/synchro/romo.png");
        height: 250px;
        width: 250px;
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
  }
}

@keyframes play {
  from {
    background-position-x: 0px;
  }
  to {
    background-position-x: 3075px;
  }
}
</style>
