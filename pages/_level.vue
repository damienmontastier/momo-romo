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
import { mapState, mapGetters, mapMutations } from "vuex";
import Level from "@/components/Level";
import synchRomo from "@/components/mobile/SynchRomo";
import waitingPageRomo from "@/components/mobile/WaitingPageRomo";
import navigateRomo from "@/components/mobile/NavigateRomo";

export default {
  // middleware: "loadStage",

  // async validate({ params, store, redirect }) {
  //   let list = await store.dispatch("loadStagesList");
  //   return Object.values(list).includes(params.level);
  // },

  components: {
    Level,
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
