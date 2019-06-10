<template>
  <div class="frame" id="homepage">
    <div ref="left" id="left">
      <div id="test">
        <div id="title-text">
          <p class="fill-en skew">The legend of</p>
          <Momo></Momo>
          <Romo></Romo>
        </div>
      </div>
      <div id="container">
        <div ref="backgroundLandscape" id="background-landscape">
          <div ref="momo" id="momo"></div>
          <div ref="romo" id="romo"></div>
        </div>
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
import { mapState, mapMutations } from "vuex";
import { TweenMax } from "gsap";
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
    return {};
  },
  computed: {},
  mounted() {
    this.left = this.$refs.left;
    this.backgrounds = [
      this.$refs.backgroundLandscape,
      this.$refs.backgroundLandscapeClone
    ];
    this.characters = [this.$refs.momo, this.$refs.romo];

    window.addEventListener("mousemove", this.handleMouseMove);
  },
  methods: {
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
#test{
  // z-index: 1;
  position: relative;
}
.frame {
  border: none;
  background: none;
}
#homepage {
  position: relative;
  display: flex;

  #left {
    width: 60%;
    position: relative;
    #container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      #background-landscape {
        position: absolute;
        width: 50vh;
        height: inherit;
        background: url("~static/ui/homepage/homepage_fond.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 0;
        #momo {
          position: absolute;
          bottom: 0;
          width: 160px;
          height: 305px;
          left: -80px;
          z-index: 6;
          background: url("~static/ui/characters/momo.png");
          background-size: 100% auto;
          background-repeat: no-repeat;
        }
        #romo {
          position: absolute;
          top: 20vh;
          width: 200px;
          height: 100px;
          right: -150px;
          z-index: 3 !important;
          background: url("~static/ui/characters/romo.png");
          background-size: 100% auto;
          background-repeat: no-repeat;
        }
      }
      #background-landscape-clone {
        position: absolute;
        width: 50vh;
        height: inherit;
        z-index:9;
        background: url("~static/ui/homepage/homepage_fond_fuji.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        pointer-events: none;
      }
    }

    #title-text {
      position: absolute;
      width: 75vh;
      height: inherit;
      left: 50%;
      flex-direction: column;
      top: 10vh;
      display: flex;
      z-index: 2;
      transform: translateX(-50%);
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
    width: 40%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    #content {
      max-width: 80%;
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
