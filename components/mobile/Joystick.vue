<template>
  <div id="border">
    <div id="joystick">
      <div ref="stick" id="stick"></div>
    </div>
    <joystickArrow></joystickArrow>
  </div>
</template>

<script>
Math.degrees = function(radians) {
  return (radians * 180) / Math.PI;
};

function map_range(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

function map_roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

import { mapState } from "vuex";
import { TweenMax } from "gsap";
import joystickArrow from "@/components/mobile/svg/joystick_arrows";
import roomVue from "../room.vue";

export default {
  components: {
    joystickArrow
  },
  data() {
    return {
      dragStart: null,
      stick: null,
      joystickCoord: {
        x: 0,
        y: 0
      },
      speed: 0
    };
  },
  computed: {},
  mounted() {
    this.stick = this.$refs.stick;

    this.stick.addEventListener("touchstart", this.handleMouseDown.bind(this));
    document.addEventListener("touchmove", this.handleMouseMove.bind(this));
    document.addEventListener("touchend", this.handleMouseUp.bind(this));
  },
  watch: {
    speed(value) {
      this.modifyValue(value);
      console.log(this.joystickCoord.x)
    }
  },
  methods: {
    handleMouseDown(event) {
      if (event.changedTouches) {
        this.dragStart = {
          x: event.changedTouches[0].clientX,
          y: event.changedTouches[0].clientY
        };
        return;
      }
      this.dragStart = {
        x: event.clientX,
        y: event.clientY
      };
    },
    handleMouseMove(event) {
      if (this.dragStart === null) return;

      if (event.changedTouches) {
        event.clientX = event.changedTouches[0].clientX;
        event.clientY = event.changedTouches[0].clientY;
      }

      let xDiff = event.clientX - this.dragStart.x;
      let yDiff = event.clientY - this.dragStart.y;

      let angle = Math.atan2(yDiff, xDiff);
      let angleDeg = Math.degrees(angle);

      let distance = Math.min(60, Math.hypot(xDiff, yDiff));

      this.speed = Math.round(map_range(distance, 0, 60, 1, 10));

      let xNew = distance * Math.cos(angle);
      let yNew = distance * Math.sin(angle);

      this.joystickCoord.x = map_roundToTwo(Math.cos(angle));
      this.joystickCoord.y = map_roundToTwo(-Math.sin(angle));

      this.stick.style.transform = `translate(${xNew}px, ${yNew}px)`;

      TweenMax.to(this.stick, 0.5, {
        x: xNew + "px",
        y: yNew + "px",
        ease: Power3.easeOut
      });
    },
    handleMouseUp(event) {
      if (this.dragStart === null) return;
      TweenMax.to(this.stick, 0.5, {
        x: 0,
        y: 0,
        ease: Power3.easeOut
      });
      this.dragStart = null;
      this.currentPos = { x: 0, y: 0 };

      TweenMax.to(this, 0.25, {
        speed: 0,
        ease: Power4.easeInOut
      });
    },
    modifyValue(value) {
      if (this.socket) {
        this.socket.emit("custom-event", {
          name: "coordonate-joystick",
          in: this.roomID,
          args: {
            joystickCoord: this.joystickCoord,
            speed: value
          }
        });
      }
    }
  },
  computed: {
    ...mapState({
      socket: state => state.synchro.socket,
      roomID: state => state.synchro.roomID
    })
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";
#border {
  background: transparent;
  width: 250px;
  height: 250px;
  position: relative;
  border-radius: 100%;
  border: 5px solid $a;

  #joystick {
    background: transparent;
    border: 2px solid $a;
    border-radius: 50px;
    width: 100px;
    height: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    background-image: url("~static/ui/mobile/joystick/joystick_center.png");
    background-size: cover;
    transform: translate(-50%, -50%);

    #stick {
      position: relative;
      background: white;
      border: 2px solid $a;
      width: 100px;
      height: 100px;
      border-radius: 50px;
      top: calc(50% - 50px);
      left: calc(50% - 50px);
    }
  }
  svg {
    width: 200px;
    height: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
  }
}
</style>
