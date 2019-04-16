<template>
  <section class="container">
    <h1 class="title">momoo-romo</h1>

    <nuxt-link
      v-for="(level, index) in stages"
      :key="index"
      :to="{ name: 'level', params: {level: index}}"
    >{{index}}</nuxt-link>
  </section>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  middleware: "firebaseStages",
  components: {},
  watch: {
    // loaded() {
    //   this.init();
    // }
  },
  computed: {
    ...mapState({
      stages: state => state.stages,
      loaded: state => state.loaded
    })
  },
  created() {
    // this.$store.dispatch("get");
  },
  mounted() {
    console.log("index", this.stages);
  },
  methods: {
    // init() {
    //   // console.log(this.stages);
    // }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  letter-spacing: 1px;
}
</style>
