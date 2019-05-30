<template>
  <div id="level">
      <room v-if="isRoom"></room>
      <level v-else></level>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import level from "@/components/level";
import room from "@/components/room";

export default {
  // middleware: "loadStage",

  // async validate({ params, store, redirect }) {
  //   let list = await store.dispatch("loadStagesList");
  //   return Object.values(list).includes(params.level);
  // },

  components: {
    level,
    room
  },
  data: () => {
    return {
      renderComponent: true,
      isRoom: false
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
#level{
  width: 100%;
  height: 100%;
}
</style>
