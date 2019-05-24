<template>
  <div id="mobileStage">
    <!-- <h1>Mobile Stage</h1> -->
    <kintsugi v-if="$route.params.level === 'kintsugi'"></kintsugi>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import Kintsugi from "@/components/mobile/Kintsugi";

export default {
  computed: {},
  mounted() {},
  methods: {},
  components: {
    Kintsugi
  }
};
</script>

<style lang="scss" scoped>
</style>
