<template>
  <div class="frame" id="homepage">
    <div ref="left" id="left">
      <div id="container">
        <div id="title-text">
          <p class="fill-en skew">The legend of</p>
          <Momo></Momo>
          <div id="second-row">
            <p class="skew book">&</p>
            <Romo></Romo>
          </div>
          <div ref="momo" id="momo"></div>
          <div ref="romo" id="romo"></div>
        </div>
        <div ref="backgroundLandscape" id="background-landscape"></div>
        <div ref="backgroundLandscapeClone" id="background-landscape-clone"></div>
      </div>
    </div>
    <div id="right">
      <div id="content">
        <div class="skew content">
          <h5 class="book">
            An Interactive Tale About
            <span class="semi">Wabi-Sabi</span>
          </h5>
        </div>
        <buttonHomepage @click.native="$emit('increment')" class="content"></buttonHomepage>
        <div class="skew content">
          <p class="book">
            This is a
            <span class="semi">two players game</span>
            where cooperation is key!
            Make sure to be a duo
            before launching the game.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { TweenMax } from "gsap";
import QRCode from "qrcode";
import Momo from "@/components/svg/momo";
import Romo from "@/components/svg/romo";
import buttonHomepage from "@/components/svg/button-homepage";

export default {
  components: {
    Momo,
    Romo,
    buttonHomepage
  },
  data() {
    return {
      qrcode: null
    };
  },
  computed: {
    ...mapState({
      isSynchro: state => state.synchro.isSynchro,
      roomID: state => state.synchro.roomID,
      url: state => state.synchro.url,
      socket: state => state.synchro.socket
    })
  },
  mounted() {
    this.connect({
      device: this.$device.isMobileOrTablet,
      roomID: null
    });

    this.left = this.$refs.left;
    this.backgrounds = [
      this.$refs.backgroundLandscape,
      this.$refs.backgroundLandscapeClone
    ];
    this.characters = [this.$refs.momo, this.$refs.romo];

    window.addEventListener("mousemove", this.handleMouseMove);
  },
  watch: {
    roomID() {
      this.generateQRCode();
    }
  },
  methods: {
    ...mapActions({
      connect: "synchro/connect",
      disconnect: "synchro/disconnect"
    }),
    ...mapMutations({
      changeQRCode: "synchro/changeQRCode"
    }),
    generateQRCode() {
      QRCode.toString(this.url, (error, string) => {
        this.qrcode = string;
        this.changeQRCode(this.qrcode);
      });
    },
    handleMouseMove(event) {
      let x = event.x - window.innerWidth / 2;
      let y = event.y - window.innerWidth / 2;

      TweenMax.to(this.backgrounds, 0.5, {
        x: x / 50,
        y: y / 50,
        ease: Power4.easeOut
      });
      TweenMax.to(this.characters, 1, {
        x: x / 30,
        y: y / 40,
        zIndex: "5 !important",
        ease: Power4.easeOut
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";
#home {
  background: $white;
}
#test {
  // z-index: 1;
  position: relative;
}
.frame {
  border: none;
  background: none;
  width: 75vw;
  max-width: 2000px;
}
#homepage {
  position: relative;
  display: flex;

  #left {
    position: relative;
    width: 50%;
    display: flex;
    height: 100%;
    #container {
      position: relative;
      width: auto;
      width: 1000px;
      max-height: 1000px;
      height: 100%;
      // top: calc((100vh - 1000px) / 2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;

      #momo {
        position: absolute;
        bottom: 30%;
        width: 160px;
        height: 305px;
        left: 80px;
        z-index: 6;
        background: url("~static/ui/characters/momo.png");
        background-size: 100% auto;
        background-repeat: no-repeat;
      }
      #romo {
        position: absolute;
        top: 100px;
        width: 200px;
        height: 20%;
        right: 0px;
        z-index: 3 !important;
        background: url("~static/ui/characters/romo.png");
        background-size: 100% auto;
        background-repeat: no-repeat;
      }

      #background-landscape {
        position: absolute;
        width: 50%;
        height: inherit;
        background: url("~static/ui/homepage/homepage_fond.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 0;
      }
      #background-landscape-clone {
        position: absolute;
        width: 50%;
        height: inherit;
        z-index: 9;
        background: url("~static/ui/homepage/homepage_fond_fuji.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        pointer-events: none;
      }
    }

    #title-text {
      position: absolute;
      width: 70%;
      height: inherit;
      flex-direction: column;
      top: 25%;
      display: flex;
      z-index: 2;
      #second-row {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        p {
          font-size: 60px;
          align-self: center;
          margin-right: 10px;
          background: transparent;
          color: black;
          text-shadow: 0 0 5px white, 0 0 5px white, 0 0 5px white,
            0 0 5px white, 0 0 5px white, 0 0 5px white, 0 0 5px white,
            0 0 5px white, 0 0 5px white, 0 0 5px white, 0 0 5px white,
            0 0 5px white, 0 0 5px white, 0 0 5px white, 0 0 5px white,
            0 0 5px white, 0 0 5px white, 0 0 5px white, 0 0 5px white,
            0 0 5px white, 0 0 5px white, 0 0 5px white, 0 0 5px white,
            0 0 5px white, 0 0 5px white, 0 0 5px white, 0 0 5px white,
            0 0 5px white, 0 0 5px white, 0 0 5px white, 0 0 5px white,
            0 0 5px white, 0 0 5px white, 0 0 5px white, 0 0 5px white,
            0 0 5px white, 0 0 5px white, 0 0 5px white, 0 0 5px white,
            0 0 5px white, 0 0 5px white;
        }
      }
      p {
        align-self: flex-start;
      }
      svg {
        width: 80%;

        &:first-of-type {
          text-align: left;
          align-self: flex-start;
          margin-bottom: -5%;
        }
        &:not(:first-of-type) {
          text-align: right;
          align-self: flex-end;
        }
      }
    }
  }
  #right {
    width: 45%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    #content {
      max-width: 435px;
      text-align: center;
      h5 {
        text-transform: uppercase;
        font-size: 40px;
        font-family: $Jost-Book;

        span {
          font-size: 40px;
          font-family: $Jost-Semi;
        }
      }
      svg {
        width: 40%;
        height: auto;
      }
    }
  }
}

.content {
  margin-bottom: 8vh;
  &:last-child {
    margin: 0;
  }
}
</style>
