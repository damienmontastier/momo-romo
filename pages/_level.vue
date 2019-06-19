<template>
  <div id="level">
    <component
      v-if="isRoom"
      v-on:changeComponent="changeComponent"
      v-bind:is="components[numberComponent]"
    ></component>
    <level v-else></level>
  </div>
</template>

<script>
import { TimelineMax } from "gsap";
import { mapState, mapGetters, mapMutations } from "vuex";
import level from "@/components/level";
import synchRomo from "@/components/mobile/SynchRomo";
import waitingPageRomo from "@/components/mobile/WaitingPageRomo";
import navigateRomo from "@/components/mobile/NavigateRomo";

export default {
  transition: {
    css: false,
    mode: "out-in",
    enter(el, done) {
      let tl = new TimelineMax({
        onComplete: () => {
          done();
        }
      });
      tl.from(el, 1, {
        opacity: 0
      });
    }
  },
  components: {
    level,
    synchRomo,
    navigateRomo,
    waitingPageRomo
  },
  data: () => {
    return {
      renderComponent: true,
      isRoom: false,
      components: ["synchRomo", "waitingPageRomo", "navigateRomo"],
      numberComponent: 0
    };
  },
  computed: {
    ...mapState({}),
    ...mapGetters({})
  },
  mounted() {},
  created() {
    this.$store.dispatch("loadStagesList").then(stages => {
      if (!Object.values(stages).includes(this.$route.params.level)) {
        this.isRoom = true;
      }
    });
  },
  methods: {
    changeComponent() {
      this.numberComponent++;
    },
    ...mapMutations({
      resetLoaded: "game/resetLoaded"
    })
  },
  destroyed() {
    this.resetLoaded();
  }
};
</script>

<style lang="scss" scoped>
#level {
  width: 100%;
  height: 100%;
}
</style>
