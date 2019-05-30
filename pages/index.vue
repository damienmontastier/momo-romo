<template>
  <div v-if="components[value] != null" id="home">
    <component v-on:increment="increment" v-bind:is="components[value]"></component>
    <!-- <button v-if="components[value] != 'chooseQuality'" @click="increment">Next (choose quality)</button> -->
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Motion from "@/components/ui/Motion";
import chooseQuality from "@/components/ui/chooseQuality";
import chooseKeyboard from "@/components/ui/chooseKeyboard";
import Homepage from "@/components/ui/Homepage";

export default {
  data() {
    return {
      components: ["Homepage", "chooseQuality", "chooseKeyboard", "Motion"],
      value: 0
    };
  },
  components: {
    Motion,
    chooseQuality,
    chooseKeyboard,
    Homepage
  },
  watch: {},
  computed: {
    ...mapState({
      stages: state => state.stages,
      loaded: state => state.loaded,
      quality: state => state.quality,
      keyboard: state => state.keyboard
    })
  },
  watch: {
    quality() {},
    keyboard() {}
  },
  created() {},
  mounted() {},
  methods: {
    increment() {
      if (this.value === this.components.length - 1) {
        console.log("SYNCHRO");
        this.$router.push("/synchro");
      } else {
        this.value++;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#home {
  height: 100%;
  width: 100%;
}
</style>
