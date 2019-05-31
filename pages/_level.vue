<template>
  <div id="level">
    <component v-if="isRoom" v-on:changeComponent="changeComponent" v-bind:is="components[numberComponent]"></component>
    <Level v-else></Level>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import Level from "@/components/level";
import Room from "@/components/room";
import Wait from "@/components/wait";
import Navigate from "@/components/navigate";

export default {
  // middleware: "loadStage",

  // async validate({ params, store, redirect }) {
  //   let list = await store.dispatch("loadStagesList");
  //   return Object.values(list).includes(params.level);
  // },

  components: {
    Level,
    Room,
    Navigate,
    Wait
  },
  data: () => {
    return {
      renderComponent: true,
      isRoom: false,
      components: ["room", "wait", "navigate"],
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
  beforeDestroy() {
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
