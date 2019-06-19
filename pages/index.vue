<template>
  <div id="home">
    <component
      v-on:increment="increment"
      v-bind:is="components[value]"
      v-if="value !== 3"
      ref="dynamicComp"
      class="dynamic_comp"
      :class="{'out':(value === 4)}"
    ></component>
    <div
      class="motion"
      ref="motion_container"
      v-show="(value === 3 || value === 4) && isMotionReady === true"
    >
      <motion v-on:end="animationOut" ref="motion"/>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Motion from "@/components/ui/Motion";
import chooseQuality from "@/components/ui/chooseQuality";
import chooseKeyboard from "@/components/ui/chooseKeyboard";
import Homepage from "@/components/ui/Homepage";
import Synchro from "@/components/ui/Synchro";

import transition_windows from "~/static/sounds/transition_windows.mp3";

import { TweenMax } from "gsap";
import HowlerManager from "~/assets/js/utils/HowlerManager";

export default {
  transition: {
    mode: "out-in",
    css: false,
    leave(el, done) {
      let tl = new TimelineMax({
        onComplete: () => {
          done();
        }
      });
      tl.to(el, 1, {
        opacity: 0
      });
    }
  },
  data() {
    return {
      components: [
        "Homepage",
        "chooseQuality",
        "chooseKeyboard",
        "",
        "Synchro"
      ],
      value: 0,
      isMotionReady: false
    };
  },
  components: {
    Motion,
    chooseQuality,
    chooseKeyboard,
    Homepage,
    Synchro
  },
  watch: {
    value() {
      if (this.value === 2) {
        this.$refs.motion.load().then(() => {
          this.isMotionReady = true;
        });
      } else if (this.value === 3) {
        this.$refs.motion.start();
      }
    }
  },
  computed: {
    ...mapState({
      stages: state => state.stages,
      loaded: state => state.loaded,
      quality: state => state.quality,
      keyboard: state => state.keyboard
    })
  },
  created() {
    this.loadSounds().then(() => {});
  },
  mounted() {},
  methods: {
    loadSounds() {
      return new Promise((resolve, reject) => {
        HowlerManager.add([
          {
            id: "transition_windows",
            src: transition_windows
          }
        ]).then(sounds => {
          this.sounds = sounds;
          resolve();
        });
      });
    },
    increment() {
      this.value++;
    },
    animationOut() {
      this.value = 4;
      setTimeout(() => {
        this.sounds.transition_windows.play();
        let tl = new TimelineMax();
        tl.add("start", 0)
          .to(
            this.$refs["motion_container"],
            2,
            {
              x: -window.innerWidth,
              ease: Power4.easeOut
            },
            "start"
          )
          .to(
            this.$refs["dynamicComp"].$el,
            2,
            {
              x: 0,
              delay: 0.5,
              ease: Power4.easeOut
            },
            "start"
          );
      }, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  overflow: hidden;
}
#home {
  height: 100%;
  width: 100%;
}

.dynamic_comp,
.motion {
  position: absolute;
  left: 0px;
  height: 0px;
  width: 100%;
  height: 100%;
}

.dynamic_comp.out {
  transform: translateX(100vw);
}
</style>
