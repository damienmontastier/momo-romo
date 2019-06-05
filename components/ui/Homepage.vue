<template>
  <div class="frame" id="homepage">
    <div id="left">
      <div id="container">
        <div id="background-landscape"></div>
        <div id="background-landscape-clone"></div>
      </div>
      <div id="title-text">
        <p class="fill-en skew">The legend of</p>
        <Momo></Momo>
        <Romo></Romo>
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
        <buttonHomepage class="content"></buttonHomepage>
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
      <!-- <button @click="$emit('increment')">Next</button> -->
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
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";
#home {
  background: $white;
}
.frame {
  border: none;
  background: none;
}
#homepage {
  position: relative;
  display: flex;

  #left,
  #right {
    // width: 50%;
  }
  #left {
    width: 60%;
    position: relative;
    // background: red;
    #container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      #background-landscape {
        position: absolute;
        width: inherit;
        height: 90%;
        background: url("~static/ui/homepage/homepage_fond.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;

        &::before {
          content: "";
          position: absolute;
          bottom: 0;
          width: 160px;
          height: 305px;
          left: 10%;
          z-index: 3;
          background: url("~static/ui/characters/momo.png");
          background-size: 100% auto;
          background-repeat: no-repeat;
        }
        &::after {
          content: "";
          position: absolute;
          top: 20%;
          width: 25%;
          height: 25%;
          right: 0;
          z-index: 3;
          background: url("~static/ui/characters/romo.png");
          background-size: 100% auto;
          background-repeat: no-repeat;
        }
      }
      #background-landscape-clone {
        position: absolute;
        width: inherit;
        height: 90%;
        z-index: 2;
        background: url("~static/ui/homepage/homepage_fond_fuji.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        pointer-events: none;
      }
    }

    #title-text {
      position: absolute;
      width: 85%;
      height: inherit;
      left: 50%;
      flex-direction: column;
      top: 10%;
      display: flex;
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
    justify-content: center;
    align-items: center;
    #content {
      max-width: 85%;
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
      }
    }
  }
}

.content {
  margin-bottom: 100px;
  &:last-child {
    margin: 0;
  }
}
</style>
