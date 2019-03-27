<template>
  <section class="container">
    <h1 class="title">momo-romo</h1>

    <nuxt-link
      v-for="(level, index) in levels"
      :key="index"
      :to="{ name: 'level', params: {level: index}}"
    >{{index}}</nuxt-link>
  </section>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import levelTest from "../assets/three/level/level.js";

export default {
  components: {},
  computed: {
    ...mapState({
      counter: state => state.global.counter,
      levels: state => state.global.levels
    })
  },
  mounted() {
    const level = new levelTest();
    console.log(level);
  },
  created() {
    console.log(this.levels);
    // this.kintsugi = this.levels[Object.keys(this.levels)[0]];
    // console.log(this.kintsugi);
  },
  methods: {
    ...mapMutations({
      add: "global/increment"
    })
  }
};
</script>

<style>
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
  color: #35495e;
  letter-spacing: 1px;
}
</style>

