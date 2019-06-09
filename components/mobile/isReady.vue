<template>
  <div id="isReady">
    <div class="container" ref="isReady">
      <div class="left">
        <div class="container">
          <div class="swipe" ref="swipe">
            <div class="bar"></div>
            <div class="circle" ref="circle">
              <div class="arrow"></div>
            </div>
          </div>
          <div class="wording stroke skew">Ready? swipe!</div>
        </div>
      </div>
      <div class="right">
        <div class="container">
          <span class="title skew">
            <div class="inline fill-en">apply glue</div>
          </span>
          <p class="book skew">Play after Momo.<br><b class="semi">Trace to apply golden glue</b> along the broken pieces.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {TweenLite} from 'gsap'
export default {
  mounted() {
    this.$refs.circle.addEventListener('touchstart',this.onTouchStart.bind(this))
    this.$refs.circle.addEventListener('touchend',this.onTouchEnd.bind(this))
    this.$refs.swipe.addEventListener('touchmove',this.onTouchMove.bind(this))
    TweenLite.to(this.$refs.isReady,0.5, {
      ease:Power4.easeOut,
      opacity:1
    })
  },
  computed: {
    ...mapState({
      socket: state => state.synchro.socket,
      roomID: state => state.synchro.roomID
    })
  },
  methods: {
    onTouchStart(event) {
      console.log('touchstart')
      this.touchStart = event.touches[0].clientY
    },
    onTouchEnd(event) {
      if(!this.isReady){
        this.touchStart = false
        TweenLite.to(this.$refs.circle,0.5, {
          ease:Power4.easeOut,
          y:0
        })
      }
    },
    onTouchMove(event) {
      if(this.touchStart && !this.isReady) {
        let deltaY = Math.min(Math.max(this.touchStart - event.touches[0].clientY,0),this.$refs.swipe.offsetHeight)
        if(deltaY === this.$refs.swipe.offsetHeight) {
          this.setIsReady()
        } else {
          TweenLite.to(this.$refs.circle,0.5, {
            ease:Power4.easeOut,
            y:-deltaY
          })
        }

      }
    },
    setIsReady() {
      this.isReady = true
      if (this.socket) {
        console.log('emit kintsugi romo is ready',this.roomID)
        this.socket.emit("custom-event", {
          name: "kintsugi mini-game",
          in: this.roomID,
          args: {
            id: 'romo is ready'
          }
        });
      }
    }
  },
  beforeDestroy() {
    this.$refs.circle.removeEventListener('touchstart',this.onTouchStart.bind(this))
    this.$refs.circle.removeEventListener('touchend',this.onTouchEnd.bind(this))
    this.$refs.circle.removeEventListener('touchmove',this.onTouchMove.bind(this))
  }
};
</script>

<style lang="scss" scoped>
.inline {
  display: inline;
}
.title {
  margin-bottom: 8px; 
}
#isReady {
  z-index: 3;
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0px;
  left: 0px;
  background: #fff;
  >.container {
    opacity: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    >div {
      width: 50%;
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        padding-right: 16px;
        padding-left: 8px;
      }
    }
    .left {

      .container {
        padding-right: 8px;
        padding-left: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        .wording {
          width: 100%;
          font-size: 28px;
          text-align: center;
          margin-top: 64px;
          -webkit-text-stroke: 1px #1f1f1f;
        }
        .swipe {
          display: flex;
          position: relative;
          width: 100%;
          .bar {
            height: 180px;
            width: 28px;
            background: #f3765a;
            margin: auto;
          }
          .circle {
            position: absolute;
            width: 80px;
            height: 80px;
            border: 4px solid #f3765a;
            border-radius: 100%;
            left: calc(50% - 40px);
            bottom: -40px;
            background: #fff;
            .arrow {
              position: absolute;
              top: 25%;
              left: calc(50% - (30% / 2));
              border: #f3765a 3px solid;
              border-bottom: 0px;
              border-right: 0px;
              height: 30%;
              width: 30%;
              transform: rotate(45deg)
            }
          }
        }
      }
    }
  }
}
</style>
