<template>
  <div class="mobile-layout" id="room">
    <div>
      <p class="skew stroke">You are</p>
      <synchedTitle></synchedTitle>
    </div>
    <div ref="characterRomo" class="character-romo"></div>
    <div class="center-horizontaly">
      <p class="book skew">
        <span class="semi">Swipe up</span> to join
        <br>Momo in his quest.
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import synchedTitle from "@/components/mobile/svg/SynchedTitle";
import { TweenMax } from "gsap";

export default {
  data() {
    return {
      startCoord: { x: 0, y: 0 },
      endCoord: { x: 0, y: 0 }
    };
  },
  components: {
    synchedTitle
  },
  computed: {
    ...mapState({
      isSynchro: state => state.synchro.isSynchro,
      socket: state => state.synchro.socket,
      roomID: state => state.synchro.roomID
    })
  },
  mounted() {
    if (this.$device.isMobileOrTablet) {
      window.addEventListener("touchstart", this.handleStart.bind(this));
      window.addEventListener("touchend", this.handleEnd.bind(this));
      window.addEventListener("touchmove", this.handleMove.bind(this));
      window.addEventListener("click", this.openFullscreen.bind(this));
      this.connect({
        device: this.$device.isMobileOrTablet,
        roomID: this.$device.isMobileOrTablet ? this.$route.params.level : null
      });
    } else {
      alert("t'es pas sur mobile");
    }
  },
  methods: {
    ...mapActions({
      connect: "synchro/connect"
    }),
    openFullscreen() {
      console.log("request fullscreen");
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    },
    handleMove(event) {
      let deltaY = Math.min(
        Math.max(this.startCoord.y - event.changedTouches[0].clientY, 0),
        this.$refs.characterRomo.offsetHeight
      );
      console.log(deltaY / 100);

      TweenMax.to(this.$refs.characterRomo, 1.5, {
        y: -deltaY,
        ease: Power4.easeOut
      });
    },
    handleStart(event) {
      TweenMax.to(this.$refs.characterRomo, 1, {
        scale: 1.05,
        ease: Power4.easeOut
      });
      this.startCoord.x = event.touches[0].clientX;
      this.startCoord.y = event.touches[0].clientY;
    },
    handleEnd(event) {
      TweenMax.to(this.$refs.characterRomo, 2, {
        scale: 1,
        ease: Power4.easeOut
      });
      this.endCoord.x = event.changedTouches[0].clientX;
      this.endCoord.y = event.changedTouches[0].clientY;
      this.handleGesture();
    },
    handleGesture() {
      let distanceY = this.startCoord.y - this.endCoord.y;
      let distanceX = this.startCoord.x - this.endCoord.x;
      if (
        this.startCoord.y > this.endCoord.y &&
        distanceX < 100 &&
        distanceY > 150
      ) {
        TweenMax.to(this.$refs.characterRomo, 1, {
          y: "-65vh",
          opacity: 0,
          ease: Power4.easeOut,
          onComplete: () => {
            if (this.socket) {
              this.socket.emit("custom-event", {
                name: "mobile-ready",
                in: this.roomID,
                args: {
                  ready: true
                }
              });
              if (this.isSynchro) this.$emit("changeComponent");
            }
          }
        });
      } else {
        console.log(this.startCoord.x);
        TweenMax.to(this.$refs.characterRomo, 1, {
          y: 0 + "px",
          ease: Power4.easeOut
        });
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("touchstart", this.handleStart.bind(this));
    window.removeEventListener("touchend", this.handleEnd.bind(this));
    window.removeEventListener("touchmove", this.handleMove.bind(this));
    window.removeEventListener("remove", this.openFullscreen.bind(this));
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";

#room {
  svg {
    position: relative;
    width: 75%;
    margin-top: -30px;
  }
  .character-romo {
    background-image: url("~static/ui/romo.png");
    width: 35%;
    height: 100px;
    background-repeat: no-repeat;
    background-size: contain;
    margin: -5% auto 0 auto;
    position: relative;
    z-index: 1;
  }
}
</style>
