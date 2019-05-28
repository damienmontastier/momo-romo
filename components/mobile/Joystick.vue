<template>
  <div id="joystick">
    <div ref="stick" id="stick"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { TweenMax } from "gsap";

export default {
  data() {
    return {
      dragStart: null,
      stick: null
    };
  },
  computed: {},
  mounted() {
    this.stick = this.$refs.stick;

    //Desktop Events debug
    this.stick.addEventListener("mousedown", this.handleMouseDown.bind(this));
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));

    //Mobile Events
    this.stick.addEventListener("touchstart", this.handleMouseDown.bind(this));
    document.addEventListener("touchmove", this.handleMouseMove.bind(this));
    document.addEventListener("touchend", this.handleMouseUp.bind(this));
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

      let distance = Math.min(50, Math.hypot(xDiff, yDiff));

      let xNew = distance * Math.cos(angle);
      let yNew = distance * Math.sin(angle);

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
    }
  }
};
</script>

<style lang="scss" scoped>
#joystick {
  background: transparent;
  border: 1px solid yellow;
  width: 100px;
  height: 100px;
  border-radius: 100px;
  position: absolute;
  top: 50%;
  left: 50%;

  #stick {
    position: relative;
    background: blue;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    top: calc(50% - 25px);
    left: calc(50% - 25px);
  }
}
</style>
