<template>
  <div class="mobile-layout" id="room">
    <div>
      <p class="skew stroke">You are</p>
      <synchedTitle></synchedTitle>
    </div>
    <div class="character-romo"></div>
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
    handleMove(event){
      console.log(event.changedTouches[0].clientY)
    },
    handleStart(event) {
      this.startCoord.x = event.touches[0].clientX;
      this.startCoord.y = event.touches[0].clientY;
    },
    handleEnd(event) {
      this.endCoord.x = event.changedTouches[0].clientX;
      this.endCoord.y = event.changedTouches[0].clientY;
      this.handleGesture();
    },
    handleGesture() {
      let distanceY = this.startCoord.y - this.endCoord.y;
      let distanceX = this.startCoord.x - this.endCoord.x;
      if (
        this.startCoord.y > this.endCoord.y &&
        distanceX < 50 &&
        distanceY > 80
      ) {
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
    }
  },
  beforeDestroy() {
    window.removeEventListener("touchstart", this.handleStart.bind(this));
    window.removeEventListener("touchend", this.handleEnd.bind(this));
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
    width: 25%;
    height: 100px;
    background-repeat: no-repeat;
    background-size: contain;
    margin: -5% auto 0 auto;
    position: relative;
    z-index: 1;
  }
}
</style>
