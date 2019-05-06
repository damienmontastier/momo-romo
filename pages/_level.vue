<template>
  <div>
    <section class="container">
      <room v-if="$route.query.room"></room>
      <level v-else></level>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import level from "@/components/level";
import room from "@/components/room";

export default {
  middleware: "loadStage",

  // async validate({ params, store, redirect }) {
  //   let list = await store.dispatch("loadStagesList");
  //   return Object.values(list).includes(params.level);
  // },

  components: {
    level,
    room
  },
  data: () => {
    return {};
  },
  computed: {
    ...mapState({}),
    ...mapGetters({})
  },
  created() {},
  methods: {
    ...mapMutations({})
  }
};
</script>

<style lang="scss" scoped>
</style>
