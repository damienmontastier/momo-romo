<template>
  <section class="container">
    <div>
      <h1 class="title">momo-romo</h1>
      <h1 class="title">{{ counter }}</h1>
    </div>
  </section>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Level1 from "../assets/three/level/testLevel.js";

export default {
  components: {},
  computed: {
    ...mapState({
      counter: state => state.global.counter
    }),
  },
  mounted() {
    const level = new Level1();
    console.log(level);
  },
  methods:{
    ...mapMutations({
      add: "global/increment"
    }),
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

